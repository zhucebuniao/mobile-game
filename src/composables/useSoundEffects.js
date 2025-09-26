import { ref, onUnmounted } from 'vue'

// Web Audio API based sound effects
export function useSoundEffects() {
  const audioContext = ref(null)
  const isEnabled = ref(true)
  const volume = ref(0.3)
  
  // Initialize audio context
  const initAudio = () => {
    try {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
      
      // Resume audio context on user interaction (required by browsers)
      const resumeAudio = () => {
        if (audioContext.value && audioContext.value.state === 'suspended') {
          audioContext.value.resume()
        }
        document.removeEventListener('click', resumeAudio)
        document.removeEventListener('touchstart', resumeAudio)
      }
      
      document.addEventListener('click', resumeAudio)
      document.addEventListener('touchstart', resumeAudio)
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      audioContext.value = null
    }
  }
  
  // Create oscillator-based sound effect
  const createTone = (frequency, duration, type = 'sine', envelope = null) => {
    if (!audioContext.value || !isEnabled.value) return
    
    try {
      const oscillator = audioContext.value.createOscillator()
      const gainNode = audioContext.value.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.value.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime)
      oscillator.type = type
      
      // Apply envelope if provided
      if (envelope) {
        gainNode.gain.setValueAtTime(0, audioContext.value.currentTime)
        gainNode.gain.linearRampToValueAtTime(
          volume.value * envelope.attack, 
          audioContext.value.currentTime + envelope.attackTime
        )
        gainNode.gain.exponentialRampToValueAtTime(
          volume.value * envelope.sustain,
          audioContext.value.currentTime + envelope.attackTime + envelope.sustainTime
        )
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.value.currentTime + duration
        )
      } else {
        gainNode.gain.setValueAtTime(volume.value, audioContext.value.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + duration)
      }
      
      oscillator.start(audioContext.value.currentTime)
      oscillator.stop(audioContext.value.currentTime + duration)
    } catch (error) {
      console.warn('Error creating sound:', error)
    }
  }
  
  // Create noise-based sound effect
  const createNoise = (duration, filterFreq = 1000) => {
    if (!audioContext.value || !isEnabled.value) return
    
    try {
      const bufferSize = audioContext.value.sampleRate * duration
      const buffer = audioContext.value.createBuffer(1, bufferSize, audioContext.value.sampleRate)
      const data = buffer.getChannelData(0)
      
      // Generate white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      
      const noise = audioContext.value.createBufferSource()
      const filter = audioContext.value.createBiquadFilter()
      const gainNode = audioContext.value.createGain()
      
      noise.buffer = buffer
      noise.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.value.destination)
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(filterFreq, audioContext.value.currentTime)
      
      gainNode.gain.setValueAtTime(volume.value * 0.1, audioContext.value.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + duration)
      
      noise.start(audioContext.value.currentTime)
      noise.stop(audioContext.value.currentTime + duration)
    } catch (error) {
      console.warn('Error creating noise:', error)
    }
  }
  
  // Pre-defined sound effects
  const soundEffects = {
    // Interaction sounds
    click: () => createTone(800, 0.1, 'sine', {
      attack: 0.7,
      attackTime: 0.01,
      sustain: 0.3,
      sustainTime: 0.05
    }),
    
    hover: () => createTone(600, 0.08, 'sine', {
      attack: 0.5,
      attackTime: 0.01,
      sustain: 0.2,
      sustainTime: 0.03
    }),
    
    unlock: () => {
      // Multi-tone unlock sound
      createTone(523, 0.15, 'sine') // C5
      setTimeout(() => createTone(659, 0.15, 'sine'), 50) // E5
      setTimeout(() => createTone(784, 0.2, 'sine'), 100) // G5
    },
    
    success: () => {
      // Success chord progression
      createTone(523, 0.3, 'sine') // C5
      setTimeout(() => createTone(659, 0.3, 'sine'), 100) // E5
      setTimeout(() => createTone(784, 0.3, 'sine'), 200) // G5
      setTimeout(() => createTone(1047, 0.4, 'sine'), 300) // C6
    },
    
    puzzleComplete: () => {
      // Triumphant completion sound
      const frequencies = [523, 659, 784, 1047, 1319] // C major scale
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          createTone(freq, 0.4, 'sine', {
            attack: 1,
            attackTime: 0.05,
            sustain: 0.6,
            sustainTime: 0.2
          })
        }, index * 80)
      })
    },
    
    error: () => createTone(200, 0.3, 'sawtooth', {
      attack: 0.8,
      attackTime: 0.02,
      sustain: 0.4,
      sustainTime: 0.1
    }),
    
    whoosh: () => createNoise(0.2, 2000),
    
    sparkle: () => {
      // Multiple high-pitched tones for sparkle effect
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createTone(1000 + Math.random() * 1000, 0.1, 'sine', {
            attack: 1,
            attackTime: 0.01,
            sustain: 0.3,
            sustainTime: 0.04
          })
        }, i * 30)
      }
    },
    
    ambient: () => {
      // Subtle ambient tone for background
      createTone(220, 2, 'sine', {
        attack: 0.1,
        attackTime: 0.5,
        sustain: 0.05,
        sustainTime: 1
      })
    }
  }
  
  // Play sound effect by name
  const playSound = (soundName, options = {}) => {
    if (!isEnabled.value) return
    
    // Override volume for this sound if specified
    if (options.volume !== undefined) {
      const originalVolume = volume.value
      volume.value = options.volume
      setTimeout(() => {
        volume.value = originalVolume
      }, 100)
    }
    
    if (soundEffects[soundName]) {
      soundEffects[soundName]()
    } else {
      console.warn(`Sound effect '${soundName}' not found`)
    }
  }
  
  // Toggle sound effects
  const toggleSound = () => {
    isEnabled.value = !isEnabled.value
    return isEnabled.value
  }
  
  // Set volume (0-1)
  const setVolume = (newVolume) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
  }
  
  // Create custom sound effect
  const createCustomSound = (config) => {
    const {
      frequency = 440,
      duration = 0.2,
      type = 'sine',
      envelope = null
    } = config
    
    createTone(frequency, duration, type, envelope)
  }
  
  // Cleanup
  onUnmounted(() => {
    if (audioContext.value) {
      audioContext.value.close()
    }
  })
  
  // Initialize on first use
  if (!audioContext.value) {
    initAudio()
  }
  
  return {
    isEnabled,
    volume,
    playSound,
    toggleSound,
    setVolume,
    createCustomSound,
    initAudio
  }
}

// Global sound effects instance
let globalSoundEffects = null

export function useGlobalSoundEffects() {
  if (!globalSoundEffects) {
    globalSoundEffects = useSoundEffects()
  }
  return globalSoundEffects
}