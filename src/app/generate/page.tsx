'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Wand2, 
  ChefHat, 
  Shuffle,
  Loader2,
  Plus,
  ArrowRight
} from 'lucide-react'
import { DashboardLayout, RecipeEditor } from '@/components'
import { useRecipeStore, useUIStore, useKitchenStore } from '@/stores'
import { cn } from '@/lib/utils'
import { CUISINE_LABELS, MEAL_TYPE_LABELS, CuisineType, MealType } from '@/types'

type GenerationMode = 'scratch' | 'kitchen' | 'improve'

export default function GeneratePage() {
  const { recipes, addRecipe } = useRecipeStore()
  const { openRecipeModal } = useUIStore()
  const [mode, setMode] = useState<GenerationMode>('scratch')
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | ''>('')
  const [selectedMealType, setSelectedMealType] = useState<MealType | ''>('')
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock generated recipe
    setGeneratedRecipe({
      title: 'AI-Generated Lemon Herb Chicken',
      description: 'A bright and flavorful roasted chicken with fresh herbs and citrus.',
      cuisine_type: selectedCuisine || 'mediterranean',
      meal_type: [selectedMealType || 'dinner'],
      prep_time_minutes: 15,
      cook_time_minutes: 45,
      servings: 4,
      ingredients: [
        { name: 'chicken thighs', quantity: 4, unit: 'pieces' },
        { name: 'lemon', quantity: 2, unit: 'pieces' },
        { name: 'fresh rosemary', quantity: 2, unit: 'sprigs' },
        { name: 'garlic', quantity: 4, unit: 'cloves' },
        { name: 'olive oil', quantity: 3, unit: 'tablespoons' },
      ],
      steps: [
        'Preheat oven to 400°F (200°C).',
        'Mix olive oil, lemon juice, minced garlic, and chopped rosemary.',
        'Season chicken with salt and pepper, then coat with the marinade.',
        'Roast for 40-45 minutes until golden and cooked through.',
      ],
    })
    
    setIsGenerating(false)
  }

  return (
    <DashboardLayout 
      title="AI Recipe Generator" 
      subtitle="Create unique recipes with Claude AI"
    >
      <RecipeEditor />

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setMode('scratch')}
          className={cn(
            'card p-6 text-left transition-all hover:shadow-lg',
            mode === 'scratch' && 'ring-2 ring-primary-500 shadow-lg'
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-4">
            <Wand2 size={24} />
          </div>
          <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100 mb-2">
            Create from Scratch
          </h3>
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
            Generate a completely new recipe based on your preferences
          </p>
        </button>

        <button
          onClick={() => setMode('kitchen')}
          className={cn(
            'card p-6 text-left transition-all hover:shadow-lg',
            mode === 'kitchen' && 'ring-2 ring-sage-500 shadow-lg'
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white mb-4">
            <ChefHat size={24} />
          </div>
          <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100 mb-2">
            Use My Kitchen
          </h3>
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
            Create recipes using ingredients you already have on hand
          </p>
        </button>

        <button
          onClick={() => setMode('improve')}
          className={cn(
            'card p-6 text-left transition-all hover:shadow-lg',
            mode === 'improve' && 'ring-2 ring-kitchen-500 shadow-lg'
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kitchen-400 to-kitchen-600 flex items-center justify-center text-white mb-4">
            <Shuffle size={24} />
          </div>
          <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100 mb-2">
            Improve Existing
          </h3>
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
            Let AI suggest improvements to your existing recipes
          </p>
        </button>
      </div>

      {/* Generation Form */}
      <div className="card p-6 mb-8">
        <h3 className="font-display text-xl font-semibold text-kitchen-800 dark:text-cream-100 mb-6">
          {mode === 'scratch' && 'Describe Your Ideal Recipe'}
          {mode === 'kitchen' && 'What Would You Like to Make?'}
          {mode === 'improve' && 'Select a Recipe to Improve'}
        </h3>

        {mode !== 'improve' ? (
          <div className="space-y-6">
            <div>
              <label className="label">What are you in the mood for?</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="E.g., A quick and healthy weeknight dinner, something spicy and warming, a crowd-pleasing appetizer..."
                rows={3}
                className="input resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Cuisine (optional)</label>
                <select
                  value={selectedCuisine}
                  onChange={e => setSelectedCuisine(e.target.value as CuisineType)}
                  className="input"
                >
                  <option value="">Any cuisine</option>
                  {Object.entries(CUISINE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Meal Type (optional)</label>
                <select
                  value={selectedMealType}
                  onChange={e => setSelectedMealType(e.target.value as MealType)}
                  className="input"
                >
                  <option value="">Any meal</option>
                  {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {mode === 'kitchen' && (
              <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl">
                <p className="text-sm text-sage-700 dark:text-sage-400">
                  <strong>Available in your kitchen:</strong> Chicken, eggs, pasta, rice, 
                  garlic, onions, olive oil, butter, and common spices.
                </p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn btn-lg btn-primary w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Recipe
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-kitchen-500 dark:text-kitchen-400 mb-4">
              Select a recipe from your collection to improve:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  className="card p-4 text-left hover:shadow-lg transition-shadow"
                >
                  {recipe.hero_image && (
                    <img
                      src={recipe.hero_image}
                      alt={recipe.title}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-medium text-kitchen-800 dark:text-cream-100 line-clamp-2">
                    {recipe.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generated Recipe Preview */}
      {generatedRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="badge badge-primary mb-2">AI Generated</span>
              <h3 className="font-display text-2xl font-bold text-kitchen-800 dark:text-cream-100">
                {generatedRecipe.title}
              </h3>
              <p className="text-kitchen-500 dark:text-kitchen-400 mt-1">
                {generatedRecipe.description}
              </p>
            </div>
            <button className="btn btn-primary">
              <Plus size={18} />
              Save Recipe
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-kitchen-800 dark:text-cream-100 mb-3">
                Ingredients
              </h4>
              <ul className="space-y-2">
                {generatedRecipe.ingredients.map((ing: any, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-kitchen-600 dark:text-cream-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {ing.quantity} {ing.unit}
                    </span>
                    {ing.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-kitchen-800 dark:text-cream-100 mb-3">
                Instructions
              </h4>
              <ol className="space-y-3">
                {generatedRecipe.steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-500 text-white text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-kitchen-600 dark:text-cream-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-cream-200 dark:border-kitchen-800">
            <button className="btn btn-outline flex-1">
              <Shuffle size={18} />
              Generate Another
            </button>
            <button className="btn btn-secondary flex-1">
              <Wand2 size={18} />
              Modify This Recipe
            </button>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  )
}
