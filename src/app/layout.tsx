import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Recipe Master - Your Family Recipe Hub',
  description: 'The ultimate recipe management app for families. Store, organize, and plan your meals with ease.',
  keywords: ['recipes', 'cooking', 'meal planning', 'kitchen', 'family recipes'],
  authors: [{ name: 'Recipe Master' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                borderRadius: '1rem',
                padding: '1rem',
              },
              success: {
                iconTheme: {
                  primary: '#567856',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
