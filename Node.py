class Node(object):
    def __init__(self, pai=None, estado=None, cost=0, anterior=None, proximo=None):
        self.pai = pai
        self.estado = estado
        self.cost = cost
        self.anterior = anterior
        self.proximo = proximo
        
    def __lt__(self, outro):
        return self.cost < outro.cost