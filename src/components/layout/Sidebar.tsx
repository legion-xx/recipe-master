'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  BookOpen,
  Calendar,
  ShoppingCart,
  Warehouse,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
  Search,
  Plus,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore, usePreferencesStore } from '@/stores'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/', label: 'Dashboard', icon: ChefHat },
  { href: '/recipes', label: 'Recipes', icon: BookOpen },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/menu', label: 'Weekly Menu', icon: Calendar },
  { href: '/shopping', label: 'Shopping List', icon: ShoppingCart },
  { href: '/kitchen', label: 'My Kitchen', icon: Warehouse },
  { href: '/generate', label: 'AI Generator', icon: Sparkles },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isSidebarOpen, toggleSidebar, openRecipeModal } = useUIStore()
  const { preferences, updatePreferences } = usePreferencesStore()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Failed to sign out')
    } else {
      router.push('/login')
    }
  }

  const toggleDarkMode = () => {
    updatePreferences({ dark_mode: !preferences.dark_mode })
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-ghost btn-icon"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleSidebar()}
            className="lg:hidden fixed inset-0 bg-kitchen-950/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -280,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed left-0 top-0 h-full w-[280px] z-50',
          'bg-white dark:bg-kitchen-900',
          'border-r border-cream-200 dark:border-kitchen-800',
          'flex flex-col',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-cream-200 dark:border-kitchen-800">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-kitchen-800 dark:text-cream-100">
                Recipe Master
              </h1>
              <p className="text-xs text-kitchen-500 dark:text-kitchen-400">
                Family Recipe Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-cream-200 dark:border-kitchen-800">
          <button
            onClick={() => openRecipeModal()}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Recipe
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-item group',
                  isActive && 'nav-item-active'
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-primary-500' : 'text-kitchen-400 group-hover:text-kitchen-600 dark:group-hover:text-cream-300'
                  )}
                />
                <span>{item.label}</span>
                {item.href === '/favorites' && (
                  <span className="ml-auto badge badge-primary text-[10px]">
                    NEW
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-cream-200 dark:border-kitchen-800 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="nav-item w-full justify-start"
          >
            {preferences.dark_mode ? (
              <>
                <Sun size={20} className="text-kitchen-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={20} className="text-kitchen-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Settings */}
          <Link href="/settings" className="nav-item">
            <Settings size={20} className="text-kitchen-400" />
            <span>Settings</span>
          </Link>

          {/* Logout */}
          <button onClick={handleLogout} className="nav-item w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
