'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar, 
  ShoppingCart, 
  Warehouse, 
  TrendingUp,
  Clock,
  Heart,
  Sparkles,
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout, RecipeCard, RecipeEditor } from '@/components'
import { useRecipeStore, useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

// Demo recipes for initial state
const demoRecipes = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'demo',
    title: 'Classic Spaghetti Carbonara',
    description: 'A creamy Italian pasta dish with eggs, cheese, pancetta, and black pepper. Simple yet incredibly satisfying.',
    hero_image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    cuisine_type: 'italian' as const,
    meal_type: ['dinner' as const],
    tags: ['quick', 'comfort-food', 'pasta'],
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    total_time_minutes: 30,
    servings: 4,
    equipment: [],
    ingredient_sections: [],
    steps: [],
    is_favorite: true,
    rating: 4.8,
    variations: [],
    cook_logs: [],
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'demo',
    title: 'Chicken Tikka Masala',
    description: 'Tender chicken pieces in a rich, creamy tomato-based curry sauce. A British-Indian classic.',
    hero_image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    cuisine_type: 'indian' as const,
    meal_type: ['dinner' as const],
    tags: ['curry', 'spicy', 'crowd-pleaser'],
    prep_time_minutes: 20,
    cook_time_minutes: 40,
    total_time_minutes: 60,
    servings: 6,
    equipment: [],
    ingredient_sections: [],
    steps: [],
    is_favorite: false,
    rating: 4.5,
    variations: [],
    cook_logs: [],
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'demo',
    title: 'Avocado Toast with Poached Eggs',
    description: 'Crispy sourdough topped with smashed avocado and perfectly poached eggs. The ultimate brunch.',
    hero_image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    cuisine_type: 'american' as const,
    meal_type: ['breakfast' as const],
    tags: ['healthy', 'quick', 'brunch'],
    prep_time_minutes: 5,
    cook_time_minutes: 10,
    total_time_minutes: 15,
    servings: 2,
    equipment: [],
    ingredient_sections: [],
    steps: [],
    is_favorite: true,
    rating: 4.2,
    variations: [],
    cook_logs: [],
  },
]

const statCards = [
  { label: 'Total Recipes', value: '24', icon: BookOpen, color: 'primary' },
  { label: 'This Week\'s Menu', value: '7', icon: Calendar, color: 'sage' },
  { label: 'Shopping Items', value: '18', icon: ShoppingCart, color: 'kitchen' },
  { label: 'Pantry Items', value: '56', icon: Warehouse, color: 'cream' },
]

const quickActions = [
  { label: 'Add Recipe', icon: Plus, href: '#', action: 'openModal' },
  { label: 'Plan Menu', icon: Calendar, href: '/menu' },
  { label: 'Shopping List', icon: ShoppingCart, href: '/shopping' },
  { label: 'AI Generate', icon: Sparkles, href: '/generate' },
]

export default function DashboardPage() {
  const { recipes, setRecipes } = useRecipeStore()
  const { openRecipeModal } = useUIStore()

  // Load demo recipes on mount
  useEffect(() => {
    if (recipes.length === 0) {
      setRecipes(demoRecipes)
    }
  }, [recipes.length, setRecipes])

  const recentRecipes = recipes.slice(0, 3)
  const favoriteRecipes = recipes.filter(r => r.is_favorite).slice(0, 3)

  return (
    <DashboardLayout 
      title="Welcome back, Chef! 👨‍🍳" 
      subtitle="What are we cooking today?"
    >
      <RecipeEditor />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5 group hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-kitchen-500 dark:text-kitchen-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-display font-bold text-kitchen-800 dark:text-cream-100">
                  {stat.value}
                </p>
              </div>
              <div className={cn(
                'p-3 rounded-xl transition-transform group-hover:scale-110',
                stat.color === 'primary' && 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
                stat.color === 'sage' && 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400',
                stat.color === 'kitchen' && 'bg-kitchen-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-kitchen-400',
                stat.color === 'cream' && 'bg-cream-200 dark:bg-cream-900/20 text-cream-700 dark:text-cream-400',
              )}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="section-header mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            action.action === 'openModal' ? (
              <button
                key={action.label}
                onClick={() => openRecipeModal()}
                className="card p-6 text-center group hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                  <action.icon size={28} />
                </div>
                <span className="font-medium text-kitchen-700 dark:text-cream-200">
                  {action.label}
                </span>
              </button>
            ) : (
              <Link
                key={action.label}
                href={action.href}
                className="card p-6 text-center group hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white shadow-lg shadow-sage-500/30 group-hover:shadow-sage-500/50 transition-shadow">
                  <action.icon size={28} />
                </div>
                <span className="font-medium text-kitchen-700 dark:text-cream-200">
                  {action.label}
                </span>
              </Link>
            )
          ))}
        </div>
      </motion.div>

      {/* Recent Recipes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header">Recent Recipes</h2>
          <Link 
            href="/recipes" 
            className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentRecipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Favorites */}
      {favoriteRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-header flex items-center gap-2">
              <Heart size={24} className="text-red-500 fill-red-500" />
              Family Favorites
            </h2>
            <Link 
              href="/favorites" 
              className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
