import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RecipeIngredient, IngredientUnit, UNIT_LABELS } from '@/types'

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time for display
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours} hr`
  }
  return `${hours} hr ${mins} min`
}

// Format ingredient quantity
export function formatQuantity(quantity: number): string {
  // Handle common fractions
  const fractions: Record<number, string> = {
    0.125: '⅛',
    0.25: '¼',
    0.333: '⅓',
    0.375: '⅜',
    0.5: '½',
    0.625: '⅝',
    0.666: '⅔',
    0.75: '¾',
    0.875: '⅞',
  }

  const wholeNumber = Math.floor(quantity)
  const decimal = quantity - wholeNumber

  // Check for fraction match
  for (const [dec, frac] of Object.entries(fractions)) {
    if (Math.abs(decimal - parseFloat(dec)) < 0.01) {
      if (wholeNumber === 0) {
        return frac
      }
      return `${wholeNumber} ${frac}`
    }
  }

  // Return as decimal if no fraction match
  if (decimal === 0) {
    return wholeNumber.toString()
  }
  return quantity.toFixed(2).replace(/\.?0+$/, '')
}

// Format ingredient for display
export function formatIngredient(ingredient: RecipeIngredient, scaleFactor: number = 1): string {
  const scaledQuantity = ingredient.quantity * scaleFactor
  const formattedQty = formatQuantity(scaledQuantity)
  const unit = ingredient.unit === 'to_taste' ? '' : UNIT_LABELS[ingredient.unit]
  const prep = ingredient.preparation ? `, ${ingredient.preparation}` : ''
  const optional = ingredient.is_optional ? ' (optional)' : ''
  
  if (ingredient.unit === 'to_taste') {
    return `${ingredient.name}, to taste${optional}`
  }
  
  return `${formattedQty} ${unit} ${ingredient.name}${prep}${optional}`
}

// Scale ingredients based on serving size
export function scaleIngredients(
  ingredients: RecipeIngredient[],
  originalServings: number,
  newServings: number
): RecipeIngredient[] {
  const scaleFactor = newServings / originalServings
  return ingredients.map(ing => ({
    ...ing,
    quantity: ing.quantity * scaleFactor,
  }))
}

// Generate unique ID
export function generateId(): string {
  return crypto.randomUUID()
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Parse recipe URL with Claude AI
export async function parseRecipeFromUrl(url: string): Promise<Partial<Recipe> | null> {
  try {
    const response = await fetch('/api/parse-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) throw new Error('Failed to parse recipe')
    return response.json()
  } catch (error) {
    console.error('Error parsing recipe:', error)
    return null
  }
}

// Highlight ingredients in text
export function highlightIngredients(
  text: string,
  ingredientNames: string[]
): string {
  let result = text
  const sortedIngredients = [...ingredientNames].sort((a, b) => b.length - a.length)
  
  for (const name of sortedIngredients) {
    const regex = new RegExp(`\\b(${escapeRegex(name)})\\b`, 'gi')
    result = result.replace(regex, '<strong class="text-primary-600 dark:text-primary-400 font-semibold">$1</strong>')
  }
  
  return result
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Date utilities
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  return days
}

export function formatDate(date: Date, format: 'short' | 'long' | 'weekday' = 'short'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
    case 'weekday':
      return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
}

// Local storage helpers with SSR safety
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Import Recipe type for parseRecipeFromUrl return type
import type { Recipe } from '@/types'
