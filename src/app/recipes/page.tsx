'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  SlidersHorizontal,
  Grid3X3,
  List,
  Clock,
  ChevronDown
} from 'lucide-react'
import { DashboardLayout, RecipeCard, RecipeEditor } from '@/components'
import { useRecipeStore, useUIStore } from '@/stores'
import { cn } from '@/lib/utils'
import { CUISINE_LABELS, MEAL_TYPE_LABELS, CuisineType, MealType, SortOption } from '@/types'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'created_desc', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'A to Z' },
  { value: 'title_desc', label: 'Z to A' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'time_asc', label: 'Quickest' },
  { value: 'time_desc', label: 'Longest' },
]

export default function RecipesPage() {
  const { recipes, filters, setFilters, sortBy, setSortBy, resetFilters } = useRecipeStore()
  const { openRecipeModal } = useUIStore()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredRecipes = useMemo(() => {
    let result = [...recipes]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(r => 
        r.title.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search) ||
        r.tags.some(t => t.toLowerCase().includes(search))
      )
    }

    if (filters.cuisine_types.length > 0) {
      result = result.filter(r => filters.cuisine_types.includes(r.cuisine_type))
    }

    if (filters.meal_types.length > 0) {
      result = result.filter(r => r.meal_type.some(m => filters.meal_types.includes(m)))
    }

    if (filters.favorites_only) {
      result = result.filter(r => r.is_favorite)
    }

    if (filters.max_time_minutes) {
      result = result.filter(r => r.total_time_minutes <= filters.max_time_minutes!)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title_asc': return a.title.localeCompare(b.title)
        case 'title_desc': return b.title.localeCompare(a.title)
        case 'created_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'created_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'rating_desc': return (b.rating || 0) - (a.rating || 0)
        case 'time_asc': return a.total_time_minutes - b.total_time_minutes
        case 'time_desc': return b.total_time_minutes - a.total_time_minutes
        default: return 0
      }
    })

    return result
  }, [recipes, filters, sortBy])

  const activeFilterCount = [
    filters.cuisine_types.length,
    filters.meal_types.length,
    filters.tags.length,
    filters.favorites_only ? 1 : 0,
    filters.max_time_minutes ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const toggleCuisine = (cuisine: CuisineType) => {
    const current = filters.cuisine_types
    if (current.includes(cuisine)) {
      setFilters({ cuisine_types: current.filter(c => c !== cuisine) })
    } else {
      setFilters({ cuisine_types: [...current, cuisine] })
    }
  }

  const toggleMealType = (type: MealType) => {
    const current = filters.meal_types
    if (current.includes(type)) {
      setFilters({ meal_types: current.filter(m => m !== type) })
    } else {
      setFilters({ meal_types: [...current, type] })
    }
  }

  return (
    <DashboardLayout title="All Recipes" subtitle={`${filteredRecipes.length} recipes found`}>
      <RecipeEditor />

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-kitchen-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={e => setFilters({ search: e.target.value })}
            className="input pl-10"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-kitchen-400 hover:text-kitchen-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn('btn btn-outline', showFilters && 'bg-primary-50 dark:bg-primary-900/20 border-primary-500')}
        >
          <SlidersHorizontal size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary-500 text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="input pr-10 appearance-none cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-kitchen-400 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1 p-1 bg-cream-100 dark:bg-kitchen-800 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2 rounded-md transition-colors', viewMode === 'grid' ? 'bg-white dark:bg-kitchen-700 shadow-sm' : 'text-kitchen-500 hover:text-kitchen-700')}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-2 rounded-md transition-colors', viewMode === 'list' ? 'bg-white dark:bg-kitchen-700 shadow-sm' : 'text-kitchen-500 hover:text-kitchen-700')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-kitchen-800 dark:text-cream-100">Filter Recipes</h3>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label">Cuisine Type</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(CUISINE_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => toggleCuisine(value as CuisineType)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          filters.cuisine_types.includes(value as CuisineType)
                            ? 'bg-primary-500 text-white'
                            : 'bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-kitchen-700'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Meal Type</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => toggleMealType(value as MealType)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          filters.meal_types.includes(value as MealType)
                            ? 'bg-sage-500 text-white'
                            : 'bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-kitchen-700'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Clock size={16} />
                    Maximum Time
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[15, 30, 45, 60, 90, 120].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setFilters({ max_time_minutes: filters.max_time_minutes === mins ? undefined : mins })}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          filters.max_time_minutes === mins
                            ? 'bg-kitchen-600 text-white'
                            : 'bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-kitchen-700'
                        )}
                      >
                        {mins < 60 ? `${mins} min` : `${mins / 60} hr`}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.favorites_only}
                    onChange={e => setFilters({ favorites_only: e.target.checked })}
                    className="w-5 h-5 rounded border-kitchen-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-kitchen-700 dark:text-cream-300">Show favorites only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredRecipes.length > 0 ? (
        <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
          {filteredRecipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} onEdit={() => openRecipeModal(recipe.id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 dark:bg-kitchen-800 flex items-center justify-center">
            <Search size={32} className="text-kitchen-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-kitchen-800 dark:text-cream-100 mb-2">No recipes found</h3>
          <p className="text-kitchen-500 dark:text-kitchen-400 mb-4">Try adjusting your filters or search terms</p>
          <button onClick={resetFilters} className="btn btn-primary">Clear Filters</button>
        </div>
      )}
    </DashboardLayout>
  )
}
