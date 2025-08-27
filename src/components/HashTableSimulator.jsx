import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Hash, Plus, Search, Trash2, AlertCircle } from 'lucide-react'

const HashTableSimulator = () => {
  const [hashTable, setHashTable] = useState(Array(7).fill(null).map(() => []))
  const [inputKey, setInputKey] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')

  // Função de hash simples
  const hashFunction = (key) => {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i)
    }
    return hash % 7
  }

  const showMessage = (msg, type = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const insertItem = () => {
    if (!inputKey.trim() || !inputValue.trim()) {
      showMessage('Por favor, digite uma chave e um valor!', 'error')
      return
    }

    const index = hashFunction(inputKey)
    const newHashTable = [...hashTable]
    
    // Verificar se a chave já existe
    const existingIndex = newHashTable[index].findIndex(item => item.key === inputKey)
    if (existingIndex !== -1) {
      newHashTable[index][existingIndex].value = inputValue
      showMessage(`Valor atualizado para a chave "${inputKey}"`, 'success')
    } else {
      newHashTable[index].push({ key: inputKey, value: inputValue })
      showMessage(`Item inserido: ${inputKey} -> ${inputValue} (índice ${index})`, 'success')
    }

    setHashTable(newHashTable)
    setInputKey('')
    setInputValue('')
  }

  const searchItem = () => {
    if (!searchKey.trim()) {
      showMessage('Por favor, digite uma chave para buscar!', 'error')
      return
    }

    const index = hashFunction(searchKey)
    const bucket = hashTable[index]
    const item = bucket.find(item => item.key === searchKey)

    if (item) {
      showMessage(`Encontrado: ${searchKey} -> ${item.value} (índice ${index})`, 'success')
    } else {
      showMessage(`Chave "${searchKey}" não encontrada`, 'error')
    }
    setSearchKey('')
  }

  const removeItem = () => {
    if (!searchKey.trim()) {
      showMessage('Por favor, digite uma chave para remover!', 'error')
      return
    }

    const index = hashFunction(searchKey)
    const newHashTable = [...hashTable]
    const itemIndex = newHashTable[index].findIndex(item => item.key === searchKey)

    if (itemIndex !== -1) {
      newHashTable[index].splice(itemIndex, 1)
      setHashTable(newHashTable)
      showMessage(`Item removido: ${searchKey}`, 'success')
    } else {
      showMessage(`Chave "${searchKey}" não encontrada`, 'error')
    }
    setSearchKey('')
  }

  const clearTable = () => {
    setHashTable(Array(7).fill(null).map(() => []))
    showMessage('Tabela hash limpa!', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          <Hash className="inline-block w-6 h-6 mr-2" />
          Simulador de Tabelas Hash
        </h2>
        <p className="text-gray-600">
          Explore como as tabelas hash permitem acesso direto aos dados através de funções de hash
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
              Insira, busque e remova itens da tabela hash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Insert */}
            <div className="space-y-2">
              <h4 className="font-medium">Inserir Item</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Chave"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                />
                <Input
                  placeholder="Valor"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button onClick={insertItem} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Inserir
                </Button>
              </div>
            </div>

            {/* Search/Remove */}
            <div className="space-y-2">
              <h4 className="font-medium">Buscar/Remover Item</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Chave para buscar/remover"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <Button onClick={searchItem} variant="outline" className="flex items-center gap-1">
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
                <Button onClick={removeItem} variant="destructive" className="flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Remover
                </Button>
              </div>
            </div>

            <Button onClick={clearTable} variant="outline" className="w-full">
              Limpar Tabela
            </Button>
          </CardContent>
        </Card>

        {/* Hash Table Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização da Tabela Hash</CardTitle>
            <CardDescription>
              Função Hash: soma dos códigos ASCII % 7
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hashTable.map((bucket, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge variant="outline" className="min-w-[40px] text-center">
                    {index}
                  </Badge>
                  <div className="flex-1">
                    {bucket.length === 0 ? (
                      <span className="text-gray-400 italic">vazio</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {bucket.map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="secondary">
                            {item.key}: {item.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Código</CardTitle>
          <CardDescription>
            Implementações de tabela hash em diferentes linguagens
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
{`// Estrutura da tabela hash
estrutura TabelaHash:
    buckets: array de listas
    tamanho: inteiro

// Função de hash
função hash(chave):
    soma = 0
    para cada caractere c em chave:
        soma = soma + codigo_ascii(c)
    retorne soma % tamanho

// Inserir item
função inserir(tabela, chave, valor):
    indice = hash(chave)
    para cada item em tabela.buckets[indice]:
        se item.chave == chave:
            item.valor = valor
            retorne
    tabela.buckets[indice].adicionar(chave, valor)

// Buscar item
função buscar(tabela, chave):
    indice = hash(chave)
    para cada item em tabela.buckets[indice]:
        se item.chave == chave:
            retorne item.valor
    retorne nulo`}
              </pre>
            </TabsContent>

            <TabsContent value="python" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`class TabelaHash:
    def __init__(self, tamanho=7):
        self.tamanho = tamanho
        self.buckets = [[] for _ in range(tamanho)]
    
    def _hash(self, chave):
        return sum(ord(c) for c in str(chave)) % self.tamanho
    
    def inserir(self, chave, valor):
        indice = self._hash(chave)
        bucket = self.buckets[indice]
        
        # Verificar se a chave já existe
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                bucket[i] = (chave, valor)
                return
        
        # Adicionar novo item
        bucket.append((chave, valor))
    
    def buscar(self, chave):
        indice = self._hash(chave)
        bucket = self.buckets[indice]
        
        for k, v in bucket:
            if k == chave:
                return v
        return None
    
    def remover(self, chave):
        indice = self._hash(chave)
        bucket = self.buckets[indice]
        
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                del bucket[i]
                return True
        return False`}
              </pre>
            </TabsContent>

            <TabsContent value="java" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import java.util.*;

class TabelaHash {
    private List<List<Entry>> buckets;
    private int tamanho;
    
    class Entry {
        String chave;
        String valor;
        
        Entry(String chave, String valor) {
            this.chave = chave;
            this.valor = valor;
        }
    }
    
    public TabelaHash(int tamanho) {
        this.tamanho = tamanho;
        this.buckets = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            buckets.add(new ArrayList<>());
        }
    }
    
    private int hash(String chave) {
        int soma = 0;
        for (char c : chave.toCharArray()) {
            soma += (int) c;
        }
        return soma % tamanho;
    }
    
    public void inserir(String chave, String valor) {
        int indice = hash(chave);
        List<Entry> bucket = buckets.get(indice);
        
        // Verificar se a chave já existe
        for (Entry entry : bucket) {
            if (entry.chave.equals(chave)) {
                entry.valor = valor;
                return;
            }
        }
        
        // Adicionar novo item
        bucket.add(new Entry(chave, valor));
    }
    
    public String buscar(String chave) {
        int indice = hash(chave);
        List<Entry> bucket = buckets.get(indice);
        
        for (Entry entry : bucket) {
            if (entry.chave.equals(chave)) {
                return entry.valor;
            }
        }
        return null;
    }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="c" className="mt-4">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TAMANHO_TABELA 7

typedef struct Entry {
    char* chave;
    char* valor;
    struct Entry* proximo;
} Entry;

typedef struct {
    Entry* buckets[TAMANHO_TABELA];
} TabelaHash;

int hash(char* chave) {
    int soma = 0;
    for (int i = 0; chave[i] != '\\0'; i++) {
        soma += (int)chave[i];
    }
    return soma % TAMANHO_TABELA;
}

void inserir(TabelaHash* tabela, char* chave, char* valor) {
    int indice = hash(chave);
    Entry* atual = tabela->buckets[indice];
    
    // Verificar se a chave já existe
    while (atual != NULL) {
        if (strcmp(atual->chave, chave) == 0) {
            free(atual->valor);
            atual->valor = strdup(valor);
            return;
        }
        atual = atual->proximo;
    }
    
    // Criar nova entrada
    Entry* nova_entry = malloc(sizeof(Entry));
    nova_entry->chave = strdup(chave);
    nova_entry->valor = strdup(valor);
    nova_entry->proximo = tabela->buckets[indice];
    tabela->buckets[indice] = nova_entry;
}

char* buscar(TabelaHash* tabela, char* chave) {
    int indice = hash(chave);
    Entry* atual = tabela->buckets[indice];
    
    while (atual != NULL) {
        if (strcmp(atual->chave, chave) == 0) {
            return atual->valor;
        }
        atual = atual->proximo;
    }
    return NULL;
}`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default HashTableSimulator

