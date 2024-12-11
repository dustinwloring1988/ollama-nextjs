export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
}

export interface OllamaServer {
  id: string
  name: string
  url: string
  port: number
  models: Model[]
}

export interface Settings {
  servers: OllamaServer[]
  activeServerId: string | null
  appearance: {
    theme: 'light' | 'dark' | 'system'
    fontSize: 'sm' | 'base' | 'lg'
  }
  github: {
    username: string
    token: string
  }
}

export interface Model {
  name: string
  modified_at: string
  size: number
  digest: string
  details: {
    format: string
    family: string
    families: string[] | null
    parameter_size: string
    quantization_level: string
  }
}

