import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ScrollArea } from "./ui/scroll-area"
import { Upload, Send } from 'lucide-react'
import { gpt4Api, gpt4oApi, mistralApi, uploadApi } from '../services/api'

type Message = {
  sender: 'user' | 'bot'
  content: string
}

const LLM_OPTIONS = ['GPT-4', 'GPT-4 Turbo', 'Mistral']

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedLLM, setSelectedLLM] = useState(LLM_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const newFileName = `uploaded_${Date.now()}_${file.name}`
        await uploadApi.uploadFile(file, newFileName)
        setMessages(prev => [...prev, { sender: 'user', content: `Uploaded file: ${newFileName}` }])
      } catch (error) {
        console.error('Error uploading file:', error)
        setMessages(prev => [...prev, { sender: 'bot', content: 'Error uploading file. Please try again.' }])
      }
    }
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { sender: 'user', content: inputMessage }])
      setInputMessage('')
      setIsLoading(true)

      try {
        let response;
        switch (selectedLLM) {
          case 'GPT-4':
            response = await gpt4Api.chat(inputMessage);
            break;
          case 'GPT-4 Turbo':
            response = await gpt4oApi.chat(inputMessage);
            break;
          case 'Mistral':
            response = await mistralApi.chat(inputMessage);
            break;
          default:
            throw new Error('Invalid LLM selected');
        }

        setMessages(prev => [...prev, { sender: 'bot', content: response.data.message }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { sender: 'bot', content: 'Sorry, there was an error processing your request.' }]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chatbot Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary'
              } max-w-[80%] ${message.sender === 'user' ? 'float-right clear-both' : 'float-left clear-both'}`}
            >
              {message.content}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="icon" className="shrink-0">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4" />
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Button>
          <Select value={selectedLLM} onValueChange={setSelectedLLM}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select LLM" />
            </SelectTrigger>
            <SelectContent>
              {LLM_OPTIONS.map((llm) => (
                <SelectItem key={llm} value={llm}>
                  {llm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}