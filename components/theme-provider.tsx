"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useStore } from "@/lib/store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useStore()

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("text-sm", "text-base", "text-lg")
    root.classList.add(`text-${settings.appearance.fontSize}`)
  }, [settings.appearance.fontSize])

  return (
    <NextThemesProvider {...props} forcedTheme={settings.appearance.theme === 'system' ? undefined : settings.appearance.theme}>
      {children}
    </NextThemesProvider>
  )
}

