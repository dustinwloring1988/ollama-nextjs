"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { create } from "zustand"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Trash2, Plus, RefreshCw } from 'lucide-react'
import { OllamaServer } from "@/types"
import { ScrollArea } from "./ui/scroll-area"

interface DialogStore {
  open: boolean
  openDialog: () => void
  closeDialog: () => void
}

export const useSettingsDialog = create<DialogStore>((set) => ({
  open: false,
  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),
}))

export function SettingsDialog() {
  const { open, closeDialog } = useSettingsDialog()
  const { settings, updateSettings, deleteAllChats, refreshServerModels } = useStore()
  const [newServer, setNewServer] = useState<Omit<OllamaServer, "id" | "models">>({
    name: "",
    url: "",
    port: 11434,
  })
  const [error, setError] = useState<string | null>(null)
  const [isAddingServer, setIsAddingServer] = useState<boolean>(false)

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const isDuplicate = settings.servers.some(
      server => server.url === newServer.url && server.port === newServer.port
    )

    if (isDuplicate) {
      setError("A server with this URL and port already exists.")
      return
    }

    updateSettings({
      servers: [
        ...settings.servers,
        { ...newServer, id: crypto.randomUUID(), models: [] },
      ],
    })
    setNewServer({ name: "", url: "", port: 11434 })
    setIsAddingServer(false)
  }

  const handleRemoveServer = (id: string) => {
    updateSettings({
      servers: settings.servers.filter((server) => server.id !== id),
      activeServerId:
        settings.activeServerId === id
          ? settings.servers[0]?.id ?? null
          : settings.activeServerId,
    })
  }

  const handleRefreshModels = async (serverId: string) => {
    await refreshServerModels(serverId)
  }

  const handleExportAllChats = () => {
    const { chats } = useStore.getState(); // Get the current chats from the store
    const chatExport = {
      chats,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(chatExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chats_export_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-[400px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="chat-history" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat-history">History</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-grow">
            <TabsContent value="chat-history" className="space-y-4">
              <div>
                <Button variant="outline" className="w-full" onClick={handleExportAllChats}>
                  Export All Chats
                </Button>
              </div>
              <div className="rounded-lg border border-destructive p-4">
                <h4 className="mb-2 font-medium">Danger Area</h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  This action cannot be undone!
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={deleteAllChats}
                >
                  Delete All Chats
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="providers" className="space-y-4">
              {isAddingServer ? (
                <form onSubmit={handleAddServer} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Server Name</Label>
                    <Input
                      value={newServer.name}
                      onChange={(e) =>
                        setNewServer((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Local Ollama"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={newServer.url}
                      onChange={(e) =>
                        setNewServer((prev) => ({ ...prev, url: e.target.value }))
                      }
                      placeholder="http://localhost"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input
                      type="number"
                      value={newServer.port}
                      onChange={(e) =>
                        setNewServer((prev) => ({ ...prev, port: parseInt(e.target.value) }))
                      }
                      placeholder="11434"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Server
                  </Button>
                  <Button type="button" className="w-full" onClick={() => setIsAddingServer(false)}>
                    Cancel
                  </Button>
                </form>
              ) : (
                <>
                  <Button onClick={() => setIsAddingServer(true)} className="w-full">
                    Add Server
                  </Button>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {settings.servers.map((server) => (
                        <Card
                          key={server.id}
                          className={
                            server.id === settings.activeServerId ? "border-primary" : ""
                          }
                        >
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="font-medium">{server.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {server.url}:{server.port}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Models: {server.models.length}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateSettings({ activeServerId: server.id })}
                                disabled={server.id === settings.activeServerId}
                              >
                                Use
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRefreshModels(server.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveServer(server.id)}
                                disabled={settings.servers.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </TabsContent>
            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) =>
                    updateSettings({ appearance: { ...settings.appearance, theme: value as "light" | "dark" | "system" } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={settings.appearance.fontSize}
                  onValueChange={(value) =>
                    updateSettings({ appearance: { ...settings.appearance, fontSize: value as "sm" | "base" | "lg" } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <DialogFooter className="flex justify-between mt-4">
          <a href="https://github.com/dustinwloring1988/ollama-nextjs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Documentation
          </a>
          <a href="https://github.com/dustinwloring1988/ollama-nextjs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            GitHub
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

