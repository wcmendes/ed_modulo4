import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Network, Plus, Search, Trash2, AlertCircle, ArrowRight } from 'lucide-react'

const GraphSimulator = () => {
  const [vertices, setVertices] = useState([])
  const [edges, setEdges] = useState([])
  const [newVertex, setNewVertex] = useState('')
  const [fromVertex, setFromVertex] = useState('')
  const [toVertex, setToVertex] = useState('')
  const [startVertex, setStartVertex] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [traversalResult, setTraversalResult] = useState([])
  const [isDirected, setIsDirected] = useState(false)

  const showMessage = (msg, type = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const addVertex = () => {
    if (!newVertex.trim()) {
      showMessage('Por favor, digite um nome para o vértice!', 'error')
      return
    }

    if (vertices.includes(newVertex)) {
      showMessage('Vértice já existe!', 'error')
      return
    }

    setVertices([...vertices, newVertex])
    showMessage(`Vértice "${newVertex}" adicionado`, 'success')
    setNewVertex('')
  }

  const addEdge = () => {
    if (!fromVertex || !toVertex) {
      showMessage('Por favor, selecione os vértices de origem e destino!', 'error')
      return
    }

    if (fromVertex === toVertex) {
      showMessage('Não é possível criar uma aresta para o mesmo vértice!', 'error')
      return
    }

    const edgeExists = edges.some(edge => 
      (edge.from === fromVertex && edge.to === toVertex) ||
      (!isDirected && edge.from === toVertex && edge.to === fromVertex)
    )

    if (edgeExists) {
      showMessage('Aresta já existe!', 'error')
      return
    }

    setEdges([...edges, { from: fromVertex, to: toVertex }])
    showMessage(`Aresta adicionada: ${fromVertex} → ${toVertex}`, 'success')
    setFromVertex('')
    setToVertex('')
  }

  const removeVertex = (vertex) => {
    setVertices(vertices.filter(v => v !== vertex))
    setEdges(edges.filter(edge => edge.from !== vertex && edge.to !== vertex))
    showMessage(`Vértice "${vertex}" removido`, 'success')
  }

  const removeEdge = (from, to) => {
    setEdges(edges.filter(edge => !(edge.from === from && edge.to === to)))
    showMessage(`Aresta ${from} → ${to} removida`, 'success')
  }

  const clearGraph = () => {
    setVertices([])
    setEdges([])
    setTraversalResult([])
    showMessage('Grafo limpo!', 'info')
  }

  // Busca em Largura (BFS)
  const bfs = () => {
    if (!startVertex) {
      showMessage('Por favor, selecione um vértice de início!', 'error')
      return
    }

    const visited = new Set()
    const queue = [startVertex]
    const result = []

    while (queue.length > 0) {
      const current = queue.shift()
      
      if (!visited.has(current)) {
        visited.add(current)
        result.push(current)

        // Encontrar vizinhos
        const neighbors = edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to)
        
        if (!isDirected) {
          const reverseNeighbors = edges
            .filter(edge => edge.to === current)
            .map(edge => edge.from)
          neighbors.push(...reverseNeighbors)
        }

        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
      }
    }

    setTraversalResult(result)
    showMessage(`BFS a partir de "${startVertex}": ${result.join(' → ')}`, 'success')
  }

  // Busca em Profundidade (DFS)
  const dfs = () => {
    if (!startVertex) {
      showMessage('Por favor, selecione um vértice de início!', 'error')
      return
    }

    const visited = new Set()
    const result = []

    const dfsRecursive = (vertex) => {
      visited.add(vertex)
      result.push(vertex)

      // Encontrar vizinhos
      const neighbors = edges
        .filter(edge => edge.from === vertex)
        .map(edge => edge.to)
      
      if (!isDirected) {
        const reverseNeighbors = edges
          .filter(edge => edge.to === vertex)
          .map(edge => edge.from)
        neighbors.push(...reverseNeighbors)
      }

      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor)
        }
      })
    }

    dfsRecursive(startVertex)
    setTraversalResult(result)
    showMessage(`DFS a partir de "${startVertex}": ${result.join(' → ')}`, 'success')
  }

  // Gerar matriz de adjacência
  const getAdjacencyMatrix = () => {
    if (vertices.length === 0) return []

    const matrix = vertices.map(() => vertices.map(() => 0))
    
    edges.forEach(edge => {
      const fromIndex = vertices.indexOf(edge.from)
      const toIndex = vertices.indexOf(edge.to)
      matrix[fromIndex][toIndex] = 1
      
      if (!isDirected) {
        matrix[toIndex][fromIndex] = 1
      }
    })

    return matrix
  }

  const adjacencyMatrix = getAdjacencyMatrix()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          <Network className="inline-block w-6 h-6 mr-2" />
          Simulador de Grafos
        </h2>
        <p className="text-gray-600">
          Explore como os grafos modelam relações entre elementos através de vértices e arestas
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        </div>
      )}

      {/* Graph Type Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Grafo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={!isDirected ? "default" : "outline"}
              onClick={() => setIsDirected(false)}
            >
              Não Direcionado
            </Button>
            <Button
              variant={isDirected ? "default" : "outline"}
              onClick={() => setIsDirected(true)}
            >
              Direcionado
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Operações</CardTitle>
            <CardDescription>
              Adicione vértices e arestas ao grafo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Vertex */}
            <div className="space-y-2">
              <h4 className="font-medium">Adicionar Vértice</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do vértice"
                  value={newVertex}
                  onChange={(e) => setNewVertex(e.target.value)}
                />
                <Button onClick={addVertex} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Add Edge */}
            <div className="space-y-2">
              <h4 className="font-medium">Adicionar Aresta</h4>
              <div className="flex gap-2">
                <Select value={fromVertex} onValueChange={setFromVertex}>
                  <SelectTrigger>
                    <SelectValue placeholder="De" />
                  </SelectTrigger>
                  <SelectContent>
                    {vertices.map(vertex => (
                      <SelectItem key={vertex} value={vertex}>{vertex}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={toVertex} onValueChange={setToVertex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Para" />
                  </SelectTrigger>
                  <SelectContent>
                    {vertices.map(vertex => (
                      <SelectItem key={vertex} value={vertex}>{vertex}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addEdge} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Conectar
                </Button>
              </div>
            </div>

            {/* Traversal */}
            <div className="space-y-2">
              <h4 className="font-medium">Percorrer Grafo</h4>
              <div className="flex gap-2">
                <Select value={startVertex} onValueChange={setStartVertex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vértice inicial" />
                  </SelectTrigger>
                  <SelectContent>
                    {vertices.map(vertex => (
                      <SelectItem key={vertex} value={vertex}>{vertex}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={bfs} variant="outline">BFS</Button>
                <Button onClick={dfs} variant="outline">DFS</Button>
              </div>
            </div>

            <Button onClick={clearGraph} variant="outline" className="w-full">
              Limpar Grafo
            </Button>
          </CardContent>
        </Card>

        {/* Graph Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Grafo</CardTitle>
            <CardDescription>
              Vértices: {vertices.length} | Arestas: {edges.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Vertices */}
              <div>
                <h4 className="font-medium mb-2">Vértices:</h4>
                <div className="flex flex-wrap gap-2">
                  {vertices.length === 0 ? (
                    <span className="text-gray-400 italic">Nenhum vértice</span>
                  ) : (
                    vertices.map(vertex => (
                      <Badge 
                        key={vertex} 
                        variant={traversalResult.includes(vertex) ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => removeVertex(vertex)}
                      >
                        {vertex} ×
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Edges */}
              <div>
                <h4 className="font-medium mb-2">Arestas:</h4>
                <div className="space-y-1">
                  {edges.length === 0 ? (
                    <span className="text-gray-400 italic">Nenhuma aresta</span>
                  ) : (
                    edges.map((edge, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{edge.from}</Badge>
                          <ArrowRight className="w-4 h-4" />
                          <Badge variant="outline">{edge.to}</Badge>
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEdge(edge.from, edge.to)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Traversal Result */}
              {traversalResult.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Último Percurso:</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {traversalResult.map((vertex, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge variant="default">{vertex}</Badge>
                        {index < traversalResult.length - 1 && <ArrowRight className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjacency Matrix */}
      {vertices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Adjacência</CardTitle>
            <CardDescription>
              Representação matricial do grafo (1 = aresta existe, 0 = não existe)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-100"></th>
                    {vertices.map(vertex => (
                      <th key={vertex} className="border border-gray-300 p-2 bg-gray-100 min-w-[40px]">
                        {vertex}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vertices.map((vertex, i) => (
                    <tr key={vertex}>
                      <th className="border border-gray-300 p-2 bg-gray-100">{vertex}</th>
                      {adjacencyMatrix[i].map((value, j) => (
                        <td key={j} className="border border-gray-300 p-2 text-center">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Código</CardTitle>
          <CardDescription>
            Implementações de grafo em diferentes linguagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pseudocode" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pseudocode">Pseudocódigo</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>

            <TabsContent value="pseudocode" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Representação por lista de adjacência
estrutura Grafo:
    vertices: lista
    adjacencias: dicionário de listas

// Adicionar vértice
função adicionar_vertice(grafo, vertice):
    grafo.vertices.adicionar(vertice)
    grafo.adjacencias[vertice] = lista_vazia()

// Adicionar aresta
função adicionar_aresta(grafo, origem, destino):
    grafo.adjacencias[origem].adicionar(destino)
    // Para grafo não direcionado:
    // grafo.adjacencias[destino].adicionar(origem)

// Busca em Largura (BFS)
função bfs(grafo, inicio):
    visitados = conjunto_vazio()
    fila = fila_vazia()
    resultado = lista_vazia()
    
    fila.enfileirar(inicio)
    
    enquanto fila não estiver vazia:
        atual = fila.desenfileirar()
        se atual não está em visitados:
            visitados.adicionar(atual)
            resultado.adicionar(atual)
            
            para cada vizinho em grafo.adjacencias[atual]:
                se vizinho não está em visitados:
                    fila.enfileirar(vizinho)
    
    retorne resultado

// Busca em Profundidade (DFS)
função dfs(grafo, inicio):
    visitados = conjunto_vazio()
    resultado = lista_vazia()
    
    função dfs_recursivo(vertice):
        visitados.adicionar(vertice)
        resultado.adicionar(vertice)
        
        para cada vizinho em grafo.adjacencias[vertice]:
            se vizinho não está em visitados:
                dfs_recursivo(vizinho)
    
    dfs_recursivo(inicio)
    retorne resultado`}
              </pre>
            </TabsContent>

            <TabsContent value="python" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`from collections import defaultdict, deque

class Grafo:
    def __init__(self, direcionado=False):
        self.adjacencias = defaultdict(list)
        self.direcionado = direcionado
    
    def adicionar_vertice(self, vertice):
        if vertice not in self.adjacencias:
            self.adjacencias[vertice] = []
    
    def adicionar_aresta(self, origem, destino):
        self.adjacencias[origem].append(destino)
        if not self.direcionado:
            self.adjacencias[destino].append(origem)
    
    def bfs(self, inicio):
        visitados = set()
        fila = deque([inicio])
        resultado = []
        
        while fila:
            atual = fila.popleft()
            if atual not in visitados:
                visitados.add(atual)
                resultado.append(atual)
                
                for vizinho in self.adjacencias[atual]:
                    if vizinho not in visitados:
                        fila.append(vizinho)
        
        return resultado
    
    def dfs(self, inicio):
        visitados = set()
        resultado = []
        
        def dfs_recursivo(vertice):
            visitados.add(vertice)
            resultado.append(vertice)
            
            for vizinho in self.adjacencias[vertice]:
                if vizinho not in visitados:
                    dfs_recursivo(vizinho)
        
        dfs_recursivo(inicio)
        return resultado
    
    def obter_matriz_adjacencia(self):
        vertices = list(self.adjacencias.keys())
        n = len(vertices)
        matriz = [[0] * n for _ in range(n)]
        
        for i, origem in enumerate(vertices):
            for destino in self.adjacencias[origem]:
                j = vertices.index(destino)
                matriz[i][j] = 1
        
        return matriz, vertices`}
              </pre>
            </TabsContent>

            <TabsContent value="java" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import java.util.*;

class Grafo {
    private Map<String, List<String>> adjacencias;
    private boolean direcionado;
    
    public Grafo(boolean direcionado) {
        this.adjacencias = new HashMap<>();
        this.direcionado = direcionado;
    }
    
    public void adicionarVertice(String vertice) {
        adjacencias.putIfAbsent(vertice, new ArrayList<>());
    }
    
    public void adicionarAresta(String origem, String destino) {
        adjacencias.get(origem).add(destino);
        if (!direcionado) {
            adjacencias.get(destino).add(origem);
        }
    }
    
    public List<String> bfs(String inicio) {
        Set<String> visitados = new HashSet<>();
        Queue<String> fila = new LinkedList<>();
        List<String> resultado = new ArrayList<>();
        
        fila.offer(inicio);
        
        while (!fila.isEmpty()) {
            String atual = fila.poll();
            if (!visitados.contains(atual)) {
                visitados.add(atual);
                resultado.add(atual);
                
                for (String vizinho : adjacencias.get(atual)) {
                    if (!visitados.contains(vizinho)) {
                        fila.offer(vizinho);
                    }
                }
            }
        }
        
        return resultado;
    }
    
    public List<String> dfs(String inicio) {
        Set<String> visitados = new HashSet<>();
        List<String> resultado = new ArrayList<>();
        dfsRecursivo(inicio, visitados, resultado);
        return resultado;
    }
    
    private void dfsRecursivo(String vertice, Set<String> visitados, List<String> resultado) {
        visitados.add(vertice);
        resultado.add(vertice);
        
        for (String vizinho : adjacencias.get(vertice)) {
            if (!visitados.contains(vizinho)) {
                dfsRecursivo(vizinho, visitados, resultado);
            }
        }
    }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="c" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_VERTICES 100

typedef struct No {
    int vertice;
    struct No* proximo;
} No;

typedef struct {
    No* adjacencias[MAX_VERTICES];
    int num_vertices;
    int direcionado;
} Grafo;

Grafo* criarGrafo(int direcionado) {
    Grafo* grafo = (Grafo*)malloc(sizeof(Grafo));
    grafo->num_vertices = 0;
    grafo->direcionado = direcionado;
    
    for (int i = 0; i < MAX_VERTICES; i++) {
        grafo->adjacencias[i] = NULL;
    }
    
    return grafo;
}

void adicionarAresta(Grafo* grafo, int origem, int destino) {
    // Adicionar aresta origem -> destino
    No* novoNo = (No*)malloc(sizeof(No));
    novoNo->vertice = destino;
    novoNo->proximo = grafo->adjacencias[origem];
    grafo->adjacencias[origem] = novoNo;
    
    // Se não direcionado, adicionar destino -> origem
    if (!grafo->direcionado) {
        No* novoNo2 = (No*)malloc(sizeof(No));
        novoNo2->vertice = origem;
        novoNo2->proximo = grafo->adjacencias[destino];
        grafo->adjacencias[destino] = novoNo2;
    }
}

void bfs(Grafo* grafo, int inicio) {
    int visitados[MAX_VERTICES] = {0};
    int fila[MAX_VERTICES];
    int frente = 0, tras = 0;
    
    fila[tras++] = inicio;
    
    printf("BFS: ");
    while (frente < tras) {
        int atual = fila[frente++];
        
        if (!visitados[atual]) {
            visitados[atual] = 1;
            printf("%d ", atual);
            
            No* temp = grafo->adjacencias[atual];
            while (temp) {
                if (!visitados[temp->vertice]) {
                    fila[tras++] = temp->vertice;
                }
                temp = temp->proximo;
            }
        }
    }
    printf("\\n");
}

void dfsRecursivo(Grafo* grafo, int vertice, int visitados[]) {
    visitados[vertice] = 1;
    printf("%d ", vertice);
    
    No* temp = grafo->adjacencias[vertice];
    while (temp) {
        if (!visitados[temp->vertice]) {
            dfsRecursivo(grafo, temp->vertice, visitados);
        }
        temp = temp->proximo;
    }
}

void dfs(Grafo* grafo, int inicio) {
    int visitados[MAX_VERTICES] = {0};
    printf("DFS: ");
    dfsRecursivo(grafo, inicio, visitados);
    printf("\\n");
}`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default GraphSimulator

