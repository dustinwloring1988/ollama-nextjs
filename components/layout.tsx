"use client"

import { Sidebar } from './sidebar'
import { SettingsDialog } from './settings-dialog'
import { useStore } from "@/lib/store"

export function Layout({ children }: { children: React.ReactNode }) {
  const { settings } = useStore()

  return (
    <div className={`flex h-screen bg-background text-${settings.appearance.fontSize}`}>
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <SettingsDialog />
    </div>
  )
}

