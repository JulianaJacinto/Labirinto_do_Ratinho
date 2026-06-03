# 🐭 Labirinto do Ratinho - Busca em Inteligência Artificial

Um projeto interativo diciplinar que implementa **9 algoritmos de busca em árvore** para resolver com a temática de jogos de labirintos.

---

## 📖 Sobre o Projeto

Este projeto educacional demonstra como diferentes algoritmos de busca funcionam na prática. Um ratinho 🐭 precisa encontrar o caminho mais eficiente até o queijo 🧀 em um labirinto, usando diversos métodos de inteligência artificial.

### Algoritmos Implementados

| Algoritmo | Tipo | Garante Ótimo? | Custo de Memória | Use Quando... |
|-----------|------|----------------|------------------|--------------|
| **Amplitude (BFS)** | Sem Informação | ✅ Sim | Alto | Quer o caminho mais curto |
| **Profundidade (DFS)** | Sem Informação | ❌ Não | Baixo | Tem pouca memória disponível |
| **Profundidade Limitada** | Sem Informação | ❌ Não | Baixo | Quer evitar caminhos muito longos |
| **Aprofundamento Iterativo** | Sem Informação | ✅ Sim | Médio | Quer garantir otimalidade com menos memória |
| **Bidirecional** | Sem Informação | ✅ Sim | Médio | Conhece o objetivo e quer ser rápido |
| **Custo Uniforme** | Sem Informação | ✅ Sim | Alto | Tem custos variados entre movimentos |
| **Greedy (Guloso)** | Informado | ❌ Não | Médio | Quer ser rápido (pode não ser ótimo) |
| **A-estrela (A\*)** | Informado | ✅ Sim | Alto | Melhor equilíbrio: rápido E ótimo ⭐ |
| **IDA-estrela (IDA\*)** | Informado | ✅ Sim | Baixo | Quer garantir ótimo com pouca memória |

---

## 🎮 Características Principais

✨ **Interface Gráfica Intuitiva**
- Seleção visual de algoritmos
- Definição interativa de pontos iniciais e finais
- Visualização em tempo real do caminho encontrado
- Estatísticas de desempenho (nós visitados, tamanho do caminho, tempo)

🎨 **Design Responsivo**
- Layout com 3 painéis (esquerdo, centro, direito)
- Cores personalizadas por algoritmo
- Animações suaves e feedback visual

📊 **Múltiplos Presets de Labirintos**
- Diferentes níveis de dificuldade
- Validação de solvibilidade por algoritmo

🔊 **Efeitos Sonoros**
- Feedback auditivo (ligável/desligável)
- Sons diferentes para sucesso, erro e vitória

---

## 🛠️ Requisitos do Sistema

### Mínimos:
- **Python** 3.7 ou superior
- **pip** (gerenciador de pacotes Python)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Recomendados:
- **Virtual Environment** (venv)
- **Git** para controle de versão

---

## 📥 Instalação Passo a Passo

### Windows

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/JulianaJacinto/Labirinto_do_Ratinho.git
   cd Labirinto_do_Ratinho
   ```

2. **Crie um ambiente virtual:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

### macOS e Linux

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/JulianaJacinto/Labirinto_do_Ratinho.git
   cd Labirinto_do_Ratinho
   ```

2. **Crie um ambiente virtual:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 Como Executar

1. **Ative o ambiente virtual** (se ainda não estiver ativado):
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

2. **Inicie o servidor Flask:**
   ```bash
   python app.py
   ```

3. **Abra o navegador:**
   - Acesse `http://localhost:5000`

4. **A interface carregará automaticamente!** 🎉

---

## 🎯 Como Usar

### Passo 1: Selecione um Algoritmo
- Dropdown **"Algoritmo"** no painel esquerdo
- Leia a descrição e qual tipo de queijo representa

### Passo 2: Escolha um Preset (Opcional)
- Dropdown **"Preset do Labirinto"**
- Cada preset tem dificuldade e características diferentes

### Passo 3: Defina o Início (Rato) 🐭
- Clique no botão **"Definir"** na seção "Início"
- Clique em qualquer célula do labirinto
- A posição será exibida em `[x, y]`

### Passo 4: Defina o Fim (Queijo) 🧀
- Clique no botão **"Definir"** na seção "Fim"
- Clique em qualquer célula do labirinto
- A posição será exibida em `[x, y]`

### Passo 5: Execute o Algoritmo
- Clique no botão **"Ache o Queijo!"**
- Observe a animação:
  - 🔵 Azul = nós explorados
  - 🟨 Amarelo = caminho final

### Passo 6: Analise os Resultados
- **Nós visitados**: Quantas células foram exploradas
- **Tamanho do caminho**: Quantas células tem o caminho encontrado
- **Tempo execução**: Quanto tempo levou a busca

---

## 📁 Estrutura do Projeto

```
Labirinto_do_Ratinho/
│
├── README.md                    # Este arquivo
├── requirements.txt             # Dependências do projeto
├── app.py                       # Servidor Flask principal
├── BuscaNP.py                   # Implementação dos 9 algoritmos
├── Node.py                      # Classe Node para a árvore de busca
│
├── static/                      # Arquivos estáticos (frontend)
│   ├── main.js                  # Lógica principal e UI listeners
│   ├── maze.js                  # Geração e visualização do labirinto
│   ├── style.css                # Estilos CSS customizados
│   ├── labirintos.json          # Presets de labirintos
│   └── assets/                  # Imagens e recursos (pasta vazia)
│
└── templates/                   # Arquivos HTML (Flask)
    ├── index.html               # Interface principal
    └── final.html               # Página de celebração
```

### Descrição dos Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `app.py` | Configuração do servidor Flask, rotas e API |
| `BuscaNP.py` | Implementação de todos os 9 algoritmos de busca |
| `Node.py` | Classe que representa um nó na árvore de busca |
| `main.js` | Configuração do Tailwind, listeners de UI, sons |
| `maze.js` | Renderização do labirinto, animações |
| `style.css` | Estilos customizados (além do Tailwind) |
| `labirintos.json` | Dados dos presets de labirintos |

---

## 🎨 Personalização

### Adicionar Novos Labirintos

Edite `static/labirintos.json`:

```json
{
  "id": "seu_labirinto",
  "name": "Nome do Seu Labirinto",
  "description": "Descrição do nível de dificuldade",
  "map": [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0]
  ],
  "start": [0, 0],
  "end": [3, 4],
  "expected": {
    "profundidade": false,
    "prof_limitada": false
  }
}
```

**Legenda do mapa:**
- `0` = célula livre (pode passar)
- `1` = parede (bloqueado)

---

## 🐛 Solução de Problemas

### Erro: "Port 5000 already in use"
```bash
# Mude a porta em app.py:
app.run(debug=True, port=5001)
```

### Erro: "ModuleNotFoundError: No module named 'flask'"
```bash
# Reinstale as dependências
pip install --upgrade -r requirements.txt
```

### O labirinto não carrega ou fica vazio
1. Verifique se `static/labirintos.json` existe
2. Verifique o console do navegador (F12) para erros
3. Limpe o cache do navegador (Ctrl+Shift+Del)

### A animação está muito rápida/lenta
- Use o slider **"Velocidade"** na interface
- Ou altere em `maze.js` a variável `animationSpeed`

### Sons não funcionam
- Alguns navegadores bloqueiam áudio por padrão
- Clique no botão 🔊 para ativar/desativar
- Verifique volume do sistema

---
**Desenvolvido com ❤️ e dedicação para aprender Inteligência Artificial**
