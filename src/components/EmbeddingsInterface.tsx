import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ScrollArea } from "./ui/scroll-area"
import { ArrowRight } from 'lucide-react'
import { embeddingsApi } from '../services/api'

const EMBEDDING_MODELS = ['Word2Vec', 'GloVe', 'FastText', 'BERT']

type EmbeddingVisualization = {
  word: string
  vector: number[]
}

export default function EmbeddingsInterface() {
  const [inputText, setInputText] = useState('')
  const [selectedModel, setSelectedModel] = useState(EMBEDDING_MODELS[0])
  const [embeddings, setEmbeddings] = useState<EmbeddingVisualization[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateEmbeddings = async () => {
    if (inputText.trim()) {
      setIsLoading(true)
      try {
        const response = await embeddingsApi.generate(inputText, selectedModel)
        const newEmbeddings = response.data.embeddings.map((embedding: number[], index: number) => ({
          word: inputText.trim().split(/\s+/)[index] || `Word ${index + 1}`,
          vector: embedding
        }))
        setEmbeddings(newEmbeddings)
      } catch (error) {
        console.error('Error generating embeddings:', error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Embeddings Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter text for embedding..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow"
            />
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {EMBEDDING_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerateEmbeddings} className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Embeddings'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[200px] w-full mt-4">
          {embeddings.map((embedding, index) => (
            <div key={index} className="mb-2 p-2 bg-secondary rounded-lg">
              <p className="font-semibold">{embedding.word}</p>
              <p className="text-sm text-muted-foreground">
                [{embedding.vector.map(v => v.toFixed(3)).join(', ')}]
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Embeddings are generated using the selected model and displayed here.
        </p>
      </CardFooter>
    </Card>
  )
}