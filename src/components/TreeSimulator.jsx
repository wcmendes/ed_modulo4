import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { TreePine, Plus, Search, Trash2, AlertCircle } from 'lucide-react'

// Classe do nó da árvore
class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

// Classe da árvore binária de busca
class BinarySearchTree {
  constructor() {
    this.root = null
  }

  insert(value) {
    const newNode = new TreeNode(value)
    if (!this.root) {
      this.root = newNode
      return
    }

    let current = this.root
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode
          return
        }
        current = current.left
      } else if (value > current.value) {
        if (!current.right) {
          current.right = newNode
          return
        }
        current = current.right
      } else {
        return // Valor já existe
      }
    }
  }

  search(value) {
    let current = this.root
    const path = []
    
    while (current) {
      path.push(current.value)
      if (value === current.value) {
        return { found: true, path }
      } else if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }
    return { found: false, path }
  }

  remove(value) {
    this.root = this._removeNode(this.root, value)
  }

  _removeNode(node, value) {
    if (!node) return null

    if (value < node.value) {
      node.left = this._removeNode(node.left, value)
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value)
    } else {
      // Nó encontrado
      if (!node.left && !node.right) {
        return null
      }
      if (!node.left) {
        return node.right
      }
      if (!node.right) {
        return node.left
      }
      
      // Nó com dois filhos
      const minRight = this._findMin(node.right)
      node.value = minRight.value
      node.right = this._removeNode(node.right, minRight.value)
    }
    return node
  }

  _findMin(node) {
    while (node.left) {
      node = node.left
    }
    return node
  }

  inorderTraversal() {
    const result = []
    this._inorder(this.root, result)
    return result
  }

  _inorder(node, result) {
    if (node) {
      this._inorder(node.left, result)
      result.push(node.value)
      this._inorder(node.right, result)
    }
  }

  getHeight() {
    return this._getHeight(this.root)
  }

  _getHeight(node) {
    if (!node) return 0
    return 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right))
  }
}

const TreeSimulator = () => {
  const [tree, setTree] = useState(new BinarySearchTree())
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [searchPath, setSearchPath] = useState([])
  const [treeVersion, setTreeVersion] = useState(0) // Para forçar re-render

  const showMessage = (msg, type = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const insertValue = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) {
      showMessage('Por favor, digite um número válido!', 'error')
      return
    }

    const oldSize = tree.inorderTraversal().length
    tree.insert(value)
    const newSize = tree.inorderTraversal().length

    if (newSize > oldSize) {
      showMessage(`Valor ${value} inserido na árvore`, 'success')
      setTreeVersion(prev => prev + 1)
    } else {
      showMessage(`Valor ${value} já existe na árvore`, 'error')
    }
    setInputValue('')
  }

  const searchInTree = () => {
    const value = parseInt(searchValue)
    if (isNaN(value)) {
      showMessage('Por favor, digite um número válido para buscar!', 'error')
      return
    }

    const result = tree.search(value)
    setSearchPath(result.path)

    if (result.found) {
      showMessage(`Valor ${value} encontrado! Caminho: ${result.path.join(' → ')}`, 'success')
    } else {
      showMessage(`Valor ${value} não encontrado. Caminho percorrido: ${result.path.join(' → ')}`, 'error')
    }
    setSearchValue('')
  }

  const removeValue = () => {
    const value = parseInt(searchValue)
    if (isNaN(value)) {
      showMessage('Por favor, digite um número válido para remover!', 'error')
      return
    }

    const oldSize = tree.inorderTraversal().length
    tree.remove(value)
    const newSize = tree.inorderTraversal().length

    if (newSize < oldSize) {
      showMessage(`Valor ${value} removido da árvore`, 'success')
      setTreeVersion(prev => prev + 1)
      setSearchPath([])
    } else {
      showMessage(`Valor ${value} não encontrado na árvore`, 'error')
    }
    setSearchValue('')
  }

  const clearTree = () => {
    setTree(new BinarySearchTree())
    setTreeVersion(prev => prev + 1)
    setSearchPath([])
    showMessage('Árvore limpa!', 'info')
  }

  // Função para renderizar a árvore de forma visual simples
  const renderTree = (node, level = 0) => {
    if (!node) return null

    const isInPath = searchPath.includes(node.value)
    
    return (
      <div key={`${node.value}-${level}`} className="flex flex-col items-center">
        <Badge 
          variant={isInPath ? "default" : "secondary"}
          className={`mb-2 ${isInPath ? 'bg-blue-600' : ''}`}
        >
          {node.value}
        </Badge>
        {(node.left || node.right) && (
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className="w-px h-4 bg-gray-300"></div>
                  {renderTree(node.left, level + 1)}
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className="w-px h-4 bg-gray-300"></div>
                  {renderTree(node.right, level + 1)}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const inorderResult = tree.inorderTraversal()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          <TreePine className="inline-block w-6 h-6 mr-2" />
          Simulador de Árvores Binárias de Busca
        </h2>
        <p className="text-gray-600">
          Explore como as árvores organizam dados hierarquicamente para busca eficiente
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Operações</CardTitle>
            <CardDescription>
              Insira, busque e remova valores da árvore binária de busca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Insert */}
            <div className="space-y-2">
              <h4 className="font-medium">Inserir Valor</h4>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Digite um número"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button onClick={insertValue} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Inserir
                </Button>
              </div>
            </div>

            {/* Search/Remove */}
            <div className="space-y-2">
              <h4 className="font-medium">Buscar/Remover Valor</h4>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Digite um número"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button onClick={searchInTree} variant="outline" className="flex items-center gap-1">
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
                <Button onClick={removeValue} variant="destructive" className="flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Remover
                </Button>
              </div>
            </div>

            <Button onClick={clearTree} variant="outline" className="w-full">
              Limpar Árvore
            </Button>

            {/* Tree Info */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-medium">Informações da Árvore</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Altura: <Badge variant="outline">{tree.getHeight()}</Badge></div>
                <div>Nós: <Badge variant="outline">{inorderResult.length}</Badge></div>
              </div>
              {inorderResult.length > 0 && (
                <div className="text-sm">
                  <strong>Percurso em ordem:</strong> {inorderResult.join(', ')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tree Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização da Árvore</CardTitle>
            <CardDescription>
              Árvore Binária de Busca (valores em azul indicam caminho de busca)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] flex items-center justify-center overflow-auto">
              {tree.root ? (
                <div className="p-4">
                  {renderTree(tree.root)}
                </div>
              ) : (
                <div className="text-gray-400 italic">
                  Árvore vazia - insira alguns valores para começar
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Código</CardTitle>
          <CardDescription>
            Implementações de árvore binária de busca em diferentes linguagens
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
{`// Estrutura do nó
estrutura No:
    valor: inteiro
    esquerda: ponteiro para No
    direita: ponteiro para No

// Inserir valor na árvore
função inserir(raiz, valor):
    se raiz == nulo:
        retorne novo_no(valor)
    
    se valor < raiz.valor:
        raiz.esquerda = inserir(raiz.esquerda, valor)
    senão se valor > raiz.valor:
        raiz.direita = inserir(raiz.direita, valor)
    
    retorne raiz

// Buscar valor na árvore
função buscar(raiz, valor):
    se raiz == nulo ou raiz.valor == valor:
        retorne raiz
    
    se valor < raiz.valor:
        retorne buscar(raiz.esquerda, valor)
    senão:
        retorne buscar(raiz.direita, valor)

// Percurso em ordem
função percurso_em_ordem(raiz):
    se raiz != nulo:
        percurso_em_ordem(raiz.esquerda)
        imprimir(raiz.valor)
        percurso_em_ordem(raiz.direita)`}
              </pre>
            </TabsContent>

            <TabsContent value="python" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class No:
    def __init__(self, valor):
        self.valor = valor
        self.esquerda = None
        self.direita = None

class ArvoreBinariaBusca:
    def __init__(self):
        self.raiz = None
    
    def inserir(self, valor):
        self.raiz = self._inserir_recursivo(self.raiz, valor)
    
    def _inserir_recursivo(self, no, valor):
        if no is None:
            return No(valor)
        
        if valor < no.valor:
            no.esquerda = self._inserir_recursivo(no.esquerda, valor)
        elif valor > no.valor:
            no.direita = self._inserir_recursivo(no.direita, valor)
        
        return no
    
    def buscar(self, valor):
        return self._buscar_recursivo(self.raiz, valor)
    
    def _buscar_recursivo(self, no, valor):
        if no is None or no.valor == valor:
            return no
        
        if valor < no.valor:
            return self._buscar_recursivo(no.esquerda, valor)
        else:
            return self._buscar_recursivo(no.direita, valor)
    
    def percurso_em_ordem(self):
        resultado = []
        self._em_ordem_recursivo(self.raiz, resultado)
        return resultado
    
    def _em_ordem_recursivo(self, no, resultado):
        if no:
            self._em_ordem_recursivo(no.esquerda, resultado)
            resultado.append(no.valor)
            self._em_ordem_recursivo(no.direita, resultado)`}
              </pre>
            </TabsContent>

            <TabsContent value="java" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class No {
    int valor;
    No esquerda, direita;
    
    public No(int valor) {
        this.valor = valor;
        esquerda = direita = null;
    }
}

class ArvoreBinariaBusca {
    No raiz;
    
    public ArvoreBinariaBusca() {
        raiz = null;
    }
    
    public void inserir(int valor) {
        raiz = inserirRecursivo(raiz, valor);
    }
    
    private No inserirRecursivo(No no, int valor) {
        if (no == null) {
            return new No(valor);
        }
        
        if (valor < no.valor) {
            no.esquerda = inserirRecursivo(no.esquerda, valor);
        } else if (valor > no.valor) {
            no.direita = inserirRecursivo(no.direita, valor);
        }
        
        return no;
    }
    
    public No buscar(int valor) {
        return buscarRecursivo(raiz, valor);
    }
    
    private No buscarRecursivo(No no, int valor) {
        if (no == null || no.valor == valor) {
            return no;
        }
        
        if (valor < no.valor) {
            return buscarRecursivo(no.esquerda, valor);
        } else {
            return buscarRecursivo(no.direita, valor);
        }
    }
    
    public void percursoEmOrdem() {
        percursoEmOrdemRecursivo(raiz);
    }
    
    private void percursoEmOrdemRecursivo(No no) {
        if (no != null) {
            percursoEmOrdemRecursivo(no.esquerda);
            System.out.print(no.valor + " ");
            percursoEmOrdemRecursivo(no.direita);
        }
    }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="c" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`#include <stdio.h>
#include <stdlib.h>

typedef struct No {
    int valor;
    struct No* esquerda;
    struct No* direita;
} No;

No* criarNo(int valor) {
    No* novoNo = (No*)malloc(sizeof(No));
    novoNo->valor = valor;
    novoNo->esquerda = NULL;
    novoNo->direita = NULL;
    return novoNo;
}

No* inserir(No* raiz, int valor) {
    if (raiz == NULL) {
        return criarNo(valor);
    }
    
    if (valor < raiz->valor) {
        raiz->esquerda = inserir(raiz->esquerda, valor);
    } else if (valor > raiz->valor) {
        raiz->direita = inserir(raiz->direita, valor);
    }
    
    return raiz;
}

No* buscar(No* raiz, int valor) {
    if (raiz == NULL || raiz->valor == valor) {
        return raiz;
    }
    
    if (valor < raiz->valor) {
        return buscar(raiz->esquerda, valor);
    } else {
        return buscar(raiz->direita, valor);
    }
}

void percursoEmOrdem(No* raiz) {
    if (raiz != NULL) {
        percursoEmOrdem(raiz->esquerda);
        printf("%d ", raiz->valor);
        percursoEmOrdem(raiz->direita);
    }
}

void liberarArvore(No* raiz) {
    if (raiz != NULL) {
        liberarArvore(raiz->esquerda);
        liberarArvore(raiz->direita);
        free(raiz);
    }
}`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default TreeSimulator

