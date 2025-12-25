# 🍳 Recipe Master

**The Ultimate Family Recipe Hub** - A beautiful, ADHD-friendly recipe management app built with Next.js 14, Supabase, and Claude AI.

![Recipe Master](https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop)

## ✨ Features

### 📚 Recipe Management
- **Easy Recipe Entry** - Intuitive interface for adding recipes with sections, ingredients, and step-by-step instructions
- **Import from URL** - Paste any recipe URL and let Claude AI parse it automatically
- **Multiple Image Support** - Add hero images and step-by-step photos
- **Equipment Tracking** - List required equipment for proper mise en place
- **Ingredient Sections** - Organize ingredients by component (e.g., "For the sauce", "For the marinade")
- **Built-in Timers** - Add timers to any cooking step with customizable sound alerts
- **Recipe Variations** - Save family modifications without changing the original
- **Cook Log** - Record notes, ratings, and photos each time you make a recipe
- **PDF Export** - Print beautifully formatted recipe cards

### 🗓️ Weekly Menu Planning
- **7-Day Calendar View** - Drag and drop recipes to plan breakfast, lunch, and dinner
- **Visual Overview** - See your entire week at a glance
- **Serving Adjustments** - Modify portions for each meal
- **Google Calendar Integration** - Sync meals to your family calendar (coming soon)

### 🛒 Smart Shopping Lists
- **Auto-Generated** - Creates shopping lists from your weekly menu
- **Ingredient Comparison** - Compares needed ingredients with your kitchen inventory
- **Organized by Section** - Groups items by store aisle (Produce, Dairy, etc.)
- **Check-off Progress** - Track your shopping progress in real-time
- **Share & Print** - Export or share lists with family members

### 🏠 Kitchen Inventory ("My Kitchen")
- **Pantry Tracking** - Know what you have on hand
- **Flexible Tracking** - Simple (none/low/medium/plenty) or precise quantities
- **Low Stock Alerts** - See what's running low at a glance
- **Equipment Inventory** - Track kitchen tools you own

### 🤖 AI-Powered Features
- **Recipe Generation** - Create new recipes from scratch with Claude AI
- **Kitchen-Based Recipes** - Generate recipes using ingredients you have
- **Recipe Improvement** - Get AI suggestions to enhance existing recipes
- **Smart Parsing** - Import recipes from any website automatically

### ♿ ADHD-Friendly Design
- **Bold Ingredients** - All ingredients highlighted in recipe instructions
- **Clear Mise en Place** - Equipment and prep steps listed first
- **Step-by-Step Timers** - Built-in timers prevent getting lost
- **Visual Progress** - Clear indicators of where you are in a recipe
- **Minimal Distractions** - Clean, focused interface

### 📱 Additional Features
- **Dark Mode** - Easy on the eyes for late-night cooking
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Favorites** - Quick access to your family's best-loved recipes
- **Tags & Categories** - Organize by cuisine, meal type, diet, and custom tags
- **Advanced Search & Filters** - Find exactly what you're looking for
- **Ratings** - Rate recipes to remember what worked

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works great)
- Anthropic API key (for AI features)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/recipe-master.git
cd recipe-master
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Enable Google OAuth:
   - Go to Authentication → Providers → Google
   - Add your Google OAuth credentials
4. Copy your project URL and anon key from Settings → API

### 4. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

---

## 🌐 Deploy to Vercel

The easiest way to deploy Recipe Master is with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/recipe-master)

1. Click the button above or go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add your environment variables in the Vercel dashboard
4. Deploy!

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Google OAuth) |
| **State Management** | Zustand |
| **Animations** | Framer Motion |
| **AI** | Claude API (Anthropic) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
recipe-master/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth callback
│   │   ├── favorites/         # Favorites page
│   │   ├── generate/          # AI recipe generator
│   │   ├── kitchen/           # Kitchen inventory
│   │   ├── login/             # Login page
│   │   ├── menu/              # Weekly menu planner
│   │   ├── recipes/           # Recipe listing
│   │   ├── settings/          # User settings
│   │   ├── shopping/          # Shopping lists
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard
│   │
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   └── recipes/          # Recipe components
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & configs
│   │   ├── supabase/         # Supabase clients
│   │   └── utils.ts          # Helper functions
│   │
│   ├── stores/               # Zustand state stores
│   └── types/                # TypeScript types
│
├── public/                    # Static assets
├── supabase-schema.sql       # Database schema
└── ...config files
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette:
- `primary` - Main accent color (orange)
- `sage` - Secondary color (green)
- `cream` - Background tones
- `kitchen` - Neutral tones

### Timer Sounds
Add custom timer sounds by:
1. Adding audio files to `public/sounds/`
2. Updating the `TimerSound` type in `src/types/index.ts`
3. Adding the new option in Settings

---

## 🔮 Roadmap

- [ ] Google Calendar integration for meal planning
- [ ] Nutritional information tracking
- [ ] Cost estimation per recipe
- [ ] Meal prep mode with scaled instructions
- [ ] Voice control for hands-free cooking
- [ ] Family member meal preferences
- [ ] Recipe sharing via public links
- [ ] Grocery store integration
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💖 Acknowledgments

- Built with love for families who cook together
- Designed with ADHD accessibility in mind
- Powered by Claude AI from Anthropic
- Beautiful icons from [Lucide](https://lucide.dev)

---

<p align="center">
  Made with ❤️ for families who love to cook
</p>
