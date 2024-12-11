import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Chat, Settings, Model, OllamaServer } from '@/types'
import { listModels } from './api'

interface State {
  chats: Chat[]
  currentChatId: string | null
  settings: Settings
  addChat: (chat: Chat) => void
  setCurrentChat: (id: string | null) => void
  addMessage: (chatId: string, message: Message) => void
  updateSettings: (settings: Partial<Settings>) => void
  deleteChat: (id: string) => void
  deleteAllChats: () => void
  refreshServerModels: (serverId: string) => Promise<void>
  updateChatTitle: (chatId: string, title: string) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      settings: {
        servers: [
          {
            id: 'default',
            name: 'Local Ollama',
            url: 'http://localhost',
            port: 11434,
            models: [],
          },
        ],
        activeServerId: 'default',
        appearance: {
          theme: 'system',
          fontSize: 'base',
        },
        github: {
          username: '',
          token: '',
        },
      },
      addChat: (chat) =>
        set((state) => ({
          chats: [...state.chats, chat],
          currentChatId: chat.id,
        })),
      setCurrentChat: (id) =>
        set(() => ({
          currentChatId: id,
        })),
      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          ),
        })),
      updateSettings: (newSettings: Partial<Settings>) =>
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings };
          if (newSettings.appearance) {
            if (newSettings.appearance.theme) {
              if (typeof window !== 'undefined') {
                const root = window.document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(newSettings.appearance.theme === 'system' 
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : newSettings.appearance.theme);
              }
            }
            if (newSettings.appearance.fontSize) {
              if (typeof window !== 'undefined') {
                const root = window.document.documentElement;
                root.classList.remove('text-sm', 'text-base', 'text-lg');
                root.classList.add(`text-${newSettings.appearance.fontSize}`);
              }
            }
          }
          return { settings: updatedSettings };
        }),
      deleteChat: (id) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          currentChatId: state.currentChatId === id ? null : state.currentChatId,
        })),
      deleteAllChats: () =>
        set(() => ({
          chats: [],
          currentChatId: null,
        })),
      updateChatTitle: (chatId: string, title: string) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        })),
      refreshServerModels: async (serverId: string) => {
        const state = get()
        const server = state.settings.servers.find(s => s.id === serverId)
        if (server) {
          try {
            const models = await listModels(`${server.url}:${server.port}`)
            set((state) => ({
              settings: {
                ...state.settings,
                servers: state.settings.servers.map(s =>
                  s.id === serverId ? { ...s, models } : s
                )
              }
            }))
          } catch (error) {
            console.error('Failed to refresh models:', error)
          }
        }
      },
    }),
    {
      name: 'ollama-chat-storage',
    }
  )
)

