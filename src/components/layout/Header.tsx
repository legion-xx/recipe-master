'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, User, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRecipeStore, useUIStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
}

export function Header({ title, subtitle, showSearch = true }: HeaderProps) {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null)
  const { filters, setFilters } = useRecipeStore()
  const { openRecipeModal } = useUIStore()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
        })
      }
    }
    getUser()
  }, [supabase])

  return (
    <header className="sticky top-0 z-30 bg-cream-50/80 dark:bg-kitchen-950/80 backdrop-blur-xl border-b border-cream-200 dark:border-kitchen-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title */}
        <div>
          {title && (
            <h1 className="font-display text-2xl font-bold text-kitchen-800 dark:text-cream-100">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {showSearch && (
            <div className="relative hidden sm:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-kitchen-400"
              />
              <input
                type="text"
                placeholder="Search recipes..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="input pl-10 w-64 lg:w-80"
              />
            </div>
          )}

          {/* Add Recipe Button (Desktop) */}
          <button
            onClick={() => openRecipeModal()}
            className="hidden md:flex btn btn-primary"
          >
            <Plus size={18} />
            <span>Add Recipe</span>
          </button>

          {/* Notifications */}
          <button className="btn btn-ghost btn-icon relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-cream-100 dark:hover:bg-kitchen-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden lg:block text-sm font-medium text-kitchen-700 dark:text-cream-200">
              {user?.name || 'User'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
