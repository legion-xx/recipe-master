'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import { usePreferencesStore } from '@/stores'

export function Providers({ children }: { children: React.ReactNode }) {
  const { preferences } = usePreferencesStore()

  // Set CSS variables for toast based on theme
  useEffect(() => {
    const root = document.documentElement
    const isDark = preferences.dark_mode
    
    root.style.setProperty('--toast-bg', isDark ? '#2b241f' : '#ffffff')
    root.style.setProperty('--toast-color', isDark ? '#fdf9f3' : '#2b241f')
  }, [preferences.dark_mode])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme={preferences.dark_mode ? 'dark' : 'light'}
    >
      {children}
    </ThemeProvider>
  )
}
