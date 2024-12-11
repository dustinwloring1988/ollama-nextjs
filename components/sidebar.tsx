"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/lib/store"
import { Plus, Settings, MoreVertical, Pencil, Download, Trash2 } from 'lucide-react'
import { useState } from "react"
import { useSettingsDialog } from "./settings-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const [search, setSearch] = useState("")
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const { chats, currentChatId, setCurrentChat, addChat, deleteChat, updateChatTitle } = useStore()
  const { openDialog } = useSettingsDialog()

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  )

  const startNewChat = () => {
    const chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    }
    addChat(chat)
  }

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }

  const handleRenameSubmit = (chatId: string) => {
    if (editingTitle.trim()) {
      updateChatTitle(chatId, editingTitle.trim())
    }
    setEditingChatId(null)
    setEditingTitle("")
  }

  const exportChat = (chat: { title: string; messages: any[] }) => {
    const chatExport = {
      title: chat.title,
      messages: chat.messages,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(chatExport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-64 border-r bg-muted/50">
      <div className="flex h-14 items-center justify-between px-4">
        <Button onClick={startNewChat} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          Start new chat
        </Button>
      </div>
      <div className="p-4 pb-2">
        <Input
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8"
        />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="px-2 py-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center rounded-lg px-2 py-1 text-sm transition-colors hover:bg-accent ${
                chat.id === currentChatId ? "bg-accent" : ""
              }`}
            >
              {editingChatId === chat.id ? (
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleRenameSubmit(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit(chat.id)
                    if (e.key === "Escape") {
                      setEditingChatId(null)
                      setEditingTitle("")
                    }
                  }}
                  className="h-6 w-full"
                  autoFocus
                />
              ) : (
                <>
                  <button
                    onClick={() => setCurrentChat(chat.id)}
                    className="flex-1 text-left"
                  >
                    {chat.title}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRename(chat.id, chat.title)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportChat(chat)}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteChat(chat.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => openDialog()}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

