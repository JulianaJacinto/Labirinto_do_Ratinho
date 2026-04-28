from flask import Flask, render_template, request, jsonify, send_from_directory
from BuscaNP import BuscaNP

app = Flask(__name__)
buscador = BuscaNP()

@app.route('/static/labirintos.json')
def serve_presets():
    return send_from_directory('static', 'labirintos.json')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/final')
def final_page():
    return render_template('final.html')

@app.route('/resolver', methods=['POST'])
def resolver():
    dados = request.json
    mapa = dados['mapa']
    inicio = dados['inicio']
    fim = dados['fim']
    metodo = dados['metodo']
    
    # Dimensões do mapa
    nx = len(mapa)
    ny = len(mapa[0])

    # Mapeamento dos métodos conforme seu BuscaNP.py
    algoritmos = {
        'amplitude': buscador.amplitude,
        'profundidade': buscador.profundidade,
        'prof_limitada': lambda i, f, x, y, m: buscador.prof_limitada(i, f, x, y, m, lim=20),
        'aprof_iterativo': lambda i, f, x, y, m: buscador.aprof_iterativo(i, f, x, y, m, lim_max=50),
        'bidirecional': buscador.bidirecional,
        'custo_uniforme': buscador.custo_uniforme,
        'greddy': buscador.greddy,
        'a_estrela': buscador.a_estrela,
        'aia_estrela': buscador.aia_estrela
    }

    funcao_busca = algoritmos.get(metodo)
    
    if funcao_busca:
        caminho = funcao_busca(inicio, fim, nx, ny, mapa)
        return jsonify({"caminho": caminho})
    
    return jsonify({"erro": "Método não encontrado"}), 400

if __name__ == '__main__':
    # O debug=True permite que o servidor reinicie sozinho a cada mudança no código
    app.run(debug=True)
    