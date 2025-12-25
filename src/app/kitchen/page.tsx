'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Warehouse,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Package,
  AlertTriangle
} from 'lucide-react'
import { DashboardLayout } from '@/components'
import { cn, generateId } from '@/lib/utils'
import { CATEGORY_LABELS, IngredientCategory } from '@/types'

interface KitchenItem {
  id: string
  name: string
  category: IngredientCategory
  trackingType: 'simple' | 'precise'
  simpleStatus?: 'none' | 'low' | 'medium' | 'plenty'
  preciseQuantity?: number
  preciseUnit?: string
}

// Mock kitchen inventory
const mockInventory: KitchenItem[] = [
  { id: '1', name: 'All-purpose flour', category: 'baking', trackingType: 'simple', simpleStatus: 'plenty' },
  { id: '2', name: 'Sugar', category: 'baking', trackingType: 'simple', simpleStatus: 'medium' },
  { id: '3', name: 'Salt', category: 'spices', trackingType: 'simple', simpleStatus: 'plenty' },
  { id: '4', name: 'Black pepper', category: 'spices', trackingType: 'simple', simpleStatus: 'low' },
  { id: '5', name: 'Olive oil', category: 'oils', trackingType: 'simple', simpleStatus: 'medium' },
  { id: '6', name: 'Chicken breasts', category: 'poultry', trackingType: 'precise', preciseQuantity: 4, preciseUnit: 'pieces' },
  { id: '7', name: 'Eggs', category: 'eggs', trackingType: 'precise', preciseQuantity: 12, preciseUnit: 'pieces' },
  { id: '8', name: 'Milk', category: 'dairy', trackingType: 'precise', preciseQuantity: 1, preciseUnit: 'gallon' },
  { id: '9', name: 'Butter', category: 'dairy', trackingType: 'simple', simpleStatus: 'plenty' },
  { id: '10', name: 'Garlic', category: 'produce', trackingType: 'precise', preciseQuantity: 3, preciseUnit: 'heads' },
  { id: '11', name: 'Onions', category: 'produce', trackingType: 'precise', preciseQuantity: 5, preciseUnit: 'pieces' },
  { id: '12', name: 'Pasta', category: 'pasta', trackingType: 'simple', simpleStatus: 'medium' },
  { id: '13', name: 'Rice', category: 'grains', trackingType: 'simple', simpleStatus: 'plenty' },
  { id: '14', name: 'Canned tomatoes', category: 'canned_goods', trackingType: 'precise', preciseQuantity: 3, preciseUnit: 'cans' },
  { id: '15', name: 'Chicken broth', category: 'canned_goods', trackingType: 'precise', preciseQuantity: 2, preciseUnit: 'cartons' },
]

const statusColors = {
  none: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  plenty: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const statusLabels = {
  none: 'Out of Stock',
  low: 'Running Low',
  medium: 'In Stock',
  plenty: 'Well Stocked',
}

export default function KitchenPage() {
  const [items, setItems] = useState(mockInventory)
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(CATEGORY_LABELS)))
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<KitchenItem | null>(null)

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

  const filteredItems = useMemo(() => {
    if (!search) return items
    const searchLower = search.toLowerCase()
    return items.filter(item => item.name.toLowerCase().includes(searchLower))
  }, [items, search])

  const groupedItems = useMemo(() => {
    const groups: Record<string, KitchenItem[]> = {}
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  const lowStockCount = items.filter(i => 
    i.trackingType === 'simple' && (i.simpleStatus === 'low' || i.simpleStatus === 'none')
  ).length

  const updateItem = (id: string, updates: Partial<KitchenItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <DashboardLayout title="My Kitchen" subtitle="Track your pantry and ingredients">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400">
              <Package size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-kitchen-800 dark:text-cream-100">{items.length}</p>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Total Items</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-kitchen-800 dark:text-cream-100">{lowStockCount}</p>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Warehouse size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-kitchen-800 dark:text-cream-100">
                {Object.keys(groupedItems).length}
              </p>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Categories</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="card p-4 hover:shadow-lg transition-shadow text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <p className="font-medium text-kitchen-800 dark:text-cream-100">Add Item</p>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">Track new ingredient</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-kitchen-400" />
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Inventory by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const isExpanded = expandedCategories.has(category)
          
          return (
            <div key={category} className="card overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-cream-50 dark:hover:bg-kitchen-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-kitchen-800 dark:text-cream-100">
                    {CATEGORY_LABELS[category as IngredientCategory] || category}
                  </h4>
                  <span className="text-sm text-kitchen-500 dark:text-kitchen-400">
                    ({categoryItems.length} items)
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-cream-200 dark:border-kitchen-800"
                  >
                    <div className="divide-y divide-cream-100 dark:divide-kitchen-800">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 hover:bg-cream-50 dark:hover:bg-kitchen-800/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-kitchen-800 dark:text-cream-100">
                              {item.name}
                            </p>
                            {item.trackingType === 'precise' && (
                              <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                                {item.preciseQuantity} {item.preciseUnit}
                              </p>
                            )}
                          </div>

                          {item.trackingType === 'simple' ? (
                            <div className="flex items-center gap-2">
                              {(['none', 'low', 'medium', 'plenty'] as const).map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateItem(item.id, { simpleStatus: status })}
                                  className={cn(
                                    'px-3 py-1 rounded-full text-xs font-medium transition-all',
                                    item.simpleStatus === status
                                      ? statusColors[status]
                                      : 'bg-cream-100 dark:bg-kitchen-800 text-kitchen-400 hover:bg-cream-200 dark:hover:bg-kitchen-700'
                                  )}
                                >
                                  {status === 'none' ? 'Out' : status === 'low' ? 'Low' : status === 'medium' ? 'Ok' : 'Full'}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateItem(item.id, { preciseQuantity: Math.max(0, (item.preciseQuantity || 0) - 1) })}
                                className="w-8 h-8 rounded-lg bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-kitchen-700"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.preciseQuantity || 0}
                                onChange={e => updateItem(item.id, { preciseQuantity: parseInt(e.target.value) || 0 })}
                                className="w-16 text-center input"
                              />
                              <button
                                onClick={() => updateItem(item.id, { preciseQuantity: (item.preciseQuantity || 0) + 1 })}
                                className="w-8 h-8 rounded-lg bg-cream-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-kitchen-700"
                              >
                                +
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-kitchen-800 text-kitchen-500 hover:text-kitchen-700"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-kitchen-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 dark:bg-kitchen-800 flex items-center justify-center">
            <Warehouse size={32} className="text-kitchen-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-kitchen-800 dark:text-cream-100 mb-2">
            {search ? 'No items found' : 'Your kitchen is empty'}
          </h3>
          <p className="text-kitchen-500 dark:text-kitchen-400 mb-4">
            {search ? 'Try a different search term' : 'Start adding ingredients to track your pantry'}
          </p>
          {!search && (
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <Plus size={18} />
              Add First Item
            </button>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
