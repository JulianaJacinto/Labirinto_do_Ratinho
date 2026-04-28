// ── Tailwind Configuration ─────────────────────────────────
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                title: ['Fredoka One', 'cursive'],
                body:  ['Nunito', 'sans-serif'],
            },
            colors: {
                queijo:  '#FFB830',
                laranja: '#FF8C42',
                fundo:   '#FFF3E0',
                parede:  '#2C3E50',
                celula:  '#fffcf4',
                trilho:  'rgba(52,152,219,0.35)',
                ouro:    '#F1C40F',
            },
            boxShadow: {
                btn:  '0 4px 0 rgba(0,0,0,0.25)',
            },
            keyframes: {
                'pop-in': {
                    '0%':   { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)',   opacity: '1' },
                },
                'wiggle': {
                    '0%,100%': { transform: 'rotate(-4deg)' },
                    '50%':     { transform: 'rotate(4deg)'  },
                }
            },
            animation: {
                'pop-in': 'pop-in 0.3s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out',
            }
        }
    }
}

// ── Initialize on Page Load ────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    initializeUIListeners();
    await loadMazePresets();
});


// ── Algorithm Metadata ────────────────────────────────────
const algorithmMetadata = {
    'amplitude': {
        description: 'BFS: Explora nó por nó, encontra o caminho mais curto',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Clássico',
        cheeseImage: '/static/assets/queijo.png',
        cheeseClass: 'cheese-classic'
    },
    'profundidade': {
        description: 'DFS: Explora profundo, usa menos memória',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo de Cabra',
        cheeseImage: null,
        cheeseClass: 'cheese-goat'
    },
    'prof_limitada': {
        description: 'DFS com limite de profundidade',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Brie',
        cheeseImage: null,
        cheeseClass: 'cheese-brie'
    },
    'aprof_iterativo': {
        description: 'Combina BFS e DFS, encontra caminho ótimo',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Suíço',
        cheeseImage: null,
        cheeseClass: 'cheese-swiss'
    },
    'bidirecional': {
        description: 'Busca de dois lados simultaneamente',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Azul',
        cheeseImage: null,
        cheeseClass: 'cheese-blue'
    },
    'custo_uniforme': {
        description: 'Expande por menor custo, garante otimalidade',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Cheddar',
        cheeseImage: null,
        cheeseClass: 'cheese-cheddar'
    },
    'greddy': {
        description: 'Guloso: rápido mas não garante caminho ótimo',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Havarti',
        cheeseImage: null,
        cheeseClass: 'cheese-havarti'
    },
    'a_estrela': {
        description: 'A*: Rápido e ótimo, usa heurística',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Gouda',
        cheeseImage: null,
        cheeseClass: 'cheese-gouda'
    },
    'aia_estrela': {
        description: 'IDA*: Combina iterativo com A*',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Parmesão',
        cheeseImage: null,
        cheeseClass: 'cheese-parmesan'
    }
};

function getAlgorithmMetadata(metodo) {
    return algorithmMetadata[metodo] || {
        description: 'Descrição não disponível',
        cheeseType: 'emoji',
        cheeseEmoji: '🧀',
        cheeseName: 'Queijo Padrão',
        cheeseImage: null,
        cheeseClass: ''
    };
}

function getCurrentCheeseRepresentation() {
    const metodo = document.getElementById('metodo')?.value;
    const meta = getAlgorithmMetadata(metodo);
    return {
        type: meta.cheeseType,
        emoji: meta.cheeseEmoji,
        image: meta.cheeseImage,
        name: meta.cheeseName,
        className: meta.cheeseClass
    };
}

function getCurrentCheeseSprite() {
    const cheese = getCurrentCheeseRepresentation();
    return cheese.type === 'image' && cheese.image ? cheese.image : cheese.emoji;
}

function getCurrentCheeseName() {
    return getCurrentCheeseRepresentation().name;
}

// ── UI State ──────────────────────────────────────────────
const uiState = {
    soundEnabled: true
};

// ── Sound System ──────────────────────────────────────────
function playSound(tipo) {
    if (!uiState.soundEnabled) return;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const agora = audioContext.currentTime;

        if (tipo === 'sucesso') {
            const notas = [262, 330, 392]; // Dó, Mi, Sol
            notas.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const envelope = audioContext.createGain();
                osc.frequency.value = freq;
                osc.connect(envelope);
                envelope.connect(audioContext.destination);
                envelope.gain.setValueAtTime(0.3, agora + i * 0.15);
                envelope.gain.exponentialRampToValueAtTime(0.01, agora + i * 0.15 + 0.15);
                osc.start(agora + i * 0.15);
                osc.stop(agora + i * 0.15 + 0.15);
            });
        } else if (tipo === 'erro') {
            const osc = audioContext.createOscillator();
            const envelope = audioContext.createGain();
            osc.frequency.value = 100;
            osc.connect(envelope);
            envelope.connect(audioContext.destination);
            envelope.gain.setValueAtTime(0.2, agora);
            envelope.gain.exponentialRampToValueAtTime(0.01, agora + 0.3);
            osc.start(agora);
            osc.stop(agora + 0.3);
        } else if (tipo === 'vitoria') {
            const notas = [392, 494, 587]; // Sol, Si, Ré
            notas.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const envelope = audioContext.createGain();
                osc.frequency.value = freq;
                osc.connect(envelope);
                envelope.connect(audioContext.destination);
                envelope.gain.setValueAtTime(0.3, agora + i * 0.1);
                envelope.gain.exponentialRampToValueAtTime(0.01, agora + i * 0.1 + 0.2);
                osc.start(agora + i * 0.1);
                osc.stop(agora + i * 0.1 + 0.2);
            });
        }
    } catch (e) {
        console.warn('Áudio não disponível:', e);
    }
}

// ── Toggle Sound ──────────────────────────────────────────
function toggleSound() {
    uiState.soundEnabled = !uiState.soundEnabled;
    const botao = document.getElementById('toggle-sound');
    botao.textContent = uiState.soundEnabled ? '🔊' : '🔇';
}

// ── Update Algorithm Description ───────────────────────────
function updateAlgorithmDescription() {
    const metodo = document.getElementById('metodo').value;
    const desc = document.getElementById('algorithm-desc');
    const meta = getAlgorithmMetadata(metodo);
    if (desc) {
        desc.textContent = `${meta.description} · Queijo: ${meta.cheeseName}`;
    }
}

// ── Setup Algorithm Description Listener ────────────────────
function setupAlgorithmListener() {
    const metodoSelect = document.getElementById('metodo');
    if (metodoSelect) {
        metodoSelect.addEventListener('change', updateAlgorithmDescription);
        updateAlgorithmDescription();
    }
}

// ── Maze Preset Loader ────────────────────────────────────
let mazePresets = [];

async function loadMazePresets() {
    const presetSelect = document.getElementById('preset-select');
    const presetDesc = document.getElementById('preset-desc');

    try {
        const response = await fetch('/static/labirintos.json');
        if (!response.ok) {
            throw new Error(`Falha ao carregar presets: ${response.status}`);
        }

        mazePresets = await response.json();
        populatePresetSelector();

        if (mazePresets.length > 0) {
            applyPreset(mazePresets[0].id);
        } else if (presetDesc) {
            presetDesc.textContent = 'Nenhum preset disponível.';
        }
    } catch (error) {
        console.warn(error);
        if (presetSelect) {
            presetSelect.innerHTML = '<option value="">Erro ao carregar presets</option>';
        }
        if (presetDesc) {
            presetDesc.textContent = 'Não foi possível carregar os presets do labirinto.';
        }
        createMazeGrid();
    }
}

function populatePresetSelector() {
    const presetSelect = document.getElementById('preset-select');
    if (!presetSelect) return;

    presetSelect.innerHTML = mazePresets
        .map(preset => `<option value="${preset.id}">${preset.name}</option>`)
        .join('');
}

function getPresetById(presetId) {
    return mazePresets.find(preset => preset.id === presetId);
}

function applyPreset(presetId) {
    const preset = getPresetById(presetId);
    if (!preset) return;

    mazeState.mapa = preset.map.map(row => [...row]);
    setStartPosition(preset.start[0], preset.start[1]);
    setEndPosition(preset.end[0], preset.end[1]);
    createMazeGrid();
    updatePresetInfo(preset);
}

function updatePresetInfo(preset) {
    const presetDesc = document.getElementById('preset-desc');
    const expected = document.getElementById('preset-expected');
    if (presetDesc) {
        presetDesc.textContent = preset.description || '';
    }
    if (expected) {
        const failedAlgorithms = Object.keys(preset.expected || {})
            .filter(key => preset.expected[key] === false)
            .map(formatAlgorithmLabel);

        if (failedAlgorithms.length === 0) {
            expected.textContent = 'Todos os algoritmos devem resolver este labirinto.';
        } else {
            expected.textContent = `Algoritmos que podem falhar neste preset: ${failedAlgorithms.join(', ')}.`;
        }
        expected.classList.remove('hidden');
    }
}

function formatAlgorithmLabel(key) {
    const labels = {
        amplitude: 'BFS',
        profundidade: 'DFS',
        prof_limitada: 'DFS Limitada',
        aprof_iterativo: 'Aprof. Iterativo',
        bidirecional: 'Bidirecional',
        custo_uniforme: 'Custo Uniforme',
        greddy: 'Greedy',
        a_estrela: 'A*',
        aia_estrela: 'AIA*'
    };
    return labels[key] || key;
}

// ── Navigation: GitHub ────────────────────────────────────
function toggleGitHub() {
    window.open('https://github.com/JulianaJacinto', '_blank');
}

// ── Navigation: Final Scene ───────────────────────────────
function toggleFinal() {
    window.location.href = '/final';
}

// ── Initialize UI Event Listeners ────────────────────────
function initializeUIListeners() {
    setupAlgorithmListener();
    
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
        presetSelect.addEventListener('change', event => {
            applyPreset(event.target.value);
        });
    }

    const speedSlider = document.getElementById('speed-slider');
    if (speedSlider) {
        speedSlider.addEventListener('input', updateAnimationSpeed);
        updateAnimationSpeed();
    }
}

