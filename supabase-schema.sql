-- Recipe Master Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{"timer_sound": "bell", "dark_mode": false, "default_servings": 4}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- RECIPES TABLE
-- ============================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  hero_image TEXT,
  
  -- Categorization
  cuisine_type TEXT DEFAULT 'american',
  meal_type TEXT[] DEFAULT ARRAY['dinner'],
  item_type TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Time & Servings
  prep_time_minutes INTEGER DEFAULT 15,
  cook_time_minutes INTEGER DEFAULT 30,
  total_time_minutes INTEGER GENERATED ALWAYS AS (prep_time_minutes + cook_time_minutes) STORED,
  servings INTEGER DEFAULT 4,
  
  -- Content (stored as JSONB for flexibility)
  equipment JSONB DEFAULT '[]'::jsonb,
  ingredient_sections JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  
  -- Meta
  source_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  rating DECIMAL(2,1),
  notes TEXT,
  
  -- Variations and Cook Logs (stored as JSONB)
  variations JSONB DEFAULT '[]'::jsonb,
  cook_logs JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Recipes policies - all family members can see and edit
CREATE POLICY "Users can view all recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Users can insert recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update any recipe" ON recipes FOR UPDATE USING (true);
CREATE POLICY "Users can delete any recipe" ON recipes FOR DELETE USING (true);

-- Index for faster searches
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_cuisine_type ON recipes(cuisine_type);
CREATE INDEX idx_recipes_meal_type ON recipes USING GIN(meal_type);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_is_favorite ON recipes(is_favorite);

-- ============================================
-- MASTER INGREDIENTS TABLE
-- ============================================
CREATE TABLE master_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  default_unit TEXT DEFAULT 'piece',
  aliases TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE master_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view ingredients" ON master_ingredients FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ingredients" ON master_ingredients FOR INSERT WITH CHECK (true);

-- ============================================
-- KITCHEN INVENTORY TABLE
-- ============================================
CREATE TABLE kitchen_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES master_ingredients(id),
  ingredient_name TEXT NOT NULL, -- Denormalized for easier queries
  category TEXT NOT NULL,
  
  tracking_type TEXT DEFAULT 'simple' CHECK (tracking_type IN ('simple', 'precise')),
  simple_status TEXT CHECK (simple_status IN ('none', 'low', 'medium', 'plenty')),
  precise_quantity DECIMAL(10,2),
  precise_unit TEXT,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE kitchen_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view inventory" ON kitchen_inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can manage inventory" ON kitchen_inventory FOR ALL USING (true);

-- ============================================
-- KITCHEN EQUIPMENT TABLE
-- ============================================
CREATE TABLE kitchen_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  owned BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE kitchen_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipment" ON kitchen_equipment FOR SELECT USING (true);
CREATE POLICY "Anyone can manage equipment" ON kitchen_equipment FOR ALL USING (true);

-- ============================================
-- WEEKLY MENUS TABLE
-- ============================================
CREATE TABLE weekly_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start DATE NOT NULL,
  menu_data JSONB DEFAULT '{}'::jsonb, -- Stores the full week's menu
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(week_start)
);

-- Enable RLS
ALTER TABLE weekly_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view menus" ON weekly_menus FOR SELECT USING (true);
CREATE POLICY "Anyone can manage menus" ON weekly_menus FOR ALL USING (true);

-- ============================================
-- SHOPPING LISTS TABLE
-- ============================================
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start DATE NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(week_start)
);

-- Enable RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shopping lists" ON shopping_lists FOR SELECT USING (true);
CREATE POLICY "Anyone can manage shopping lists" ON shopping_lists FOR ALL USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_weekly_menus_updated_at
  BEFORE UPDATE ON weekly_menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA: Common Ingredients
-- ============================================
INSERT INTO master_ingredients (name, category, default_unit, aliases) VALUES
-- Produce
('Onion', 'produce', 'piece', ARRAY['onions', 'yellow onion']),
('Garlic', 'produce', 'clove', ARRAY['garlic cloves']),
('Tomato', 'produce', 'piece', ARRAY['tomatoes']),
('Potato', 'produce', 'piece', ARRAY['potatoes']),
('Carrot', 'produce', 'piece', ARRAY['carrots']),
('Celery', 'produce', 'piece', ARRAY['celery stalks']),
('Bell Pepper', 'produce', 'piece', ARRAY['bell peppers', 'capsicum']),
('Lemon', 'produce', 'piece', ARRAY['lemons']),
('Lime', 'produce', 'piece', ARRAY['limes']),
('Avocado', 'produce', 'piece', ARRAY['avocados']),

-- Dairy
('Milk', 'dairy', 'cup', ARRAY['whole milk']),
('Butter', 'dairy', 'tablespoon', ARRAY['unsalted butter']),
('Heavy Cream', 'dairy', 'cup', ARRAY['whipping cream']),
('Parmesan Cheese', 'dairy', 'cup', ARRAY['parmigiano']),
('Cheddar Cheese', 'dairy', 'cup', ARRAY['cheddar']),

-- Eggs
('Eggs', 'eggs', 'piece', ARRAY['egg', 'large eggs']),

-- Meat & Poultry
('Chicken Breast', 'poultry', 'piece', ARRAY['chicken breasts']),
('Chicken Thighs', 'poultry', 'piece', ARRAY['chicken thigh']),
('Ground Beef', 'meat', 'pound', ARRAY['beef mince']),
('Bacon', 'meat', 'slice', ARRAY['bacon strips']),
('Pancetta', 'meat', 'ounce', ARRAY[]),

-- Pantry
('All-Purpose Flour', 'baking', 'cup', ARRAY['flour', 'plain flour']),
('Sugar', 'baking', 'cup', ARRAY['granulated sugar']),
('Brown Sugar', 'baking', 'cup', ARRAY['light brown sugar']),
('Salt', 'spices', 'teaspoon', ARRAY['table salt', 'sea salt']),
('Black Pepper', 'spices', 'teaspoon', ARRAY['pepper', 'ground pepper']),
('Olive Oil', 'oils', 'tablespoon', ARRAY['extra virgin olive oil']),
('Vegetable Oil', 'oils', 'tablespoon', ARRAY['cooking oil']),

-- Pasta & Grains
('Spaghetti', 'pasta', 'pound', ARRAY['spaghetti pasta']),
('Rice', 'grains', 'cup', ARRAY['white rice', 'long grain rice']),

-- Canned Goods
('Canned Tomatoes', 'canned_goods', 'can', ARRAY['diced tomatoes', 'crushed tomatoes']),
('Chicken Broth', 'canned_goods', 'cup', ARRAY['chicken stock'])
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Recipe Master database schema created successfully!' as message;
