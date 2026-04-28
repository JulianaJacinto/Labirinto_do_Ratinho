from collections import deque
import heapq
from Node import Node

class BuscaNP(object):
    def sucessores_grid(self, st, nx, ny, mapa):
        f = []
        x, y = st[0], st[1]
        # Ordem: Direita, Esquerda, Abaixo, Acima
        movimentos = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        for dx, dy in movimentos:
            nx_pos, ny_pos = x + dx, y + dy
            if 0 <= nx_pos < nx and 0 <= ny_pos < ny:
                if mapa[nx_pos][ny_pos] == 0:
                    f.append([nx_pos, ny_pos])
        return f[::-1]

        
#--------------------------------------------------------------------------    
# EXIBE O CAMINHO ENCONTRADO NA ÁRVORE DE BUSCA
#--------------------------------------------------------------------------   
    def exibirCaminho(self, node):
        caminho = []
        while node is not None:
            # Converte tupla de volta para lista para o JSON do JS entender fácil
            caminho.append(list(node.estado))
            node = node.pai
        caminho.reverse()
        return caminho

#--------------------------------------------------------------------------    
# EXIBE O CAMINHO ENCONTRADO NA ÁRVORE DE BUSCA - BIDIRECIONAL
#--------------------------------------------------------------------------
    def exibirCaminho_Bid(self, encontro, visitado1, visitado2):
        t_encontro = tuple(encontro)
        encontro1 = visitado1[t_encontro]  
        encontro2 = visitado2[t_encontro]
        caminho1 = self.exibirCaminho(encontro1)
        caminho2 = self.exibirCaminho(encontro2)
        return caminho1 + list(reversed(caminho2[:-1]))

#--------------------------------------------------------------------------
# BUSCA EM AMPLITUDE
#--------------------------------------------------------------------------
    def amplitude(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        fila = deque([Node(None, t_inicio, 0, None, None)])
        visitado = {t_inicio: fila[0]}
        
        while fila:
            atual = fila.popleft()
            for novo in self.sucessores_grid(atual.estado, nx, ny, mapa):
                t_novo = tuple(novo)
                if t_novo not in visitado:
                    filho = Node(atual, t_novo, atual.cost + 1, None, None)
                    fila.append(filho) # Linha essencial corrigida
                    visitado[t_novo] = filho
                    if t_novo == t_fim:
                        return self.exibirCaminho(filho)
        return None

#--------------------------------------------------------------------------
# BUSCA EM PROFUNDIDADE
#--------------------------------------------------------------------------
    def profundidade(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        pilha = deque([Node(None, t_inicio, 0, None, None)])
        visitado = {t_inicio: pilha[0]}
        
        while pilha:
            atual = pilha.pop()
            for novo in self.sucessores_grid(atual.estado, nx, ny, mapa):
                t_novo = tuple(novo)
                if t_novo not in visitado:
                    filho = Node(atual, t_novo, atual.cost + 1, None, None)
                    pilha.append(filho)
                    visitado[t_novo] = filho
                    if t_novo == t_fim:
                        return self.exibirCaminho(filho)
        return None

#--------------------------------------------------------------------------
# BUSCA EM PROFUNDIDADE LIMITADA
#--------------------------------------------------------------------------
    def prof_limitada(self, inicio, fim, nx, ny, mapa, lim):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        pilha = deque([Node(None, t_inicio, 0, None, None)])
        visitado = {t_inicio: pilha[0]}
        
        while pilha:
            atual = pilha.pop()
            if atual.cost < lim:
                for novo in self.sucessores_grid(atual.estado, nx, ny, mapa):
                    t_novo = tuple(novo)
                    if t_novo not in visitado:
                        filho = Node(atual, t_novo, atual.cost + 1, None, None)
                        pilha.append(filho)
                        visitado[t_novo] = filho
                        if t_novo == t_fim:
                            return self.exibirCaminho(filho)
        return None

#--------------------------------------------------------------------------
# BUSCA EM APROFUNDAMENTO ITERATIVO
#--------------------------------------------------------------------------
    def aprof_iterativo(self, inicio, fim, nx, ny, mapa, lim_max):
        for lim in range(1, lim_max):
            resultado = self.prof_limitada(inicio, fim, nx, ny, mapa, lim)
            if resultado: return resultado
        return None

#--------------------------------------------------------------------------
# BUSCA BIDIRECIONAL
#--------------------------------------------------------------------------
    def bidirecional(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        
        raiz1 = Node(None, t_inicio, 0, None, None)
        raiz2 = Node(None, t_fim, 0, None, None)
        fila1, fila2 = deque([raiz1]), deque([raiz2])
        visitado1, visitado2 = {t_inicio: raiz1}, {t_fim: raiz2}
        
        while fila1 and fila2:
            # Expande um nível da origem
            for _ in range(len(fila1)):
                atual = fila1.popleft()
                for novo in self.sucessores_grid(atual.estado, nx, ny, mapa):
                    t_novo = tuple(novo)
                    if t_novo not in visitado1:
                        filho = Node(atual, t_novo, atual.cost + 1, None, None)
                        visitado1[t_novo] = filho
                        fila1.append(filho)
                        if t_novo in visitado2:
                            return self.exibirCaminho_Bid(novo, visitado1, visitado2)
            
            # Expande um nível do objetivo
            for _ in range(len(fila2)):
                atual = fila2.popleft()
                for novo in self.sucessores_grid(atual.estado, nx, ny, mapa):
                    t_novo = tuple(novo)
                    if t_novo not in visitado2:
                        filho = Node(atual, t_novo, atual.cost + 1, None, None)
                        visitado2[t_novo] = filho
                        fila2.append(filho)
                        if t_novo in visitado1:
                            return self.exibirCaminho_Bid(novo, visitado1, visitado2)
        return None

#--------------------------------------------------------------------------
# FUNÇÃO HEURÍSTICA - DISTÂNCIA DE MANHATTAN
#--------------------------------------------------------------------------
    def heuristica(self, estado, alvo):
        """Calcula a distância de Manhattan entre o estado e o alvo"""
        return abs(estado[0] - alvo[0]) + abs(estado[1] - alvo[1])

#--------------------------------------------------------------------------
# BUSCA DE CUSTO UNIFORME
#--------------------------------------------------------------------------
    def custo_uniforme(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        
        # (custo, contador, estado, node)
        contador = 0
        fila_prioridade = [(0, contador, t_inicio, Node(None, t_inicio, 0, None, None))]
        visitado = {t_inicio: None}
        
        while fila_prioridade:
            custo, _, atual_estado, atual_node = heapq.heappop(fila_prioridade)
            
            if atual_estado == t_fim:
                return self.exibirCaminho(atual_node)
            
            for novo in self.sucessores_grid(atual_estado, nx, ny, mapa):
                t_novo = tuple(novo)
                if t_novo not in visitado:
                    novo_custo = custo + 1
                    filho = Node(atual_node, t_novo, novo_custo, None, None)
                    visitado[t_novo] = filho
                    contador += 1
                    heapq.heappush(fila_prioridade, (novo_custo, contador, t_novo, filho))
        return None

#--------------------------------------------------------------------------
# BUSCA GULOSA (GREEDY)
#--------------------------------------------------------------------------
    def greddy(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        
        # (heuristica, contador, estado, node)
        contador = 0
        h_inicio = self.heuristica(t_inicio, t_fim)
        fila_prioridade = [(h_inicio, contador, t_inicio, Node(None, t_inicio, 0, None, None))]
        visitado = {t_inicio: None}
        
        while fila_prioridade:
            _, _, atual_estado, atual_node = heapq.heappop(fila_prioridade)
            
            if atual_estado == t_fim:
                return self.exibirCaminho(atual_node)
            
            for novo in self.sucessores_grid(atual_estado, nx, ny, mapa):
                t_novo = tuple(novo)
                if t_novo not in visitado:
                    h_novo = self.heuristica(t_novo, t_fim)
                    filho = Node(atual_node, t_novo, atual_node.cost + 1, None, None)
                    visitado[t_novo] = filho
                    contador += 1
                    heapq.heappush(fila_prioridade, (h_novo, contador, t_novo, filho))
        return None

#--------------------------------------------------------------------------
# BUSCA A*
#--------------------------------------------------------------------------
    def a_estrela(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        
        # (f, contador, estado, node)
        contador = 0
        g_inicio = 0
        h_inicio = self.heuristica(t_inicio, t_fim)
        f_inicio = g_inicio + h_inicio
        
        fila_prioridade = [(f_inicio, contador, t_inicio, Node(None, t_inicio, 0, None, None))]
        visitado = {t_inicio: None}
        melhor_g = {t_inicio: g_inicio}
        
        while fila_prioridade:
            f, _, atual_estado, atual_node = heapq.heappop(fila_prioridade)
            
            if atual_estado == t_fim:
                return self.exibirCaminho(atual_node)
            
            for novo in self.sucessores_grid(atual_estado, nx, ny, mapa):
                t_novo = tuple(novo)
                g_novo = atual_node.cost + 1
                
                if t_novo not in visitado or g_novo < melhor_g.get(t_novo, float('inf')):
                    visitado[t_novo] = None
                    melhor_g[t_novo] = g_novo
                    h_novo = self.heuristica(t_novo, t_fim)
                    f_novo = g_novo + h_novo
                    
                    filho = Node(atual_node, t_novo, g_novo, None, None)
                    contador += 1
                    heapq.heappush(fila_prioridade, (f_novo, contador, t_novo, filho))
        return None

#--------------------------------------------------------------------------
# BUSCA IDA* (ITERATIVE DEEPENING A*)
#--------------------------------------------------------------------------
    def aia_estrela(self, inicio, fim, nx, ny, mapa):
        if inicio == fim: return [inicio]
        t_inicio, t_fim = tuple(inicio), tuple(fim)
        
        def busca_profundidade_a(estado_atual, g, limite, pai_node, visitado_local):
            """Busca em profundidade com limite f = g + h, com detecção de ciclos"""
            h = self.heuristica(estado_atual, t_fim)
            f = g + h
            
            if f > limite:
                return f, None
            
            if estado_atual == t_fim:
                return f, pai_node
            
            # Marca como visitado nesta iteração para evitar ciclos
            visitado_local.add(estado_atual)
            min_limite = float('inf')
            
            for novo in self.sucessores_grid(estado_atual, nx, ny, mapa):
                t_novo = tuple(novo)
                
                # Pula nós já visitados nesta iteração (prevenção de ciclos)
                if t_novo not in visitado_local:
                    g_novo = g + 1
                    
                    filho = Node(pai_node, t_novo, g_novo, None, None)
                    proxima_f, resultado = busca_profundidade_a(t_novo, g_novo, limite, filho, visitado_local)
                    
                    if resultado is not None:
                        return proxima_f, resultado
                    
                    min_limite = min(min_limite, proxima_f)
            
            # Remove do visitado local ao retroceder (backtrack)
            visitado_local.remove(estado_atual)
            return min_limite, None
        
        h_inicio = self.heuristica(t_inicio, t_fim)
        limite = h_inicio
        node_inicio = Node(None, t_inicio, 0, None, None)
        
        while True:
            visitado_local = set()
            proxima_f, resultado = busca_profundidade_a(t_inicio, 0, limite, node_inicio, visitado_local)
            
            if resultado is not None:
                return self.exibirCaminho(resultado)
            
            if proxima_f == float('inf'):
                return None
            
            limite = proxima_f