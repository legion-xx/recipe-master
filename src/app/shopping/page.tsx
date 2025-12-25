'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Check, 
  Printer, 
  Share2, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { DashboardLayout } from '@/components'
import { useRecipeStore, useKitchenStore } from '@/stores'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, IngredientCategory } from '@/types'

interface ShoppingItemDisplay {
  id: string
  name: string
  quantity: number
  unit: string
  category: IngredientCategory
  isChecked: boolean
  fromRecipes: string[]
}

// Mock shopping list data - in real app, this would be computed from menu
const mockShoppingList: ShoppingItemDisplay[] = [
  { id: '1', name: 'Chicken breast', quantity: 4, unit: 'lb', category: 'poultry', isChecked: false, fromRecipes: ['Chicken Tikka Masala'] },
  { id: '2', name: 'Spaghetti', quantity: 2, unit: 'package(s)', category: 'pasta', isChecked: false, fromRecipes: ['Classic Spaghetti Carbonara'] },
  { id: '3', name: 'Heavy cream', quantity: 2, unit: 'cup(s)', category: 'dairy', isChecked: false, fromRecipes: ['Classic Spaghetti Carbonara', 'Chicken Tikka Masala'] },
  { id: '4', name: 'Parmesan cheese', quantity: 1, unit: 'cup(s)', category: 'dairy', isChecked: true, fromRecipes: ['Classic Spaghetti Carbonara'] },
  { id: '5', name: 'Eggs', quantity: 6, unit: 'piece(s)', category: 'eggs', isChecked: false, fromRecipes: ['Classic Spaghetti Carbonara', 'Avocado Toast'] },
  { id: '6', name: 'Avocados', quantity: 4, unit: 'piece(s)', category: 'produce', isChecked: false, fromRecipes: ['Avocado Toast'] },
  { id: '7', name: 'Sourdough bread', quantity: 1, unit: 'loaf', category: 'bread', isChecked: false, fromRecipes: ['Avocado Toast'] },
  { id: '8', name: 'Garlic', quantity: 2, unit: 'head', category: 'produce', isChecked: true, fromRecipes: ['Classic Spaghetti Carbonara', 'Chicken Tikka Masala'] },
  { id: '9', name: 'Garam masala', quantity: 2, unit: 'tbsp', category: 'spices', isChecked: false, fromRecipes: ['Chicken Tikka Masala'] },
  { id: '10', name: 'Tomato paste', quantity: 1, unit: 'can(s)', category: 'canned_goods', isChecked: false, fromRecipes: ['Chicken Tikka Masala'] },
  { id: '11', name: 'Pancetta', quantity: 8, unit: 'oz', category: 'meat', isChecked: false, fromRecipes: ['Classic Spaghetti Carbonara'] },
  { id: '12', name: 'Black pepper', quantity: 1, unit: 'tbsp', category: 'spices', isChecked: true, fromRecipes: ['Classic Spaghetti Carbonara'] },
]

export default function ShoppingPage() {
  const [items, setItems] = useState(mockShoppingList)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(CATEGORY_LABELS)))

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItemDisplay[]> = {}
    items.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [items])

  const checkedCount = items.filter(i => i.isChecked).length
  const totalCount = items.length
  const progress = (checkedCount / totalCount) * 100

  const clearChecked = () => {
    setItems(prev => prev.filter(item => !item.isChecked))
  }

  const uncheckAll = () => {
    setItems(prev => prev.map(item => ({ ...item, isChecked: false })))
  }

  return (
    <DashboardLayout title="Shopping List" subtitle="Items needed for your weekly menu">
      {/* Progress Bar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
              Shopping Progress
            </h3>
            <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
              {checkedCount} of {totalCount} items checked
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={uncheckAll} className="btn btn-sm btn-outline">
              <RefreshCw size={14} />
              Reset
            </button>
            <button onClick={clearChecked} className="btn btn-sm btn-outline">
              Clear Checked
            </button>
            <button className="btn btn-sm btn-outline">
              <Printer size={14} />
              Print
            </button>
            <button className="btn btn-sm btn-primary">
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
        <div className="h-3 bg-cream-200 dark:bg-kitchen-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full"
          />
        </div>
      </div>

      {/* Shopping List by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const isExpanded = expandedCategories.has(category)
          const checkedInCategory = categoryItems.filter(i => i.isChecked).length
          
          return (
            <div key={category} className="card overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-cream-50 dark:hover:bg-kitchen-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {category === 'produce' && '🥬'}
                    {category === 'meat' && '🥩'}
                    {category === 'poultry' && '🍗'}
                    {category === 'dairy' && '🧀'}
                    {category === 'eggs' && '🥚'}
                    {category === 'pasta' && '🍝'}
                    {category === 'bread' && '🍞'}
                    {category === 'spices' && '🌶️'}
                    {category === 'canned_goods' && '🥫'}
                    {!['produce', 'meat', 'poultry', 'dairy', 'eggs', 'pasta', 'bread', 'spices', 'canned_goods'].includes(category) && '🛒'}
                  </span>
                  <div className="text-left">
                    <h4 className="font-medium text-kitchen-800 dark:text-cream-100">
                      {CATEGORY_LABELS[category as IngredientCategory] || category}
                    </h4>
                    <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                      {checkedInCategory}/{categoryItems.length} items
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="border-t border-cream-200 dark:border-kitchen-800"
                >
                  {categoryItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex items-center gap-4 p-4 border-b border-cream-100 dark:border-kitchen-800 last:border-b-0',
                        item.isChecked && 'bg-sage-50 dark:bg-sage-900/20'
                      )}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                          item.isChecked 
                            ? 'bg-sage-500 border-sage-500 text-white' 
                            : 'border-kitchen-300 dark:border-kitchen-600 hover:border-sage-500'
                        )}
                      >
                        {item.isChecked && <Check size={14} />}
                      </button>
                      <div className="flex-1">
                        <p className={cn(
                          'font-medium',
                          item.isChecked 
                            ? 'line-through text-kitchen-400 dark:text-kitchen-500' 
                            : 'text-kitchen-800 dark:text-cream-100'
                        )}>
                          <span className="font-bold text-primary-600 dark:text-primary-400">
                            {item.quantity} {item.unit}
                          </span>{' '}
                          {item.name}
                        </p>
                        <p className="text-xs text-kitchen-500 dark:text-kitchen-400">
                          For: {item.fromRecipes.join(', ')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 dark:bg-kitchen-800 flex items-center justify-center">
            <ShoppingCart size={32} className="text-kitchen-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-kitchen-800 dark:text-cream-100 mb-2">
            No items in your shopping list
          </h3>
          <p className="text-kitchen-500 dark:text-kitchen-400">
            Add recipes to your weekly menu to generate a shopping list
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}
