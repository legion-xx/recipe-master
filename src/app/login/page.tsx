'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      toast.error('Failed to sign in. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-primary-50 dark:from-kitchen-950 dark:via-kitchen-900 dark:to-sage-950 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sage-300/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/30 mb-4"
            >
              <ChefHat className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-kitchen-800 dark:text-cream-100">
              Recipe Master
            </h1>
            <p className="text-kitchen-500 dark:text-kitchen-400 mt-2">
              Your family&apos;s recipe hub
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-3 mb-8">
            {[
              'Store and organize family recipes',
              'Plan weekly menus with drag & drop',
              'Auto-generate shopping lists',
              'AI-powered recipe suggestions',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-kitchen-600 dark:text-cream-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {feature}
              </motion.div>
            ))}
          </div>

          {/* Sign in button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full btn btn-lg bg-white dark:bg-kitchen-800 border-2 border-kitchen-200 dark:border-kitchen-700 hover:bg-cream-50 dark:hover:bg-kitchen-700 text-kitchen-800 dark:text-cream-100 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-kitchen-300 border-t-kitchen-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>

          <p className="text-xs text-center text-kitchen-400 dark:text-kitchen-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-kitchen-500 dark:text-kitchen-400 mt-6">
          Made with ❤️ for families who love to cook
        </p>
      </motion.div>
    </div>
  )
}
