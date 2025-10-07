import { Preferences } from '@capacitor/preferences'

export interface StorageService {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

class CapacitorStorageService implements StorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key })
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await Preferences.set({ key, value: JSON.stringify(value) })
    } catch (error) {
      console.error('Storage set error:', error)
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key })
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      await Preferences.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

// Export singleton instance
export const storageService = new CapacitorStorageService()

// For testing, we can inject a mock service
export const createMockStorageService = (): StorageService => ({
  get: async () => null,
  set: async () => {},
  remove: async () => {},
  clear: async () => {}
})

