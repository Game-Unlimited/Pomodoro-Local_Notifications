import { NativeAudio } from '@capacitor-community/native-audio'

export interface AudioService {
  preloadSound(key: string, assetPath: string): Promise<void>
  playSound(key: string): Promise<void>
  unloadSound(key: string): Promise<void>
  unloadAllSounds(): Promise<void>
}

class CapacitorAudioService implements AudioService {
  private preloadedSounds = new Set<string>()

  async preloadSound(key: string, assetPath: string): Promise<void> {
    try {
      await NativeAudio.preload({
        assetId: key,
        assetPath,
        volume: 1.0,
        audioChannelNum: 1,
        isUrl: false
      })
      this.preloadedSounds.add(key)
    } catch (error) {
      console.error('Preload sound error:', error)
    }
  }

  async playSound(key: string): Promise<void> {
    try {
      if (this.preloadedSounds.has(key)) {
        await NativeAudio.play({ assetId: key })
      }
    } catch (error) {
      console.error('Play sound error:', error)
    }
  }

  async unloadSound(key: string): Promise<void> {
    try {
      await NativeAudio.unload({ assetId: key })
      this.preloadedSounds.delete(key)
    } catch (error) {
      console.error('Unload sound error:', error)
    }
  }

  async unloadAllSounds(): Promise<void> {
    try {
      for (const key of this.preloadedSounds) {
        await this.unloadSound(key)
      }
    } catch (error) {
      console.error('Unload all sounds error:', error)
    }
  }
}

// Web fallback using HTML5 Audio
class WebAudioService implements AudioService {
  private audioContext: AudioContext | null = null
  private sounds = new Map<string, AudioBuffer>()

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext()
    }
  }

  async preloadSound(key: string, assetPath: string): Promise<void> {
    if (!this.audioContext) return

    try {
      const response = await fetch(assetPath)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.sounds.set(key, audioBuffer)
    } catch (error) {
      console.error('Web preload sound error:', error)
    }
  }

  async playSound(key: string): Promise<void> {
    if (!this.audioContext) return

    try {
      const audioBuffer = this.sounds.get(key)
      if (audioBuffer) {
        const source = this.audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(this.audioContext.destination)
        source.start()
      }
    } catch (error) {
      console.error('Web play sound error:', error)
    }
  }

  async unloadSound(key: string): Promise<void> {
    this.sounds.delete(key)
  }

  async unloadAllSounds(): Promise<void> {
    this.sounds.clear()
  }
}

// Export appropriate service based on platform
export const audioService = typeof window !== 'undefined' && 'AudioContext' in window 
  ? new WebAudioService() 
  : new CapacitorAudioService()

// For testing, we can inject a mock service
export const createMockAudioService = (): AudioService => ({
  preloadSound: async () => {},
  playSound: async () => {},
  unloadSound: async () => {},
  unloadAllSounds: async () => {}
})

