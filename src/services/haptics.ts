import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

export interface HapticsService {
  light(): Promise<void>
  medium(): Promise<void>
  heavy(): Promise<void>
  selection(): Promise<void>
  notification(type: 'success' | 'warning' | 'error'): Promise<void>
}

class CapacitorHapticsService implements HapticsService {
  async light(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch (error) {
      console.error('Haptics light error:', error)
    }
  }

  async medium(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch (error) {
      console.error('Haptics medium error:', error)
    }
  }

  async heavy(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch (error) {
      console.error('Haptics heavy error:', error)
    }
  }

  async selection(): Promise<void> {
    try {
      await Haptics.selectionStart()
    } catch (error) {
      console.error('Haptics selection error:', error)
    }
  }

  async notification(type: 'success' | 'warning' | 'error'): Promise<void> {
    try {
      switch (type) {
        case 'success':
          await Haptics.notification({ type: NotificationType.Success })
          break
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning })
          break
        case 'error':
          await Haptics.notification({ type: NotificationType.Error })
          break
      }
    } catch (error) {
      console.error('Haptics notification error:', error)
    }
  }
}

// Export singleton instance
export const hapticsService = new CapacitorHapticsService()

// For testing, we can inject a mock service
export const createMockHapticsService = (): HapticsService => ({
  light: async () => {},
  medium: async () => {},
  heavy: async () => {},
  selection: async () => {},
  notification: async () => {}
})
