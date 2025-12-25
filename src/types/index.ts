// Core Recipe Types
export interface Recipe {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Basic Info
  title: string;
  description: string;
  hero_image?: string;
  
  // Categorization
  cuisine_type: CuisineType;
  meal_type: MealType[];
  item_type?: ItemType;
  tags: string[];
  
  // Time & Servings
  prep_time_minutes: number;
  cook_time_minutes: number;
  total_time_minutes: number;
  servings: number;
  
  // Content
  equipment: Equipment[];
  ingredient_sections: IngredientSection[];
  steps: RecipeStep[];
  
  // Meta
  source_url?: string;
  is_favorite: boolean;
  rating?: number;
  notes?: string;
  
  // Variations
  variations: RecipeVariation[];
  
  // Cook Log
  cook_logs: CookLog[];
}

export interface IngredientSection {
  id: string;
  title: string; // e.g., "For the sauce", "For the marinade"
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: string;
  ingredient_id: string; // Reference to master ingredient
  name: string; // Display name
  quantity: number;
  unit: IngredientUnit;
  preparation?: string; // e.g., "diced", "minced"
  is_optional: boolean;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  is_optional: boolean;
  notes?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  instruction: string;
  image_url?: string;
  timer_minutes?: number;
  tips?: string;
}

export interface RecipeVariation {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_name?: string;
}

export interface CookLog {
  id: string;
  created_at: string;
  notes: string;
  rating?: number;
  images: string[];
  user_name?: string;
}

// Ingredient & Kitchen Types
export interface MasterIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  default_unit: IngredientUnit;
  aliases: string[]; // Alternative names for matching
}

export interface KitchenInventory {
  id: string;
  ingredient_id: string;
  ingredient: MasterIngredient;
  tracking_type: 'simple' | 'precise';
  simple_status?: 'none' | 'low' | 'medium' | 'plenty';
  precise_quantity?: number;
  precise_unit?: IngredientUnit;
  updated_at: string;
}

export interface KitchenEquipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  owned: boolean;
  notes?: string;
}

// Weekly Menu Types
export interface WeeklyMenu {
  id: string;
  week_start: string; // ISO date string
  days: MenuDay[];
}

export interface MenuDay {
  date: string;
  breakfast?: MenuSlot;
  lunch?: MenuSlot;
  dinner?: MenuSlot;
  snacks: MenuSlot[];
}

export interface MenuSlot {
  recipe_id: string;
  recipe?: Recipe;
  servings: number;
  notes?: string;
}

// Shopping List Types
export interface ShoppingList {
  id: string;
  week_start: string;
  items: ShoppingItem[];
  generated_at: string;
}

export interface ShoppingItem {
  id: string;
  ingredient_id: string;
  name: string;
  category: IngredientCategory;
  needed_quantity: number;
  unit: IngredientUnit;
  on_hand_quantity: number;
  to_buy_quantity: number;
  is_checked: boolean;
  from_recipes: string[]; // Recipe IDs
}

// Enums and Constants
export type CuisineType = 
  | 'american'
  | 'mexican'
  | 'italian'
  | 'brazilian'
  | 'chinese'
  | 'japanese'
  | 'vietnamese'
  | 'thai'
  | 'indian'
  | 'greek'
  | 'german'
  | 'british'
  | 'french'
  | 'swiss'
  | 'korean'
  | 'mediterranean'
  | 'middle_eastern'
  | 'caribbean'
  | 'african'
  | 'other';

export type MealType = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'side'
  | 'appetizer'
  | 'beverage';

export type ItemType =
  | 'soup'
  | 'salad'
  | 'sandwich'
  | 'pasta'
  | 'rice_dish'
  | 'stir_fry'
  | 'roast'
  | 'grill'
  | 'baked'
  | 'fried'
  | 'stew'
  | 'casserole'
  | 'sauce'
  | 'marinade'
  | 'dressing'
  | 'bread'
  | 'pastry'
  | 'cake'
  | 'cookie'
  | 'pie'
  | 'smoothie'
  | 'cocktail'
  | 'other';

export type IngredientUnit =
  | 'piece'
  | 'cup'
  | 'tablespoon'
  | 'teaspoon'
  | 'ounce'
  | 'pound'
  | 'gram'
  | 'kilogram'
  | 'milliliter'
  | 'liter'
  | 'pinch'
  | 'dash'
  | 'to_taste'
  | 'clove'
  | 'slice'
  | 'bunch'
  | 'sprig'
  | 'can'
  | 'package'
  | 'bottle'
  | 'jar';

export type IngredientCategory =
  | 'produce'
  | 'meat'
  | 'poultry'
  | 'seafood'
  | 'dairy'
  | 'eggs'
  | 'grains'
  | 'pasta'
  | 'bread'
  | 'canned_goods'
  | 'condiments'
  | 'spices'
  | 'oils'
  | 'baking'
  | 'frozen'
  | 'beverages'
  | 'snacks'
  | 'other';

export type EquipmentCategory =
  | 'cookware'
  | 'bakeware'
  | 'appliances'
  | 'utensils'
  | 'knives'
  | 'measuring'
  | 'storage'
  | 'other';

// Display Helpers
export const CUISINE_LABELS: Record<CuisineType, string> = {
  american: 'American',
  mexican: 'Mexican',
  italian: 'Italian',
  brazilian: 'Brazilian',
  chinese: 'Chinese',
  japanese: 'Japanese',
  vietnamese: 'Vietnamese',
  thai: 'Thai',
  indian: 'Indian',
  greek: 'Greek',
  german: 'German',
  british: 'British',
  french: 'French',
  swiss: 'Swiss',
  korean: 'Korean',
  mediterranean: 'Mediterranean',
  middle_eastern: 'Middle Eastern',
  caribbean: 'Caribbean',
  african: 'African',
  other: 'Other',
};

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  dessert: 'Dessert',
  snack: 'Snack',
  side: 'Side Dish',
  appetizer: 'Appetizer',
  beverage: 'Beverage',
};

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: 'Produce',
  meat: 'Meat',
  poultry: 'Poultry',
  seafood: 'Seafood',
  dairy: 'Dairy',
  eggs: 'Eggs',
  grains: 'Grains & Rice',
  pasta: 'Pasta',
  bread: 'Bread & Bakery',
  canned_goods: 'Canned Goods',
  condiments: 'Condiments & Sauces',
  spices: 'Spices & Herbs',
  oils: 'Oils & Vinegars',
  baking: 'Baking',
  frozen: 'Frozen',
  beverages: 'Beverages',
  snacks: 'Snacks',
  other: 'Other',
};

export const UNIT_LABELS: Record<IngredientUnit, string> = {
  piece: 'piece(s)',
  cup: 'cup(s)',
  tablespoon: 'tbsp',
  teaspoon: 'tsp',
  ounce: 'oz',
  pound: 'lb',
  gram: 'g',
  kilogram: 'kg',
  milliliter: 'ml',
  liter: 'L',
  pinch: 'pinch',
  dash: 'dash',
  to_taste: 'to taste',
  clove: 'clove(s)',
  slice: 'slice(s)',
  bunch: 'bunch',
  sprig: 'sprig(s)',
  can: 'can(s)',
  package: 'package(s)',
  bottle: 'bottle(s)',
  jar: 'jar(s)',
};

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  timer_sound: TimerSound;
  dark_mode: boolean;
  default_servings: number;
}

export type TimerSound = 'bell' | 'chime' | 'ding' | 'alarm' | 'gentle';

// Filter Types
export interface RecipeFilters {
  search: string;
  cuisine_types: CuisineType[];
  meal_types: MealType[];
  item_types: ItemType[];
  tags: string[];
  max_time_minutes?: number;
  favorites_only: boolean;
  min_rating?: number;
  has_equipment?: string[]; // Filter by equipment you own
}

export type SortOption = 
  | 'title_asc'
  | 'title_desc'
  | 'created_desc'
  | 'created_asc'
  | 'rating_desc'
  | 'time_asc'
  | 'time_desc';
