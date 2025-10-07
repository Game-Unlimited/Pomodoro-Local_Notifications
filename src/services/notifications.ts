import { LocalNotifications } from '@capacitor/local-notifications'

export interface NotificationService {
  requestPermissions(): Promise<boolean>
  scheduleNotification(id: number, title: string, body: string, scheduleAt: Date): Promise<void>
  cancelNotification(id: number): Promise<void>
  cancelAllNotifications(): Promise<void>
}

class CapacitorNotificationService implements NotificationService {
  async requestPermissions(): Promise<boolean> {
    try {
      const { display } = await LocalNotifications.checkPermissions()
      if (display === 'granted') {
        return true
      }

      const { display: newDisplay } = await LocalNotifications.requestPermissions()
      return newDisplay === 'granted'
    } catch (error) {
      console.error('Notification permission error:', error)
      return false
    }
  }

  async scheduleNotification(id: number, title: string, body: string, scheduleAt: Date): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: scheduleAt },
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      })
    } catch (error) {
      console.error('Schedule notification error:', error)
    }
  }

  async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] })
    } catch (error) {
      console.error('Cancel notification error:', error)
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      // cancel all scheduled notifications by fetching pending and cancelling them
      const pending = await LocalNotifications.getPending()
      if (pending.notifications && pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications.map(n => ({ id: n.id })) })
      }
    } catch (error) {
      console.error('Cancel all notifications error:', error)
    }
  }
}

// Export singleton instance
export const notificationService = new CapacitorNotificationService()

// For testing, we can inject a mock service
export const createMockNotificationService = (): NotificationService => ({
  requestPermissions: async () => true,
  scheduleNotification: async () => {},
  cancelNotification: async () => {},
  cancelAllNotifications: async () => {}
})
