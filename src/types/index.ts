export interface PomodoroSession {
  id: string
  startTime: number
  duration: number
  type: 'work' | 'break'
  completed: boolean
  endTime?: number
}

export interface Settings {
  workDuration: number // in minutes
  breakDuration: number // in minutes
  longBreakDuration: number // in minutes
  autoStart: boolean
  hapticsEnabled: boolean
  soundEnabled: boolean
  selectedSound: string
}

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  currentSession: PomodoroSession | null
  remainingTime: number // in milliseconds
  sessionType: 'work' | 'break'
  completedSessions: number
}

export interface AppState {
  timer: TimerState
  settings: Settings
  history: PomodoroSession[]
}

