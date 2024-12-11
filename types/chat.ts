export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  model: string
  provider: string
  createdAt: number
}

export interface Settings {
  provider: string
  model: string
  apiUrl: string
}

