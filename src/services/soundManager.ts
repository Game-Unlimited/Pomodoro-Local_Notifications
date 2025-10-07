import { audioService } from './audio'

export interface Sound {
  id: string
  name: string
  file: string
}

export interface SoundManager {
  loadSounds(): Promise<Sound[]>
  playAlarm(): Promise<void>
  preloadAlarm(): Promise<void>
}

class WebSoundManager implements SoundManager {
  private sounds: Sound[] = []
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext()
    }
  }

  async loadSounds(): Promise<Sound[]> {
    try {
      const response = await fetch('/sounds/manifest.json')
      this.sounds = await response.json()
      return this.sounds
    } catch (error) {
      console.error('Failed to load sound manifest:', error)
      // Fallback sounds
      this.sounds = [
        { id: 'alarm', name: 'Default Alarm', file: 'alarm.mp3' }
      ]
      return this.sounds
    }
  }

  async playAlarm(): Promise<void> {
    if (!this.audioContext) {
      // Fallback to HTML5 Audio
      const audio = new Audio('/sounds/alarm.mp3')
      audio.volume = 0.7
      try {
        await audio.play()
      } catch (error) {
        console.error('Failed to play alarm:', error)
        // Fallback to system beep
        this.playSystemBeep()
      }
      return
    }

    try {
      // Use Web Audio API for better control
      const response = await fetch('/sounds/alarm.mp3')
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.audioContext.destination)
      source.start()
    } catch (error) {
      console.error('Failed to play alarm with Web Audio:', error)
      // Fallback to HTML5 Audio
      const audio = new Audio('/sounds/alarm.mp3')
      audio.volume = 0.7
      await audio.play()
    }
  }

  async preloadAlarm(): Promise<void> {
    // Preload the alarm sound for better performance
    try {
      const audio = new Audio('/sounds/alarm.mp3')
      audio.preload = 'auto'
      // Load the audio
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve)
        audio.addEventListener('error', reject)
        audio.load()
      })
    } catch (error) {
      console.error('Failed to preload alarm:', error)
    }
  }

  private playSystemBeep(): void {
    // Fallback to system beep using Web Audio API
    if (this.audioContext) {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.5)
    }
  }
}

// Export singleton instance
export const soundManager = new WebSoundManager()

// For testing, we can inject a mock service
export const createMockSoundManager = (): SoundManager => ({
  loadSounds: async () => [],
  playAlarm: async () => {},
  preloadAlarm: async () => {}
})
