'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  ShoppingCart,
  Calendar as CalendarIcon
} from 'lucide-react'
import { DashboardLayout, RecipeEditor } from '@/components'
import { useRecipeStore, useMenuStore, useUIStore } from '@/stores'
import { cn, getWeekStart, getWeekDays, formatDate, generateId } from '@/lib/utils'
import type { MenuDay, MenuSlot, MealType } from '@/types'
import Link from 'next/link'

const mealSlots: { key: 'breakfast' | 'lunch' | 'dinner'; label: string; time: string }[] = [
  { key: 'breakfast', label: 'Breakfast', time: '7:00 AM' },
  { key: 'lunch', label: 'Lunch', time: '12:00 PM' },
  { key: 'dinner', label: 'Dinner', time: '6:00 PM' },
]

export default function MenuPage() {
  const { recipes } = useRecipeStore()
  const { openRecipeModal } = useUIStore()
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart())
  const [menuItems, setMenuItems] = useState<Record<string, Record<string, MenuSlot | null>>>({})
  const [draggedRecipe, setDraggedRecipe] = useState<string | null>(null)
  const [showRecipePicker, setShowRecipePicker] = useState<{ date: string; meal: string } | null>(null)

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart])

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart())
  }

  const getMenuSlot = (date: Date, meal: string): MenuSlot | null => {
    const dateKey = date.toISOString().split('T')[0]
    return menuItems[dateKey]?.[meal] || null
  }

  const setMenuSlot = (date: Date, meal: string, slot: MenuSlot | null) => {
    const dateKey = date.toISOString().split('T')[0]
    setMenuItems(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [meal]: slot,
      },
    }))
  }

  const handleDrop = (date: Date, meal: string, recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId)
    if (recipe) {
      setMenuSlot(date, meal, {
        recipe_id: recipeId,
        recipe,
        servings: recipe.servings,
      })
    }
    setDraggedRecipe(null)
  }

  const removeFromMenu = (date: Date, meal: string) => {
    setMenuSlot(date, meal, null)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const menuRecipeCount = Object.values(menuItems).reduce((acc, dayItems) => {
    return acc + Object.values(dayItems).filter(Boolean).length
  }, 0)

  return (
    <DashboardLayout title="Weekly Menu" subtitle="Plan your meals for the week">
      <RecipeEditor />

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={goToPreviousWeek} className="btn btn-ghost btn-icon">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-display text-xl font-semibold text-kitchen-800 dark:text-cream-100">
            {formatDate(weekDays[0], 'short')} - {formatDate(weekDays[6], 'short')}
          </h2>
          <button onClick={goToNextWeek} className="btn btn-ghost btn-icon">
            <ChevronRight size={20} />
          </button>
          <button onClick={goToToday} className="btn btn-sm btn-outline">
            Today
          </button>
        </div>

        <Link href="/shopping" className="btn btn-primary">
          <ShoppingCart size={18} />
          Generate Shopping List
          {menuRecipeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
              {menuRecipeCount}
            </span>
          )}
        </Link>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-cream-200 dark:border-kitchen-800">
          <div className="p-4 bg-cream-50 dark:bg-kitchen-950" />
          {weekDays.map(day => (
            <div
              key={day.toISOString()}
              className={cn(
                'p-4 text-center border-l border-cream-200 dark:border-kitchen-800',
                isToday(day) && 'bg-primary-50 dark:bg-primary-900/20'
              )}
            >
              <div className="text-sm text-kitchen-500 dark:text-kitchen-400">
                {formatDate(day, 'weekday')}
              </div>
              <div className={cn(
                'text-lg font-semibold',
                isToday(day) 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-kitchen-800 dark:text-cream-100'
              )}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Meal Rows */}
        {mealSlots.map(({ key, label, time }) => (
          <div key={key} className="grid grid-cols-8 border-b border-cream-200 dark:border-kitchen-800 last:border-b-0">
            <div className="p-4 bg-cream-50 dark:bg-kitchen-950 flex flex-col justify-center">
              <div className="font-medium text-kitchen-800 dark:text-cream-100">{label}</div>
              <div className="text-xs text-kitchen-500 dark:text-kitchen-400">{time}</div>
            </div>
            {weekDays.map(day => {
              const slot = getMenuSlot(day, key)
              const dateKey = day.toISOString().split('T')[0]
              
              return (
                <div
                  key={`${dateKey}-${key}`}
                  className={cn(
                    'p-2 min-h-[120px] border-l border-cream-200 dark:border-kitchen-800',
                    isToday(day) && 'bg-primary-50/50 dark:bg-primary-900/10',
                    draggedRecipe && 'bg-sage-50 dark:bg-sage-900/20 border-2 border-dashed border-sage-300 dark:border-sage-700'
                  )}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    if (draggedRecipe) {
                      handleDrop(day, key, draggedRecipe)
                    }
                  }}
                >
                  {slot ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-full"
                    >
                      <div className="relative h-full p-2 rounded-lg bg-white dark:bg-kitchen-800 shadow-sm border border-cream-200 dark:border-kitchen-700 group">
                        <button
                          onClick={() => removeFromMenu(day, key)}
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <Link href={`/recipes/${slot.recipe_id}`} className="block">
                          {slot.recipe?.hero_image && (
                            <img
                              src={slot.recipe.hero_image}
                              alt={slot.recipe.title}
                              className="w-full h-12 object-cover rounded mb-1"
                            />
                          )}
                          <p className="text-xs font-medium text-kitchen-800 dark:text-cream-100 line-clamp-2">
                            {slot.recipe?.title}
                          </p>
                          <p className="text-[10px] text-kitchen-500 dark:text-kitchen-400 mt-1">
                            {slot.servings} servings
                          </p>
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setShowRecipePicker({ date: dateKey, meal: key })}
                      className="w-full h-full flex items-center justify-center rounded-lg border-2 border-dashed border-kitchen-200 dark:border-kitchen-700 hover:border-primary-400 dark:hover:border-primary-600 text-kitchen-400 hover:text-primary-500 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Recipe Picker Sidebar */}
      <div className="mt-8">
        <h3 className="section-header mb-4">Available Recipes</h3>
        <p className="text-sm text-kitchen-500 dark:text-kitchen-400 mb-4">
          Drag recipes to add them to your menu, or click the + button in any slot
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              draggable
              onDragStart={() => setDraggedRecipe(recipe.id)}
              onDragEnd={() => setDraggedRecipe(null)}
              className={cn(
                'cursor-grab active:cursor-grabbing',
                'card p-3 hover:shadow-lg transition-shadow',
                draggedRecipe === recipe.id && 'opacity-50'
              )}
            >
              {recipe.hero_image && (
                <img
                  src={recipe.hero_image}
                  alt={recipe.title}
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
              )}
              <p className="text-sm font-medium text-kitchen-800 dark:text-cream-100 line-clamp-2">
                {recipe.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Picker Modal */}
      {showRecipePicker && (
        <div className="modal-backdrop" onClick={() => setShowRecipePicker(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white dark:bg-kitchen-900 rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold text-kitchen-800 dark:text-cream-100">
                Select a Recipe
              </h3>
              <button onClick={() => setShowRecipePicker(null)} className="btn btn-ghost btn-icon">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => {
                    const day = new Date(showRecipePicker.date)
                    handleDrop(day, showRecipePicker.meal, recipe.id)
                    setShowRecipePicker(null)
                  }}
                  className="card p-4 text-left hover:shadow-lg transition-shadow"
                >
                  {recipe.hero_image && (
                    <img
                      src={recipe.hero_image}
                      alt={recipe.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-medium text-kitchen-800 dark:text-cream-100">
                    {recipe.title}
                  </p>
                  <p className="text-sm text-kitchen-500 dark:text-kitchen-400 line-clamp-1">
                    {recipe.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  )
}
