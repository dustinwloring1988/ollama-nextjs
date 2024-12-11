export interface OllamaServer {
  id: string
  name: string
  url: string
  port: number
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

