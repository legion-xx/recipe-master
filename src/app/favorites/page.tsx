'use client'

import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import { DashboardLayout, RecipeCard, RecipeEditor } from '@/components'
import { useRecipeStore, useUIStore } from '@/stores'

export default function FavoritesPage() {
  const { recipes } = useRecipeStore()
  const { openRecipeModal } = useUIStore()

  const favoriteRecipes = useMemo(() => {
    return recipes.filter(r => r.is_favorite)
  }, [recipes])

  return (
    <DashboardLayout 
      title="Favorites" 
      subtitle={`${favoriteRecipes.length} favorite recipes`}
    >
      <RecipeEditor />

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRecipes.map((recipe, i) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              index={i}
              onEdit={() => openRecipeModal(recipe.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Heart size={32} className="text-red-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-kitchen-800 dark:text-cream-100 mb-2">
            No favorites yet
          </h3>
          <p className="text-kitchen-500 dark:text-kitchen-400">
            Click the heart icon on any recipe to add it to your favorites
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
