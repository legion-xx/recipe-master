'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showSearch?: boolean
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle,
  showSearch = true 
}: DashboardLayoutProps) {
  const { isSidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-kitchen-950">
      <Sidebar />
      
      <main
        className={cn(
          'transition-all duration-300',
          'lg:ml-[280px]'
        )}
      >
        <Header title={title} subtitle={subtitle} showSearch={showSearch} />
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
