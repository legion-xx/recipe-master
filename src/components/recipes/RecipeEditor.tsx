'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Timer,
  AlertCircle,
} from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import { useUIStore, useRecipeStore } from '@/stores'
import type {
  Recipe,
  IngredientSection,
  RecipeIngredient,
  RecipeStep,
  Equipment,
  CuisineType,
  MealType,
  IngredientUnit,
} from '@/types'
import {
  CUISINE_LABELS,
  MEAL_TYPE_LABELS,
  UNIT_LABELS,
} from '@/types'
import toast from 'react-hot-toast'

const defaultIngredient: Omit<RecipeIngredient, 'id'> = {
  ingredient_id: '',
  name: '',
  quantity: 1,
  unit: 'piece',
  is_optional: false,
}

const defaultStep: Omit<RecipeStep, 'id' | 'order'> = {
  instruction: '',
}

const defaultSection: Omit<IngredientSection, 'id'> = {
  title: 'Main Ingredients',
  ingredients: [],
}

const defaultEquipment: Omit<Equipment, 'id'> = {
  name: '',
  is_optional: false,
}

export function RecipeEditor() {
  const { isRecipeModalOpen, activeRecipeId, closeRecipeModal } = useUIStore()
  const { recipes, addRecipe, updateRecipe } = useRecipeStore()
  
  const existingRecipe = activeRecipeId 
    ? recipes.find(r => r.id === activeRecipeId) 
    : null

  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    cuisine_type: 'american',
    meal_type: ['dinner'],
    tags: [],
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 4,
    equipment: [],
    ingredient_sections: [{ id: generateId(), ...defaultSection, ingredients: [] }],
    steps: [],
    is_favorite: false,
  })

  const [currentTag, setCurrentTag] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'ingredients' | 'steps' | 'media'>('basic')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isRecipeModalOpen) {
      if (existingRecipe) {
        setFormData(existingRecipe)
      } else {
        setFormData({
          title: '',
          description: '',
          cuisine_type: 'american',
          meal_type: ['dinner'],
          tags: [],
          prep_time_minutes: 15,
          cook_time_minutes: 30,
          servings: 4,
          equipment: [],
          ingredient_sections: [{ id: generateId(), ...defaultSection, ingredients: [] }],
          steps: [],
          is_favorite: false,
        })
      }
      setActiveTab('basic')
    }
  }, [isRecipeModalOpen, existingRecipe])

  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast.error('Please enter a recipe title')
      return
    }

    const now = new Date().toISOString()
    
    if (existingRecipe) {
      updateRecipe(existingRecipe.id, {
        ...formData,
        total_time_minutes: (formData.prep_time_minutes || 0) + (formData.cook_time_minutes || 0),
      })
      toast.success('Recipe updated!')
    } else {
      const newRecipe: Recipe = {
        ...formData as Recipe,
        id: generateId(),
        created_at: now,
        updated_at: now,
        user_id: '',
        total_time_minutes: (formData.prep_time_minutes || 0) + (formData.cook_time_minutes || 0),
        variations: [],
        cook_logs: [],
      }
      addRecipe(newRecipe)
      toast.success('Recipe created!')
    }
    
    closeRecipeModal()
  }

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) return
    
    setIsImporting(true)
    try {
      const response = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      })
      
      if (!response.ok) throw new Error('Failed to parse recipe')
      
      const parsedRecipe = await response.json()
      setFormData(prev => ({
        ...prev,
        ...parsedRecipe,
        source_url: importUrl,
      }))
      toast.success('Recipe imported! Review and save when ready.')
      setImportUrl('')
    } catch (error) {
      toast.error('Failed to import recipe. Please try again or enter manually.')
    } finally {
      setIsImporting(false)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }))
  }

  const toggleMealType = (type: MealType) => {
    setFormData(prev => {
      const current = prev.meal_type || []
      if (current.includes(type)) {
        return { ...prev, meal_type: current.filter(t => t !== type) }
      }
      return { ...prev, meal_type: [...current, type] }
    })
  }

  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...(prev.equipment || []), { id: generateId(), ...defaultEquipment }],
    }))
  }

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.map(e => e.id === id ? { ...e, ...updates } : e) || [],
    }))
  }

  const removeEquipment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter(e => e.id !== id) || [],
    }))
  }

  const addIngredientSection = () => {
    setFormData(prev => ({
      ...prev,
      ingredient_sections: [
        ...(prev.ingredient_sections || []),
        { id: generateId(), title: 'New Section', ingredients: [] },
      ],
    }))
  }

  const updateIngredientSection = (id: string, updates: Partial<IngredientSection>) => {
    setFormData(prev => ({
      ...prev,
      ingredient_sections: prev.ingredient_sections?.map(s => 
        s.id === id ? { ...s, ...updates } : s
      ) || [],
    }))
  }

  const removeIngredientSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredient_sections: prev.ingredient_sections?.filter(s => s.id !== id) || [],
    }))
  }

  const addIngredient = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      ingredient_sections: prev.ingredient_sections?.map(s =>
        s.id === sectionId
          ? { ...s, ingredients: [...s.ingredients, { id: generateId(), ...defaultIngredient }] }
          : s
      ) || [],
    }))
  }

  const updateIngredient = (sectionId: string, ingredientId: string, updates: Partial<RecipeIngredient>) => {
    setFormData(prev => ({
      ...prev,
      ingredient_sections: prev.ingredient_sections?.map(s =>
        s.id === sectionId
          ? {
              ...s,
              ingredients: s.ingredients.map(i =>
                i.id === ingredientId ? { ...i, ...updates } : i
              ),
            }
          : s
      ) || [],
    }))
  }

  const removeIngredient = (sectionId: string, ingredientId: string) => {
    setFormData(prev => ({
      ...prev,
      ingredient_sections: prev.ingredient_sections?.map(s =>
        s.id === sectionId
          ? { ...s, ingredients: s.ingredients.filter(i => i.id !== ingredientId) }
          : s
      ) || [],
    }))
  }

  const addStep = () => {
    const newOrder = (formData.steps?.length || 0) + 1
    setFormData(prev => ({
      ...prev,
      steps: [...(prev.steps || []), { id: generateId(), order: newOrder, ...defaultStep }],
    }))
  }

  const updateStep = (id: string, updates: Partial<RecipeStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps?.map(s => s.id === id ? { ...s, ...updates } : s) || [],
    }))
  }

  const removeStep = (id: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps?.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })) || [],
    }))
  }

  const toggleSectionExpand = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (!isRecipeModalOpen) return null

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={closeRecipeModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="fixed inset-4 md:inset-8 lg:inset-12 bg-white dark:bg-kitchen-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-kitchen-800">
            <h2 className="font-display text-2xl font-bold text-kitchen-800 dark:text-cream-100">
              {existingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </h2>
            <button onClick={closeRecipeModal} className="btn btn-ghost btn-icon">
              <X size={24} />
            </button>
          </div>

          {/* URL Import */}
          <div className="px-6 py-4 bg-cream-50 dark:bg-kitchen-950 border-b border-cream-200 dark:border-kitchen-800">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-kitchen-400" />
                <input
                  type="url"
                  placeholder="Paste a recipe URL to import..."
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <button
                onClick={handleImportFromUrl}
                disabled={isImporting || !importUrl.trim()}
                className="btn btn-secondary"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-cream-200 dark:border-kitchen-800 px-6">
            {(['basic', 'ingredients', 'steps', 'media'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3 font-medium text-sm capitalize transition-colors relative',
                  activeTab === tab
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-kitchen-500 hover:text-kitchen-700 dark:text-kitchen-400 dark:hover:text-cream-300'
                )}
              >
                {tab === 'basic' ? 'Basic Info' : tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="label">Recipe Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter recipe title..."
                    className="input text-lg font-medium"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief description of the recipe..."
                    rows={3}
                    className="input resize-none"
                  />
                </div>

                <div>
                  <label className="label">Cuisine Type</label>
                  <select
                    value={formData.cuisine_type || 'american'}
                    onChange={e => setFormData(prev => ({ ...prev, cuisine_type: e.target.value as CuisineType }))}
                    className="input"
                  >
                    {Object.entries(CUISINE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Meal Type(s)</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => toggleMealType(value as MealType)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          formData.meal_type?.includes(value as MealType)
                            ? 'bg-sage-500 text-white'
                            : 'bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-kitchen-700'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Prep Time (min)</label>
                    <input
                      type="number"
                      value={formData.prep_time_minutes || 0}
                      onChange={e => setFormData(prev => ({ ...prev, prep_time_minutes: parseInt(e.target.value) || 0 }))}
                      min={0}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Cook Time (min)</label>
                    <input
                      type="number"
                      value={formData.cook_time_minutes || 0}
                      onChange={e => setFormData(prev => ({ ...prev, cook_time_minutes: parseInt(e.target.value) || 0 }))}
                      min={0}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Servings</label>
                    <input
                      type="number"
                      value={formData.servings || 4}
                      onChange={e => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                      min={1}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={e => setCurrentTag(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="input flex-1"
                    />
                    <button onClick={addTag} className="btn btn-outline">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream-100 dark:bg-kitchen-800 text-sm"
                      >
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="text-kitchen-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Equipment (Mise en Place)</label>
                    <button onClick={addEquipment} className="btn btn-sm btn-outline">
                      <Plus size={14} /> Add Equipment
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.equipment?.map(equip => (
                      <div key={equip.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={equip.name}
                          onChange={e => updateEquipment(equip.id, { name: e.target.value })}
                          placeholder="Equipment name..."
                          className="input flex-1"
                        />
                        <label className="flex items-center gap-2 text-sm text-kitchen-600 dark:text-cream-400">
                          <input
                            type="checkbox"
                            checked={equip.is_optional}
                            onChange={e => updateEquipment(equip.id, { is_optional: e.target.checked })}
                            className="rounded"
                          />
                          Optional
                        </label>
                        <button onClick={() => removeEquipment(equip.id)} className="btn btn-ghost btn-icon btn-sm text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {formData.equipment?.length === 0 && (
                      <p className="text-sm text-kitchen-400 dark:text-kitchen-500 italic">
                        No equipment added yet. Add the tools needed for this recipe.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
                      Ingredient Sections
                    </h3>
                    <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                      Organize ingredients into sections (e.g., &quot;For the sauce&quot;, &quot;For the marinade&quot;)
                    </p>
                  </div>
                  <button onClick={addIngredientSection} className="btn btn-primary">
                    <Plus size={18} /> Add Section
                  </button>
                </div>

                {formData.ingredient_sections?.map((section, sectionIndex) => (
                  <div key={section.id} className="card p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <button onClick={() => toggleSectionExpand(section.id)} className="btn btn-ghost btn-icon btn-sm">
                        {expandedSections.has(section.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <input
                        type="text"
                        value={section.title}
                        onChange={e => updateIngredientSection(section.id, { title: e.target.value })}
                        className="input flex-1 font-medium"
                        placeholder="Section title..."
                      />
                      <span className="text-sm text-kitchen-500">{section.ingredients.length} ingredient(s)</span>
                      {formData.ingredient_sections!.length > 1 && (
                        <button onClick={() => removeIngredientSection(section.id)} className="btn btn-ghost btn-icon btn-sm text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {(expandedSections.has(section.id) || sectionIndex === 0) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2"
                        >
                          {section.ingredients.map((ingredient) => (
                            <div key={ingredient.id} className="flex items-center gap-2 p-2 bg-cream-50 dark:bg-kitchen-950 rounded-lg">
                              <GripVertical size={16} className="text-kitchen-400 cursor-grab" />
                              <input
                                type="number"
                                value={ingredient.quantity}
                                onChange={e => updateIngredient(section.id, ingredient.id, { quantity: parseFloat(e.target.value) || 0 })}
                                className="input w-20 text-center"
                                step="0.25"
                                min="0"
                              />
                              <select
                                value={ingredient.unit}
                                onChange={e => updateIngredient(section.id, ingredient.id, { unit: e.target.value as IngredientUnit })}
                                className="input w-28"
                              >
                                {Object.entries(UNIT_LABELS).map(([value, label]) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={ingredient.name}
                                onChange={e => updateIngredient(section.id, ingredient.id, { name: e.target.value })}
                                placeholder="Ingredient name..."
                                className="input flex-1 font-semibold text-primary-600 dark:text-primary-400"
                              />
                              <input
                                type="text"
                                value={ingredient.preparation || ''}
                                onChange={e => updateIngredient(section.id, ingredient.id, { preparation: e.target.value })}
                                placeholder="Prep (diced, minced...)"
                                className="input w-40"
                              />
                              <label className="flex items-center gap-1 text-xs text-kitchen-500">
                                <input
                                  type="checkbox"
                                  checked={ingredient.is_optional}
                                  onChange={e => updateIngredient(section.id, ingredient.id, { is_optional: e.target.checked })}
                                  className="rounded"
                                />
                                Opt.
                              </label>
                              <button onClick={() => removeIngredient(section.id, ingredient.id)} className="btn btn-ghost btn-icon btn-sm text-red-500">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addIngredient(section.id)}
                            className="w-full py-2 border-2 border-dashed border-kitchen-300 dark:border-kitchen-700 rounded-lg text-kitchen-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus size={18} /> Add Ingredient
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
                      Cooking Steps
                    </h3>
                    <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                      Add step-by-step instructions. Tip: Add timers for steps that need them.
                    </p>
                  </div>
                  <button onClick={addStep} className="btn btn-primary">
                    <Plus size={18} /> Add Step
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.steps?.map((step, index) => (
                    <div key={step.id} className="recipe-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="space-y-3">
                        <textarea
                          value={step.instruction}
                          onChange={e => updateStep(step.id, { instruction: e.target.value })}
                          placeholder="Describe this step..."
                          rows={3}
                          className="input resize-none"
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Timer size={16} className="text-kitchen-400" />
                            <input
                              type="number"
                              value={step.timer_minutes || ''}
                              onChange={e => updateStep(step.id, { timer_minutes: parseInt(e.target.value) || undefined })}
                              placeholder="Timer (min)"
                              className="input w-32"
                              min="0"
                            />
                          </div>
                          <input
                            type="text"
                            value={step.tips || ''}
                            onChange={e => updateStep(step.id, { tips: e.target.value })}
                            placeholder="Tips or notes for this step..."
                            className="input flex-1"
                          />
                          <button onClick={() => removeStep(step.id)} className="btn btn-ghost btn-icon btn-sm text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.steps?.length === 0 && (
                    <div className="text-center py-8 text-kitchen-400 dark:text-kitchen-500">
                      <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No steps added yet. Click &quot;Add Step&quot; to begin.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="label">Hero Image</label>
                  <div className="border-2 border-dashed border-kitchen-300 dark:border-kitchen-700 rounded-xl p-8 text-center">
                    {formData.hero_image ? (
                      <div className="relative">
                        <img src={formData.hero_image} alt="Recipe preview" className="max-h-64 mx-auto rounded-lg" />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, hero_image: undefined }))}
                          className="absolute top-2 right-2 btn btn-ghost btn-icon btn-sm bg-white/90"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={48} className="mx-auto text-kitchen-400 mb-4" />
                        <p className="text-kitchen-600 dark:text-cream-400 mb-2">
                          Drag and drop an image, or click to upload
                        </p>
                        <p className="text-sm text-kitchen-400">Or paste an image URL:</p>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          onChange={e => setFormData(prev => ({ ...prev, hero_image: e.target.value }))}
                          className="input mt-2 max-w-md mx-auto"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Source URL</label>
                  <input
                    type="url"
                    value={formData.source_url || ''}
                    onChange={e => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                    placeholder="Original recipe URL (if imported)"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Personal Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any personal notes about this recipe..."
                    rows={4}
                    className="input resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-cream-200 dark:border-kitchen-800 bg-cream-50 dark:bg-kitchen-950">
            <button onClick={closeRecipeModal} className="btn btn-outline">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary">
              {existingRecipe ? 'Save Changes' : 'Create Recipe'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
