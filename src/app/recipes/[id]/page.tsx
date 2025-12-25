'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Heart, 
  Edit, 
  Printer,
  Share2,
  Timer,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Star,
  ChefHat,
  Calendar,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout, RecipeEditor } from '@/components'
import { useRecipeStore, useUIStore, useTimerStore, usePreferencesStore } from '@/stores'
import { cn, formatTime, formatQuantity, highlightIngredients, generateId } from '@/lib/utils'
import { CUISINE_LABELS, MEAL_TYPE_LABELS, UNIT_LABELS } from '@/types'
import toast from 'react-hot-toast'

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.id as string
  
  const { recipes, updateRecipe } = useRecipeStore()
  const { openRecipeModal } = useUIStore()
  const { timers, addTimer, removeTimer, startTimer, pauseTimer, resetTimer, tickTimer } = useTimerStore()
  const { preferences } = usePreferencesStore()
  
  const recipe = recipes.find(r => r.id === recipeId)
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [showCookLog, setShowCookLog] = useState(false)
  const [newLogNote, setNewLogNote] = useState('')
  const [newLogRating, setNewLogRating] = useState(0)

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      timers.forEach(timer => {
        if (timer.isRunning) {
          tickTimer(timer.id)
          if (timer.remainingSeconds <= 1) {
            // Play sound
            toast.success(`Timer complete: ${timer.label}`)
          }
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timers, tickTimer])

  const scaleFactor = recipe ? servings / recipe.servings : 1

  const allIngredientNames = useMemo(() => {
    if (!recipe) return []
    return recipe.ingredient_sections.flatMap(s => 
      s.ingredients.map(i => i.name)
    )
  }, [recipe])

  if (!recipe) {
    return (
      <DashboardLayout title="Recipe Not Found">
        <div className="text-center py-16">
          <p className="text-kitchen-500">This recipe doesn&apos;t exist.</p>
          <Link href="/recipes" className="btn btn-primary mt-4">
            <ArrowLeft size={18} /> Back to Recipes
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const toggleFavorite = () => {
    updateRecipe(recipe.id, { is_favorite: !recipe.is_favorite })
    toast.success(recipe.is_favorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleStartTimer = (stepIndex: number, minutes: number, label: string) => {
    const existingTimer = timers.find(t => t.recipeId === recipe.id && t.stepIndex === stepIndex)
    if (existingTimer) {
      if (existingTimer.isRunning) {
        pauseTimer(existingTimer.id)
      } else {
        startTimer(existingTimer.id)
      }
    } else {
      const timerId = generateId()
      addTimer({
        id: timerId,
        recipeId: recipe.id,
        stepIndex,
        label,
        totalSeconds: minutes * 60,
        remainingSeconds: minutes * 60,
      })
      startTimer(timerId)
    }
  }

  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addCookLog = () => {
    if (!newLogNote.trim()) return
    
    const newLog = {
      id: generateId(),
      created_at: new Date().toISOString(),
      notes: newLogNote,
      rating: newLogRating || undefined,
      images: [],
    }
    
    updateRecipe(recipe.id, {
      cook_logs: [...recipe.cook_logs, newLog],
    })
    
    setNewLogNote('')
    setNewLogRating(0)
    toast.success('Cook log added!')
  }

  return (
    <DashboardLayout showSearch={false}>
      <RecipeEditor />

      {/* Back Button */}
      <Link 
        href="/recipes" 
        className="inline-flex items-center gap-2 text-kitchen-500 hover:text-kitchen-700 dark:hover:text-cream-300 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Recipes
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        {recipe.hero_image ? (
          <img
            src={recipe.hero_image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary-200 to-sage-200 dark:from-primary-900 dark:to-sage-900 flex items-center justify-center">
            <ChefHat size={80} className="text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge bg-white/90 text-kitchen-800">
              {CUISINE_LABELS[recipe.cuisine_type]}
            </span>
            {recipe.meal_type.map(type => (
              <span key={type} className="badge bg-sage-500/90 text-white">
                {MEAL_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {recipe.title}
          </h1>
          <p className="text-white/80 max-w-2xl">
            {recipe.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={toggleFavorite}
            className={cn(
              'p-3 rounded-full transition-all',
              recipe.is_favorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-kitchen-600 hover:bg-white'
            )}
          >
            <Heart size={20} className={recipe.is_favorite ? 'fill-current' : ''} />
          </button>
          <button
            onClick={() => openRecipeModal(recipe.id)}
            className="p-3 rounded-full bg-white/90 text-kitchen-600 hover:bg-white"
          >
            <Edit size={20} />
          </button>
          <button className="p-3 rounded-full bg-white/90 text-kitchen-600 hover:bg-white">
            <Printer size={20} />
          </button>
          <button className="p-3 rounded-full bg-white/90 text-kitchen-600 hover:bg-white">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <Clock size={24} className="mx-auto text-primary-500 mb-2" />
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Prep Time</p>
          <p className="font-semibold text-kitchen-800 dark:text-cream-100">
            {formatTime(recipe.prep_time_minutes)}
          </p>
        </div>
        <div className="card p-4 text-center">
          <Timer size={24} className="mx-auto text-sage-500 mb-2" />
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Cook Time</p>
          <p className="font-semibold text-kitchen-800 dark:text-cream-100">
            {formatTime(recipe.cook_time_minutes)}
          </p>
        </div>
        <div className="card p-4 text-center">
          <Clock size={24} className="mx-auto text-kitchen-500 mb-2" />
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Total Time</p>
          <p className="font-semibold text-kitchen-800 dark:text-cream-100">
            {formatTime(recipe.total_time_minutes)}
          </p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="p-1 rounded-md hover:bg-cream-100 dark:hover:bg-kitchen-800"
            >
              <Minus size={16} />
            </button>
            <Users size={24} className="text-primary-500" />
            <button
              onClick={() => setServings(servings + 1)}
              className="p-1 rounded-md hover:bg-cream-100 dark:hover:bg-kitchen-800"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Servings</p>
          <p className="font-semibold text-kitchen-800 dark:text-cream-100">{servings}</p>
        </div>
      </div>

      {/* Rating */}
      {recipe.rating && (
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={24}
              className={cn(
                star <= Math.round(recipe.rating!) 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-kitchen-300 dark:text-kitchen-600'
              )}
            />
          ))}
          <span className="font-medium text-kitchen-800 dark:text-cream-100 ml-2">
            {recipe.rating.toFixed(1)}
          </span>
        </div>
      )}

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {recipe.tags.map(tag => (
            <span key={tag} className="badge badge-outline">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Equipment & Ingredients */}
        <div className="lg:col-span-1 space-y-6">
          {/* Equipment */}
          {recipe.equipment.length > 0 && (
            <div className="card p-6">
              <h2 className="section-header mb-4 flex items-center gap-2">
                <ChefHat size={20} className="text-primary-500" />
                Equipment
              </h2>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400 mb-4">
                Gather these before you start (mise en place)
              </p>
              <ul className="space-y-2">
                {recipe.equipment.map(equip => (
                  <li key={equip.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage-500" />
                    <span className="text-kitchen-700 dark:text-cream-300">
                      {equip.name}
                      {equip.is_optional && (
                        <span className="text-kitchen-400 text-sm ml-1">(optional)</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients */}
          <div className="card p-6">
            <h2 className="section-header mb-4">Ingredients</h2>
            {servings !== recipe.servings && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                Scaled for {servings} servings (original: {recipe.servings})
              </p>
            )}
            
            {recipe.ingredient_sections.map(section => (
              <div key={section.id} className="mb-6 last:mb-0">
                {recipe.ingredient_sections.length > 1 && (
                  <h3 className="font-medium text-kitchen-700 dark:text-cream-200 mb-3 pb-2 border-b border-cream-200 dark:border-kitchen-700">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-3">
                  {section.ingredients.map(ing => (
                    <li key={ing.id} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                      <span className="text-kitchen-700 dark:text-cream-300">
                        <strong className="text-primary-600 dark:text-primary-400 font-semibold">
                          {formatQuantity(ing.quantity * scaleFactor)} {UNIT_LABELS[ing.unit]}
                        </strong>{' '}
                        <strong className="text-primary-600 dark:text-primary-400 font-semibold">
                          {ing.name}
                        </strong>
                        {ing.preparation && (
                          <span className="text-kitchen-500">, {ing.preparation}</span>
                        )}
                        {ing.is_optional && (
                          <span className="text-kitchen-400 text-sm ml-1">(optional)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="section-header mb-6">Instructions</h2>
            
            <div className="space-y-6">
              {recipe.steps.map((step, index) => {
                const timer = timers.find(t => t.recipeId === recipe.id && t.stepIndex === index)
                
                return (
                  <div key={step.id} className="recipe-step">
                    <div className="step-number">{index + 1}</div>
                    <div>
                      <p 
                        className="text-kitchen-700 dark:text-cream-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: highlightIngredients(step.instruction, allIngredientNames)
                        }}
                      />
                      
                      {step.tips && (
                        <p className="mt-2 text-sm text-sage-600 dark:text-sage-400 italic">
                          💡 Tip: {step.tips}
                        </p>
                      )}

                      {step.timer_minutes && (
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => handleStartTimer(index, step.timer_minutes!, `Step ${index + 1}`)}
                            className={cn(
                              'btn btn-sm',
                              timer?.isRunning 
                                ? 'btn-primary timer-active' 
                                : 'btn-outline'
                            )}
                          >
                            {timer?.isRunning ? (
                              <>
                                <Pause size={14} />
                                {formatTimerDisplay(timer.remainingSeconds)}
                              </>
                            ) : timer?.isPaused ? (
                              <>
                                <Play size={14} />
                                {formatTimerDisplay(timer.remainingSeconds)}
                              </>
                            ) : (
                              <>
                                <Timer size={14} />
                                {step.timer_minutes} min
                              </>
                            )}
                          </button>
                          {timer && (
                            <button
                              onClick={() => {
                                resetTimer(timer.id)
                              }}
                              className="btn btn-ghost btn-sm"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      {step.image_url && (
                        <img 
                          src={step.image_url} 
                          alt={`Step ${index + 1}`}
                          className="mt-4 rounded-lg max-w-md"
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          {recipe.notes && (
            <div className="card p-6 bg-cream-50 dark:bg-kitchen-950">
              <h3 className="font-medium text-kitchen-800 dark:text-cream-100 mb-2">Personal Notes</h3>
              <p className="text-kitchen-600 dark:text-cream-400">{recipe.notes}</p>
            </div>
          )}

          {/* Cook Log */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-header flex items-center gap-2">
                <MessageSquare size={20} className="text-sage-500" />
                Cook Log
              </h2>
              <button
                onClick={() => setShowCookLog(!showCookLog)}
                className="btn btn-sm btn-outline"
              >
                <Plus size={14} />
                Add Entry
              </button>
            </div>

            {showCookLog && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mb-6 p-4 bg-cream-50 dark:bg-kitchen-950 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewLogRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={cn(
                          star <= newLogRating 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-kitchen-300 dark:text-kitchen-600'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newLogNote}
                  onChange={e => setNewLogNote(e.target.value)}
                  placeholder="How did it turn out? Any modifications you made?"
                  rows={3}
                  className="input resize-none mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowCookLog(false)} className="btn btn-ghost btn-sm">
                    Cancel
                  </button>
                  <button onClick={addCookLog} className="btn btn-primary btn-sm">
                    Save Entry
                  </button>
                </div>
              </motion.div>
            )}

            {recipe.cook_logs.length > 0 ? (
              <div className="space-y-4">
                {recipe.cook_logs.slice().reverse().map(log => (
                  <div key={log.id} className="border-l-2 border-sage-300 dark:border-sage-700 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-kitchen-500 dark:text-kitchen-400">
                        {new Date(log.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {log.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={12}
                              className={cn(
                                star <= log.rating! 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-kitchen-300'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-kitchen-700 dark:text-cream-300">{log.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-kitchen-400 dark:text-kitchen-500 text-center py-4">
                No cook log entries yet. Make this recipe and share your experience!
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
