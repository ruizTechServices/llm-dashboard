import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { ScrollArea } from "./ui/scroll-area"
import { Play, Upload } from 'lucide-react'
import { Progress } from "./ui/progress"
import { fineTuningApi, uploadApi } from '../services/api'

const BASE_MODELS = ['GPT-2', 'BERT', 'RoBERTa', 'T5']

type TrainingLog = {
  epoch: number
  loss: number
  accuracy: number
}

export default function FineTuningInterface() {
  const [selectedModel, setSelectedModel] = useState(BASE_MODELS[0])
  const [learningRate, setLearningRate] = useState(0.0001)
  const [epochs, setEpochs] = useState(3)
  const [batchSize, setBatchSize] = useState(32)
  const [trainingFile, setTrainingFile] = useState<File | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setTrainingFile(file)
      try {
        await uploadApi.uploadFile(file)
        console.log('Training file uploaded successfully:', file.name)
      } catch (error) {
        console.error('Error uploading file:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  const handleStartTraining = async () => {
    if (!trainingFile) {
      console.log('Please upload a training file first')
      return
    }
    setIsTraining(true)
    setProgress(0)
    setTrainingLogs([])

    try {
      const response = await fineTuningApi.startTraining({
        baseModel: selectedModel,
        learningRate,
        epochs,
        batchSize,
        trainingFile: trainingFile.name,
      })

      // Simulate progress updates (in a real scenario, this would come from the server)
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            setIsTraining(false)
            return 100
          }
          return prevProgress + 10
        })

        setTrainingLogs((prevLogs) => [
          ...prevLogs,
          {
            epoch: Math.floor(prevLogs.length / 10) + 1,
            loss: Math.random() * 0.5,
            accuracy: 0.5 + Math.random() * 0.5,
          },
        ])
      }, 1000)

      // In a real scenario, you'd handle the response from the server here
      console.log('Fine-tuning started:', response.data)
    } catch (error) {
      console.error('Error starting fine-tuning:', error)
      setIsTraining(false)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Fine-Tuning Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="base-model">Base Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="base-model">
                <SelectValue placeholder="Select base model" />
              </SelectTrigger>
              <SelectContent>
                {BASE_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learning-rate">Learning Rate: {learningRate}</Label>
            <Slider
              id="learning-rate"
              min={0.00001}
              max={0.1}
              step={0.00001}
              value={[learningRate]}
              onValueChange={([value]) => setLearningRate(value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="epochs">Epochs: {epochs}</Label>
            <Slider
              id="epochs"
              min={1}
              max={10}
              step={1}
              value={[epochs]}
              onValueChange={([value]) => setEpochs(value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-size">Batch Size: {batchSize}</Label>
            <Slider
              id="batch-size"
              min={8}
              max={128}
              step={8}
              value={[batchSize]}
              onValueChange={([value]) => setBatchSize(value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="training-file">Training Data</Label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <label htmlFor="training-file" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                </label>
                <input
                  id="training-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".csv,.json,.txt"
                />
              </Button>
              <Input
                readOnly
                value={trainingFile ? trainingFile.name : 'No file selected'}
                className="flex-grow"
              />
            </div>
          </div>

          <Button
            onClick={handleStartTraining}
            disabled={isTraining || !trainingFile}
            className="w-full"
          >
            {isTraining ? 'Training...' : 'Start Fine-Tuning'}
            <Play className="ml-2 h-4 w-4" />
          </Button>

          {isTraining && (
            <Progress value={progress} className="w-full" />
          )}
        </div>

        <ScrollArea className="h-[200px] w-full mt-4">
          {trainingLogs.map((log, index) => (
            <div key={index} className="mb-2 p-2 bg-secondary rounded-lg">
              <p className="font-semibold">Epoch {log.epoch}</p>
              <p className="text-sm text-muted-foreground">
                Loss: {log.loss.toFixed(4)}, Accuracy: {log.accuracy.toFixed(4)}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Fine-tuning progress and logs are displayed here.
        </p>
      </CardFooter>
    </Card>
  )
}