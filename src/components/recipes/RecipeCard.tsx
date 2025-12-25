'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Users, 
  Heart, 
  MoreVertical, 
  Edit, 
  Trash2,
  Calendar,
  Star
} from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import type { Recipe } from '@/types'
import { CUISINE_LABELS, MEAL_TYPE_LABELS } from '@/types'
import { useState, useRef, useEffect } from 'react'
import { useRecipeStore } from '@/stores'
import toast from 'react-hot-toast'

interface RecipeCardProps {
  recipe: Recipe
  onEdit?: () => void
  onDelete?: () => void
  onAddToMenu?: () => void
  index?: number
}

export function RecipeCard({ 
  recipe, 
  onEdit, 
  onDelete, 
  onAddToMenu,
  index = 0 
}: RecipeCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { updateRecipe } = useRecipeStore()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateRecipe(recipe.id, { is_favorite: !recipe.is_favorite })
    toast.success(recipe.is_favorite ? 'Removed from favorites' : 'Added to favorites')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/recipes/${recipe.id}`}>
        <article className="card card-hover group overflow-hidden cursor-pointer">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            {recipe.hero_image ? (
              <Image
                src={recipe.hero_image}
                alt={recipe.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-200 to-sage-200 dark:from-primary-900 dark:to-sage-900 flex items-center justify-center">
                <span className="text-6xl opacity-50">🍽️</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Favorite button */}
            <button
              onClick={toggleFavorite}
              className={cn(
                'absolute top-3 right-3 p-2 rounded-full transition-all',
                recipe.is_favorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-kitchen-600 hover:bg-white'
              )}
            >
              <Heart 
                size={18} 
                className={recipe.is_favorite ? 'fill-current' : ''} 
              />
            </button>

            {/* Rating badge */}
            {recipe.rating && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-kitchen-800 text-sm font-medium">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                {recipe.rating.toFixed(1)}
              </div>
            )}

            {/* Time and servings */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {formatTime(recipe.total_time_minutes)}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {recipe.servings}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="badge badge-primary">
                {CUISINE_LABELS[recipe.cuisine_type]}
              </span>
              {recipe.meal_type.slice(0, 2).map((type) => (
                <span key={type} className="badge badge-sage">
                  {MEAL_TYPE_LABELS[type]}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100 mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {recipe.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-kitchen-500 dark:text-kitchen-400 line-clamp-2">
              {recipe.description}
            </p>

            {/* Custom tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-2 py-0.5 rounded-full bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToMenu?.()
              }}
              className="btn btn-sm btn-outline"
            >
              <Calendar size={14} />
              Add to Menu
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="btn btn-ghost btn-icon btn-sm"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 bottom-full mb-2 w-40 card p-1 shadow-lg"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onEdit?.()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-kitchen-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-kitchen-800 rounded-lg"
                  >
                    <Edit size={14} />
                    Edit Recipe
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onDelete?.()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
