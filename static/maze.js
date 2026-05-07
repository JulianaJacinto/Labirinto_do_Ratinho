
// ── Maze State ─────────────────────────────────────────────
const mazeState = {
    mapa: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
    ],
    inicio: [0, 0],
    fim: [9, 10],
    animationSpeed: 200, // milisegundos
    selectionMode: null, // 'start', 'end', ou null
};

// ── Maze Utilities ─────────────────────────────────────────
function getMapReference()  { return mazeState.mapa; }
function getStartPosition() { return [...mazeState.inicio]; }
function getEndPosition()   { return [...mazeState.fim]; }

function setStartPosition(row, col) { mazeState.inicio = [row, col]; }
function setEndPosition(row, col)   { mazeState.fim    = [row, col]; }
function setAnimationSpeed(speed)   { mazeState.animationSpeed = speed; }
function getAnimationSpeed()        { return mazeState.animationSpeed; }
function setSelectionMode(mode)     { mazeState.selectionMode = mode; }
function getSelectionMode()         { return mazeState.selectionMode; }

// ── Helpers de célula ──────────────────────────────────────
function isCellWall(value)      { return value === 1; }
function isCellFree(value)      { return value === 0; }
function isCellHeavy(value)     { return value === 2; }   // armadilha (ratoeira)
function isCellPassable(value)  { return value !== 1; }   // 0 ou 2

// ── Create Maze Grid ───────────────────────────────────────
function createMazeGrid() {
    const container = document.getElementById('labirinto');
    container.innerHTML = '';
    container.style.display = 'grid';

    const mapa    = mazeState.mapa;
    const colunas = mapa[0].length;
    const linhas  = mapa.length;

    container.style.gridTemplateColumns = `repeat(${colunas}, var(--tamanho-celula))`;

    for (let r = 0; r < linhas; r++) {
        for (let c = 0; c < colunas; c++) {
            const cellValue = mapa[r][c];
            const div = document.createElement('div');
            div.id = `cel-${r}-${c}`;
            div.classList.add('celula');

            if (mazeState.selectionMode) {
                div.style.cursor = mazeState.selectionMode === 'start' ? 'crosshair' : 'pointer';
            }

            div.onclick = () => handleCellClick(r, c);

            if (isCellWall(cellValue)) {
                div.classList.add('parede');
            } else {
                if (isCellHeavy(cellValue)) {
                    div.classList.add('ratoeira');
                }
                if (r === mazeState.inicio[0] && c === mazeState.inicio[1]) {
                    div.classList.add('rato-inicio');
                }
                if (r === mazeState.fim[0] && c === mazeState.fim[1]) {
                    div.classList.add('queijo');
                    renderCheeseCell(div);
                }
            }

            container.appendChild(div);
        }
    }

    updatePositionDisplay();
}

// ── Handle Cell Click ──────────────────────────────────────
function handleCellClick(r, c) {
    if (!isCellPassable(mazeState.mapa[r][c])) return;

    if (mazeState.selectionMode === 'start') {
        document.querySelector('.rato-inicio')?.classList.remove('rato-inicio');
        document.querySelector('.rato-correndo')?.classList.remove('rato-correndo');
        document.querySelector('.rato-chegada')?.classList.remove('rato-chegada');
        setStartPosition(r, c);
        createMazeGrid();
        finishSelectionMode();
    } else if (mazeState.selectionMode === 'end') {
        document.querySelector('.queijo')?.classList.remove('queijo');
        document.querySelector('.cheese-image')?.classList.remove('cheese-image');
        setEndPosition(r, c);
        createMazeGrid();
        finishSelectionMode();
    }
}

function renderCheeseCell(div, preserveRat = false) {
    div.classList.remove('cheese-image');
    div.style.backgroundImage = '';
    div.textContent = '';

    const cheese = typeof getCurrentCheeseRepresentation === 'function'
        ? getCurrentCheeseRepresentation()
        : { type: 'emoji', emoji: '🧀', image: '', className: '' };

    if (cheese.type === 'image' && cheese.image) {
        div.classList.add('cheese-image');
        div.style.backgroundImage = `url('${cheese.image}')`;
        div.textContent = '';
    } else {
        div.textContent = preserveRat ? `🐭${cheese.emoji}` : cheese.emoji;
    }

    if (cheese.className) div.classList.add(cheese.className);
}

// ── Begin / End Selection Mode ─────────────────────────────
function startSelectionMode(mode) {
    setSelectionMode(mode);
    const btnStart = document.getElementById('btn-set-start');
    const btnEnd   = document.getElementById('btn-set-end');

    if (mode === 'start') {
        btnStart?.classList.add('ring-2', 'ring-yellow-400');
        btnEnd?.classList.remove('ring-2', 'ring-yellow-400');
        btnStart?.setAttribute('aria-pressed', 'true');
        btnEnd?.setAttribute('aria-pressed', 'false');
    } else if (mode === 'end') {
        btnEnd?.classList.add('ring-2', 'ring-yellow-400');
        btnStart?.classList.remove('ring-2', 'ring-yellow-400');
        btnEnd?.setAttribute('aria-pressed', 'true');
        btnStart?.setAttribute('aria-pressed', 'false');
    }

    createMazeGrid();
}

function finishSelectionMode() {
    setSelectionMode(null);
    const btnStart = document.getElementById('btn-set-start');
    const btnEnd   = document.getElementById('btn-set-end');
    btnStart?.classList.remove('ring-2', 'ring-yellow-400');
    btnEnd?.classList.remove('ring-2', 'ring-yellow-400');
    btnStart?.setAttribute('aria-pressed', 'false');
    btnEnd?.setAttribute('aria-pressed', 'false');
    createMazeGrid();
}

// ── Update Position Display ────────────────────────────────
function updatePositionDisplay() {
    const posStart = document.getElementById('pos-start');
    const posEnd   = document.getElementById('pos-end');
    if (posStart) posStart.textContent = `[${mazeState.inicio[0]}, ${mazeState.inicio[1]}]`;
    if (posEnd)   posEnd.textContent   = `[${mazeState.fim[0]}, ${mazeState.fim[1]}]`;
}

// ── Reset Stats ────────────────────────────────────────────
function resetStats() {
    const ids = ['stat-visitados', 'stat-caminho', 'stat-tempo'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
    });
}

// ── Solve Maze ─────────────────────────────────────────────
async function solveMaze() {
    const metodo = document.getElementById('metodo').value;
    const button = document.getElementById('btn-solve');

    if (button) {
        button.disabled = true;
        button.style.opacity = '0.5';
    }

    clearMazeVisualization();

    const tempoInicio = performance.now();

    try {
        const dadosParaEnvio = {
            mapa:   mazeState.mapa,   // inclui valores 0, 1 e 2
            inicio: mazeState.inicio,
            fim:    mazeState.fim,
            metodo: metodo
        };

        const resposta = await fetch('/resolver', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaEnvio)
        });

        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const resultado = await resposta.json();
        const tempoFim  = performance.now();
        const tempoExecucao = (tempoFim - tempoInicio).toFixed(2);

        if (resultado.caminho && resultado.caminho.length > 0) {
            playSound('sucesso');
            await animatePath(resultado.caminho);

            const noVisitados  = resultado.caminho.length - 1;
            const taminhoCaminho = resultado.caminho.length;

            const statVisitados = document.getElementById('stat-visitados');
            const statCaminho   = document.getElementById('stat-caminho');
            const statTempo     = document.getElementById('stat-tempo');

            if (statVisitados) statVisitados.textContent = noVisitados;
            if (statCaminho)   statCaminho.textContent   = taminhoCaminho;
            if (statTempo)     statTempo.textContent      = `${tempoExecucao}ms`;
        } else {
            playSound('erro');
            alert('❌ Nenhum caminho encontrado para o queijo!');
            resetStats();
        }
    } catch (erro) {
        console.error('Erro ao resolver labirinto:', erro);
        playSound('erro');
        alert('❌ Erro ao processar o labirinto: ' + erro.message);
    } finally {
        button.disabled      = false;
        button.style.opacity = '1';
    }
}

// ── Animate Rat Path ───────────────────────────────────────
async function animatePath(caminho) {
    if (!caminho || caminho.length === 0) return;

    // Remove o rato da posição inicial visualmente
    const [startR, startC] = mazeState.inicio;
    const celulaInicial = document.getElementById(`cel-${startR}-${startC}`);
    if (celulaInicial) {
        celulaInicial.textContent = '';
        celulaInicial.classList.remove('rato-inicio');
    }

    for (let i = 0; i < caminho.length; i++) {
        const [linha, coluna] = caminho[i];
        const celula = document.getElementById(`cel-${linha}-${coluna}`);
        if (!celula) continue;

        celula.classList.add('rato-correndo');

        await new Promise(resolve => setTimeout(resolve, mazeState.animationSpeed));

        // Se não for a última célula, remove a classe de "correndo" para deixar o rastro
        if (i < caminho.length - 1) {
            celula.classList.remove('rato-correndo');
            celula.classList.add('visitado');
        }
    }

    // Finalização no queijo
    const [fimR, fimC] = mazeState.fim;
    const celulaFim = document.getElementById(`cel-${fimR}-${fimC}`);
    if (celulaFim) {
        celulaFim.classList.remove('rato-correndo', 'queijo', 'cheese-image');
        celulaFim.style.backgroundImage = '';
        celulaFim.textContent = '';
        celulaFim.classList.add('rato-chegada', 'caminho-final');
        
        if (typeof playSound === 'function') playSound('vitoria');
    }
}

// ── Clear Maze Visualization ───────────────────────────────
function clearMazeVisualization() {
    document.querySelectorAll('.celula').forEach(celula => {
        celula.classList.remove('visitado', 'caminho-final', 'rato-inicio', 'rato-correndo', 'rato-chegada');
        celula.textContent = '';
    });
    createMazeGrid();
}