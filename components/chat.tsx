"use client"

import { useStore } from "@/lib/store"
import { Message } from "@/types"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { ArrowUp, Paperclip } from 'lucide-react'
import { useState, useRef, useEffect } from "react"
import { generateChatCompletion } from "@/lib/api"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function Chat() {
  const { chats, currentChatId, settings, addMessage, updateChatTitle } = useStore()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chat = chats.find((c) => c.id === currentChatId)
  const activeServer = settings.servers.find(s => s.id === settings.activeServerId)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedModel || isLoading) return

    let userMessage: Message = {
      role: "user",
      content: input,
    }

    if (selectedImage) {
      userMessage.content += ` [Attached image: ${selectedImage.name}]`
    }

    if (chat.messages.length === 0) {
      try {
        const titlePrompt: Message = {
          role: "user",
          content: `name this chat thread using 3 to 5 words based on this prompt: ${input}`,
        }
        
        const titleResponse = await generateChatCompletion(
          `${activeServer.url}:${activeServer.port}`,
          selectedModel,
          [titlePrompt]
        )
        
        updateChatTitle(chat.id, titleResponse.message.content.replace(/"/g, ''))
      } catch (error) {
        console.error("Failed to generate title:", error)
      }
    }

    addMessage(chat.id, userMessage)
    setInput("")
    setSelectedImage(null)
    setIsLoading(true)

    try {
      const response = await generateChatCompletion(
        `${activeServer.url}:${activeServer.port}`,
        selectedModel,
        [...chat.messages, userMessage]
      )
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message.content,
      }
      addMessage(chat.id, assistantMessage)
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a chat to get started</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h1 className="font-semibold">{chat.title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.map((message, index) => (
          <Card
            key={index}
            className={`mb-4 p-4 ${
              message.role === "user" ? "ml-auto w-3/4" : "mr-auto w-3/4"
            }`}
          >
            <p>{message.content}</p>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-4 text-muted-foreground">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start" side="top">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium">Attach an image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Choose file
                    </Button>
                    {selectedImage && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedImage.name}
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger className="border-none shadow-none focus:ring-0 focus:ring-offset-0 text-sm hover:text-foreground">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent position="popper" side="top" align="start">
                  {activeServer?.models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can an Ollama help you today?"
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pl-[180px] text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            />
            <div className="absolute right-3 flex items-center gap-2">
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost"
                className="h-8 w-8"
                disabled={isLoading || !selectedModel}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

