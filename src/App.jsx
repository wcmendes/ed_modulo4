import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Hash, TreePine, Network, BookOpen, Code, Play, Trash2 } from 'lucide-react'
import './App.css'

// Componentes dos simuladores
import HashTableSimulator from './components/HashTableSimulator'
import TreeSimulator from './components/TreeSimulator'
import GraphSimulator from './components/GraphSimulator'

function App() {
  const [activeSection, setActiveSection] = useState('theory')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Estrutura de Dados - Módulo IV
            </h1>
            <h2 className="text-lg text-gray-600">
              Estruturas Não Lineares e Acesso Direto: Árvores, Hash e Grafos
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Prof. William Corrêa Mendes
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={activeSection === 'theory' ? 'default' : 'outline'}
            onClick={() => setActiveSection('theory')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Painel Teórico
          </Button>
          <Button
            variant={activeSection === 'hash' ? 'default' : 'outline'}
            onClick={() => setActiveSection('hash')}
            className="flex items-center gap-2"
          >
            <Hash className="w-4 h-4" />
            Tabelas Hash
          </Button>
          <Button
            variant={activeSection === 'trees' ? 'default' : 'outline'}
            onClick={() => setActiveSection('trees')}
            className="flex items-center gap-2"
          >
            <TreePine className="w-4 h-4" />
            Árvores
          </Button>
          <Button
            variant={activeSection === 'graphs' ? 'default' : 'outline'}
            onClick={() => setActiveSection('graphs')}
            className="flex items-center gap-2"
          >
            <Network className="w-4 h-4" />
            Grafos
          </Button>
        </div>

        {/* Theory Panel */}
        {activeSection === 'theory' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                <BookOpen className="inline-block w-6 h-6 mr-2" />
                Painel Teórico
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Hash Tables Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-600" />
                    Tabelas Hash
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Estruturas que permitem acesso direto aos dados através de funções de hash.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary">Acesso O(1)</Badge>
                    <Badge variant="secondary">Função Hash</Badge>
                    <Badge variant="secondary">Tratamento de Colisões</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Trees Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-green-600" />
                    Árvores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Estruturas hierárquicas com nós conectados por arestas, sem formar ciclos.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary">Hierárquica</Badge>
                    <Badge variant="secondary">Busca Eficiente</Badge>
                    <Badge variant="secondary">Balanceamento</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Graphs Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-600" />
                    Grafos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Estruturas compostas por vértices conectados por arestas, modelando relações.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary">Vértices e Arestas</Badge>
                    <Badge variant="secondary">BFS/DFS</Badge>
                    <Badge variant="secondary">Representação</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Hash Table Simulator */}
        {activeSection === 'hash' && <HashTableSimulator />}

        {/* Tree Simulator */}
        {activeSection === 'trees' && <TreeSimulator />}

        {/* Graph Simulator */}
        {activeSection === 'graphs' && <GraphSimulator />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            <strong>Prof. William Corrêa Mendes</strong>
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Currículo Lattes: https://lattes.cnpq.br/7726054867638395
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Módulo I - Estruturas Básicas</a>
            <a href="#" className="hover:text-white">Módulo II - Registros e Vetores</a>
            <a href="#" className="hover:text-white">Módulo III - Estruturas Lineares</a>
            <a href="#" className="hover:text-white">Torre de Hanoi</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

