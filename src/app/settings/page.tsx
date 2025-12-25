'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Volume2, 
  Moon, 
  Palette,
  Save,
  Check
} from 'lucide-react'
import { DashboardLayout } from '@/components'
import { usePreferencesStore } from '@/stores'
import { cn } from '@/lib/utils'
import { TimerSound } from '@/types'
import toast from 'react-hot-toast'

const timerSounds: { value: TimerSound; label: string; description: string }[] = [
  { value: 'bell', label: 'Bell', description: 'Classic kitchen bell sound' },
  { value: 'chime', label: 'Chime', description: 'Gentle wind chime melody' },
  { value: 'ding', label: 'Ding', description: 'Simple ding notification' },
  { value: 'alarm', label: 'Alarm', description: 'Urgent alarm sound' },
  { value: 'gentle', label: 'Gentle', description: 'Soft, calming tone' },
]

export default function SettingsPage() {
  const { preferences, updatePreferences } = usePreferencesStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success('Settings saved!')
  }

  const playTestSound = (sound: TimerSound) => {
    // In production, this would play the actual sound
    toast.success(`Playing ${sound} sound...`)
  }

  return (
    <DashboardLayout title="Settings" subtitle="Customize your experience">
      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
                Appearance
              </h3>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                Customize how Recipe Master looks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-kitchen-500" />
                <div>
                  <p className="font-medium text-kitchen-800 dark:text-cream-100">Dark Mode</p>
                  <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                    Use dark theme for better visibility at night
                  </p>
                </div>
              </div>
              <button
                onClick={() => updatePreferences({ dark_mode: !preferences.dark_mode })}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors',
                  preferences.dark_mode ? 'bg-primary-500' : 'bg-kitchen-300'
                )}
              >
                <motion.div
                  animate={{ x: preferences.dark_mode ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Timer Sounds */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400">
              <Volume2 size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
                Timer Sound
              </h3>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                Choose the sound for cooking timers
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {timerSounds.map(sound => (
              <button
                key={sound.value}
                onClick={() => updatePreferences({ timer_sound: sound.value })}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-xl transition-colors',
                  preferences.timer_sound === sound.value
                    ? 'bg-sage-50 dark:bg-sage-900/20 ring-2 ring-sage-500'
                    : 'hover:bg-cream-50 dark:hover:bg-kitchen-800'
                )}
              >
                <div className="text-left">
                  <p className="font-medium text-kitchen-800 dark:text-cream-100">
                    {sound.label}
                  </p>
                  <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                    {sound.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playTestSound(sound.value)
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    Test
                  </button>
                  {preferences.timer_sound === sound.value && (
                    <Check size={20} className="text-sage-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Default Servings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-kitchen-100 dark:bg-kitchen-800 text-kitchen-600 dark:text-kitchen-400">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
                Default Servings
              </h3>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                Set your typical family size for recipes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={12}
              value={preferences.default_servings}
              onChange={e => updatePreferences({ default_servings: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="w-12 text-center font-medium text-kitchen-800 dark:text-cream-100">
              {preferences.default_servings}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-kitchen-800 dark:text-cream-100">
                Notifications
              </h3>
              <p className="text-sm text-kitchen-500 dark:text-kitchen-400">
                Manage notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-kitchen-700 dark:text-cream-300">Timer alerts</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-kitchen-700 dark:text-cream-300">Weekly menu reminders</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-kitchen-700 dark:text-cream-300">Shopping list updates</span>
              <input type="checkbox" className="rounded" />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-lg btn-primary w-full"
        >
          {isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save size={20} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </DashboardLayout>
  )
}
