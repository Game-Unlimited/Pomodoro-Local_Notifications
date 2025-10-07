import { useEffect } from 'react'
import { soundManager } from '../services/soundManager'
import { notificationService } from '../services/notifications'

export function useAppInitialization() {
  useEffect(() => {
    // Initialize sound manager
    soundManager.preloadAlarm()
    
    // Request notification permissions on app start
    notificationService.requestPermissions()
  }, [])
}
