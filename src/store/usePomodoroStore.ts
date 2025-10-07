import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PomodoroSession, Settings, TimerState } from '../types'
import { Preferences } from '@capacitor/preferences'
import { storageService } from '../services/storage'
import { notificationService } from '../services/notifications'
import { hapticsService } from '../services/haptics'
import { audioService } from '../services/audio'
import { soundManager } from '../services/soundManager'

interface PomodoroStore {
  // State
  timer: TimerState
  settings: Settings
  history: PomodoroSession[]
  
  // Timer actions
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  completeSession: () => void
  
  // Settings actions
  updateSettings: (newSettings: Partial<Settings>) => void
  
  // History actions
  addToHistory: (session: PomodoroSession) => void
  clearHistory: () => void
  exportHistory: () => string
  
  // Internal timer management
  tick: () => void
  scheduleNotification: () => void
  cancelNotification: () => void
}

const defaultSettings: Settings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  autoStart: false,
  hapticsEnabled: true,
  soundEnabled: true,
  selectedSound: 'default'
}

const defaultTimer: TimerState = {
  isRunning: false,
  isPaused: false,
  currentSession: null,
  remainingTime: 0,
  sessionType: 'work',
  completedSessions: 0
}

let timerInterval: ReturnType<typeof setInterval> | null = null

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      timer: defaultTimer,
      settings: defaultSettings,
      history: [],

      startTimer: () => {
        const state = get()
        const { settings, timer } = state
        
        if (timer.isRunning) return

        const duration = timer.sessionType === 'work' 
          ? settings.workDuration * 60 * 1000
          : settings.breakDuration * 60 * 1000

        const session: PomodoroSession = {
          id: Date.now().toString(),
          startTime: Date.now(),
          duration,
          type: timer.sessionType,
          completed: false
        }

        set({
          timer: {
            ...timer,
            isRunning: true,
            isPaused: false,
            currentSession: session,
            remainingTime: duration
          }
        })

        // Schedule notification
        get().scheduleNotification()

        // Start ticker
        timerInterval = setInterval(() => {
          get().tick()
        }, 1000)

        // Request permissions
        notificationService.requestPermissions()
      },

      pauseTimer: () => {
        const state = get()
        const { timer } = state
        
        if (!timer.isRunning || timer.isPaused) return

        clearInterval(timerInterval!)
        timerInterval = null

        set({
          timer: {
            ...timer,
            isRunning: false,
            isPaused: true
          }
        })

        get().cancelNotification()
      },

      resumeTimer: () => {
        const state = get()
        const { timer } = state
        
        if (!timer.isPaused) return

        set({
          timer: {
            ...timer,
            isRunning: true,
            isPaused: false
          }
        })

        // Reschedule notification
        get().scheduleNotification()

        // Restart ticker
        timerInterval = setInterval(() => {
          get().tick()
        }, 1000)
      },

      resetTimer: () => {
        clearInterval(timerInterval!)
        timerInterval = null

        const state = get()
        const { settings, timer } = state
        
        const duration = timer.sessionType === 'work' 
          ? settings.workDuration * 60 * 1000
          : settings.breakDuration * 60 * 1000

        set({
          timer: {
            ...defaultTimer,
            sessionType: timer.sessionType,
            remainingTime: duration
          }
        })

        get().cancelNotification()
      },

      completeSession: () => {
        const state = get()
        const { timer, settings } = state
        
        if (!timer.currentSession) return

        // Complete current session
        const completedSession: PomodoroSession = {
          ...timer.currentSession,
          completed: true,
          endTime: Date.now()
        }

        get().addToHistory(completedSession)

        // Play notification
        if (settings.soundEnabled) {
          soundManager.playAlarm()
        }

        if (settings.hapticsEnabled) {
          hapticsService.notification('success')
        }

        // Switch to next session type
        const nextSessionType = timer.sessionType === 'work' ? 'break' : 'work'
        const nextDuration = nextSessionType === 'work' 
          ? settings.workDuration * 60 * 1000
          : settings.breakDuration * 60 * 1000

        set({
          timer: {
            ...defaultTimer,
            sessionType: nextSessionType,
            remainingTime: nextDuration,
            completedSessions: timer.sessionType === 'work' 
              ? timer.completedSessions + 1 
              : timer.completedSessions
          }
        })

        get().cancelNotification()

        // Auto-start next session if enabled
        if (settings.autoStart) {
          setTimeout(() => {
            get().startTimer()
          }, 1000)
        }
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      addToHistory: (session) => {
        set((state) => ({
          history: [session, ...state.history]
        }))
      },

      clearHistory: () => {
        set({ history: [] })
      },

      exportHistory: () => {
        const state = get()
        return JSON.stringify(state.history, null, 2)
      },

      tick: () => {
        const state = get()
        const { timer } = state
        
        if (!timer.isRunning || !timer.currentSession) return

        const now = Date.now()
        const elapsed = now - timer.currentSession.startTime
        const remaining = Math.max(0, timer.currentSession.duration - elapsed)

        set({
          timer: {
            ...timer,
            remainingTime: remaining
          }
        })

        if (remaining === 0) {
          get().completeSession()
        }
      },

      scheduleNotification: () => {
        const state = get()
        const { timer, settings } = state
        
        if (!timer.currentSession) return

        const notificationTime = new Date(timer.currentSession.startTime + timer.currentSession.duration)
        const title = timer.sessionType === 'work' ? 'Work Session Complete!' : 'Break Time!'
        const body = timer.sessionType === 'work' 
          ? 'Time for a break! 🎉' 
          : 'Ready to get back to work? 💪'

        notificationService.scheduleNotification(
          parseInt(timer.currentSession.id),
          title,
          body,
          notificationTime
        )
      },

      cancelNotification: () => {
        const state = get()
        const { timer } = state
        
        if (timer.currentSession) {
          notificationService.cancelNotification(parseInt(timer.currentSession.id))
        }
      }
    }),
    {
      name: 'pomodoro-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
          const { value } = await Preferences.get({ key: name })
          return value ?? null
        },
        setItem: async (name: string, value: string): Promise<void> => {
          await Preferences.set({ key: name, value })
        },
        removeItem: async (name: string): Promise<void> => {
          await Preferences.remove({ key: name })
        }
      }))
    }
  )
)
