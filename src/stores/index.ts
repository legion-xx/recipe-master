import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Recipe, 
  KitchenInventory, 
  KitchenEquipment,
  WeeklyMenu, 
  ShoppingList,
  RecipeFilters,
  SortOption,
  UserPreferences,
  TimerSound
} from '@/types'

// Recipe Store
interface RecipeState {
  recipes: Recipe[]
  isLoading: boolean
  filters: RecipeFilters
  sortBy: SortOption
  setRecipes: (recipes: Recipe[]) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, updates: Partial<Recipe>) => void
  deleteRecipe: (id: string) => void
  setFilters: (filters: Partial<RecipeFilters>) => void
  resetFilters: () => void
  setSortBy: (sort: SortOption) => void
  setLoading: (loading: boolean) => void
}

const defaultFilters: RecipeFilters = {
  search: '',
  cuisine_types: [],
  meal_types: [],
  item_types: [],
  tags: [],
  favorites_only: false,
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  isLoading: true,
  filters: defaultFilters,
  sortBy: 'created_desc',
  setRecipes: (recipes) => set({ recipes }),
  addRecipe: (recipe) => set((state) => ({ 
    recipes: [recipe, ...state.recipes] 
  })),
  updateRecipe: (id, updates) => set((state) => ({
    recipes: state.recipes.map((r) => 
      r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
    ),
  })),
  deleteRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((r) => r.id !== id),
  })),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSortBy: (sortBy) => set({ sortBy }),
  setLoading: (isLoading) => set({ isLoading }),
}))

// Kitchen Store
interface KitchenState {
  inventory: KitchenInventory[]
  equipment: KitchenEquipment[]
  isLoading: boolean
  setInventory: (inventory: KitchenInventory[]) => void
  updateInventoryItem: (id: string, updates: Partial<KitchenInventory>) => void
  addInventoryItem: (item: KitchenInventory) => void
  removeInventoryItem: (id: string) => void
  setEquipment: (equipment: KitchenEquipment[]) => void
  updateEquipment: (id: string, updates: Partial<KitchenEquipment>) => void
  addEquipment: (item: KitchenEquipment) => void
  removeEquipment: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useKitchenStore = create<KitchenState>((set) => ({
  inventory: [],
  equipment: [],
  isLoading: true,
  setInventory: (inventory) => set({ inventory }),
  updateInventoryItem: (id, updates) => set((state) => ({
    inventory: state.inventory.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ),
  })),
  addInventoryItem: (item) => set((state) => ({
    inventory: [...state.inventory, item],
  })),
  removeInventoryItem: (id) => set((state) => ({
    inventory: state.inventory.filter((item) => item.id !== id),
  })),
  setEquipment: (equipment) => set({ equipment }),
  updateEquipment: (id, updates) => set((state) => ({
    equipment: state.equipment.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    ),
  })),
  addEquipment: (item) => set((state) => ({
    equipment: [...state.equipment, item],
  })),
  removeEquipment: (id) => set((state) => ({
    equipment: state.equipment.filter((item) => item.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
}))

// Menu Store
interface MenuState {
  currentMenu: WeeklyMenu | null
  shoppingList: ShoppingList | null
  isLoading: boolean
  setMenu: (menu: WeeklyMenu | null) => void
  updateMenu: (updates: Partial<WeeklyMenu>) => void
  setShoppingList: (list: ShoppingList | null) => void
  setLoading: (loading: boolean) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  currentMenu: null,
  shoppingList: null,
  isLoading: true,
  setMenu: (currentMenu) => set({ currentMenu }),
  updateMenu: (updates) => set((state) => ({
    currentMenu: state.currentMenu ? { ...state.currentMenu, ...updates } : null,
  })),
  setShoppingList: (shoppingList) => set({ shoppingList }),
  setLoading: (isLoading) => set({ isLoading }),
}))

// User Preferences Store (persisted)
interface PreferencesState {
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
}

const defaultPreferences: UserPreferences = {
  timer_sound: 'bell',
  dark_mode: false,
  default_servings: 4,
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      updatePreferences: (updates) => set((state) => ({
        preferences: { ...state.preferences, ...updates },
      })),
    }),
    {
      name: 'recipe-master-preferences',
    }
  )
)

// Timer Store
interface Timer {
  id: string
  recipeId: string
  stepIndex: number
  label: string
  totalSeconds: number
  remainingSeconds: number
  isRunning: boolean
  isPaused: boolean
}

interface TimerState {
  timers: Timer[]
  addTimer: (timer: Omit<Timer, 'isRunning' | 'isPaused'>) => void
  removeTimer: (id: string) => void
  startTimer: (id: string) => void
  pauseTimer: (id: string) => void
  resetTimer: (id: string) => void
  tickTimer: (id: string) => void
}

export const useTimerStore = create<TimerState>((set) => ({
  timers: [],
  addTimer: (timer) => set((state) => ({
    timers: [...state.timers, { ...timer, isRunning: false, isPaused: false }],
  })),
  removeTimer: (id) => set((state) => ({
    timers: state.timers.filter((t) => t.id !== id),
  })),
  startTimer: (id) => set((state) => ({
    timers: state.timers.map((t) =>
      t.id === id ? { ...t, isRunning: true, isPaused: false } : t
    ),
  })),
  pauseTimer: (id) => set((state) => ({
    timers: state.timers.map((t) =>
      t.id === id ? { ...t, isRunning: false, isPaused: true } : t
    ),
  })),
  resetTimer: (id) => set((state) => ({
    timers: state.timers.map((t) =>
      t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false, isPaused: false } : t
    ),
  })),
  tickTimer: (id) => set((state) => ({
    timers: state.timers.map((t) =>
      t.id === id && t.isRunning && t.remainingSeconds > 0
        ? { ...t, remainingSeconds: t.remainingSeconds - 1 }
        : t.id === id && t.remainingSeconds <= 0
        ? { ...t, isRunning: false }
        : t
    ),
  })),
}))

// UI Store for modals, sidebars, etc.
interface UIState {
  isSidebarOpen: boolean
  isRecipeModalOpen: boolean
  activeRecipeId: string | null
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openRecipeModal: (recipeId?: string) => void
  closeRecipeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isRecipeModalOpen: false,
  activeRecipeId: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  openRecipeModal: (recipeId) => set({ 
    isRecipeModalOpen: true, 
    activeRecipeId: recipeId || null 
  }),
  closeRecipeModal: () => set({ 
    isRecipeModalOpen: false, 
    activeRecipeId: null 
  }),
}))
