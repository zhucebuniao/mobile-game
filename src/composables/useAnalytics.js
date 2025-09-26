import { ref } from 'vue'

// Analytics tracking composable for landing page interactions
export function useAnalytics() {
  const sessionId = ref(generateSessionId())
  const events = ref([])
  const sessionStart = ref(Date.now())
  
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  // Track an event
  const trackEvent = (eventName, properties = {}) => {
    const event = {
      id: generateEventId(),
      sessionId: sessionId.value,
      name: eventName,
      timestamp: Date.now(),
      properties: {
        ...properties,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        url: window.location.href,
        referrer: document.referrer
      }
    }
    
    events.value.push(event)
    
    // Store in localStorage for persistence
    storeEvent(event)
    
    // Send to analytics endpoint (mock for now)
    sendToAnalytics(event)
    
    console.log('Analytics Event:', event)
  }
  
  function generateEventId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  // Store event in localStorage
  const storeEvent = (event) => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('landingPageEvents') || '[]')
      storedEvents.push(event)
      
      // Keep only last 100 events to prevent storage bloat
      if (storedEvents.length > 100) {
        storedEvents.splice(0, storedEvents.length - 100)
      }
      
      localStorage.setItem('landingPageEvents', JSON.stringify(storedEvents))
    } catch (error) {
      console.warn('Failed to store analytics event:', error)
    }
  }
  
  // Mock analytics endpoint
  const sendToAnalytics = async (event) => {
    try {
      // In a real implementation, this would send to your analytics service
      // For now, we'll just simulate the request
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Would send to analytics:', event)
        return
      }
      
      // Simulate API call
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
    }
  }
  
  // Pre-defined event tracking functions
  const analytics = {
    // Landing page events
    landingPageView: (properties = {}) => {
      trackEvent('landing_page_view', {
        sessionDuration: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    introStarted: (properties = {}) => {
      trackEvent('intro_started', properties)
    },
    
    introCompleted: (properties = {}) => {
      trackEvent('intro_completed', {
        completionTime: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    introSkipped: (properties = {}) => {
      trackEvent('intro_skipped', {
        skipTime: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    puzzlePieceUnlocked: (pieceIndex, properties = {}) => {
      trackEvent('puzzle_piece_unlocked', {
        pieceIndex,
        timestamp: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    puzzleCompleted: (properties = {}) => {
      trackEvent('puzzle_completed', {
        completionTime: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    ctaClicked: (ctaType, properties = {}) => {
      trackEvent('cta_clicked', {
        ctaType,
        clickTime: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    interactionStarted: (interactionType, properties = {}) => {
      trackEvent('interaction_started', {
        interactionType,
        ...properties
      })
    },
    
    soundToggled: (isEnabled, properties = {}) => {
      trackEvent('sound_toggled', {
        isEnabled,
        ...properties
      })
    },
    
    errorOccurred: (errorType, errorMessage, properties = {}) => {
      trackEvent('error_occurred', {
        errorType,
        errorMessage,
        ...properties
      })
    },
    
    // Engagement metrics
    timeSpent: (section, duration, properties = {}) => {
      trackEvent('time_spent', {
        section,
        duration,
        ...properties
      })
    },
    
    mouseMovement: (movements, properties = {}) => {
      trackEvent('mouse_movement', {
        movementCount: movements,
        ...properties
      })
    },
    
    scrollDepth: (depth, properties = {}) => {
      trackEvent('scroll_depth', {
        depth,
        ...properties
      })
    },
    
    deviceOrientation: (orientation, properties = {}) => {
      trackEvent('device_orientation', {
        orientation,
        ...properties
      })
    },
    
    // Conversion events
    gameSelected: (gameId, properties = {}) => {
      trackEvent('game_selected', {
        gameId,
        selectionTime: Date.now() - sessionStart.value,
        ...properties
      })
    },
    
    gameStarted: (gameId, properties = {}) => {
      trackEvent('game_started', {
        gameId,
        startTime: Date.now() - sessionStart.value,
        ...properties
      })
    }
  }
  
  // Get analytics summary
  const getAnalyticsSummary = () => {
    const summary = {
      sessionId: sessionId.value,
      sessionDuration: Date.now() - sessionStart.value,
      eventCount: events.value.length,
      eventTypes: [...new Set(events.value.map(e => e.name))],
      deviceInfo: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        touch: 'ontouchstart' in window,
        connection: navigator.connection?.effectiveType || 'unknown'
      }
    }
    
    return summary
  }
  
  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      summary: getAnalyticsSummary(),
      events: events.value,
      storedEvents: JSON.parse(localStorage.getItem('landingPageEvents') || '[]')
    }
    
    return data
  }
  
  // Clear analytics data
  const clearAnalytics = () => {
    events.value = []
    localStorage.removeItem('landingPageEvents')
    sessionId.value = generateSessionId()
    sessionStart.value = Date.now()
  }
  
  // Track page visibility changes
  const trackVisibilityChanges = () => {
    let visibilityStart = Date.now()
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const visibleDuration = Date.now() - visibilityStart
        analytics.timeSpent('page_visible', visibleDuration)
      } else {
        visibilityStart = Date.now()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }
  
  // Track mouse movements (throttled)
  const trackMouseMovements = () => {
    let movementCount = 0
    let lastTrack = Date.now()
    
    const handleMouseMove = () => {
      movementCount++
      
      // Track every 5 seconds
      if (Date.now() - lastTrack > 5000) {
        analytics.mouseMovement(movementCount)
        movementCount = 0
        lastTrack = Date.now()
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (movementCount > 0) {
        analytics.mouseMovement(movementCount)
      }
    }
  }
  
  // Initialize tracking
  const initializeAnalytics = () => {
    // Track initial page view
    analytics.landingPageView()
    
    // Set up automatic tracking
    const cleanupVisibility = trackVisibilityChanges()
    const cleanupMouse = trackMouseMovements()
    
    // Track device orientation changes
    const handleOrientationChange = () => {
      analytics.deviceOrientation(window.orientation || screen.orientation?.angle || 0)
    }
    
    window.addEventListener('orientationchange', handleOrientationChange)
    
    // Cleanup function
    return () => {
      cleanupVisibility()
      cleanupMouse()
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }
  
  return {
    sessionId,
    events,
    trackEvent,
    analytics,
    getAnalyticsSummary,
    exportAnalytics,
    clearAnalytics,
    initializeAnalytics
  }
}

// Global analytics instance
let globalAnalytics = null

export function useGlobalAnalytics() {
  if (!globalAnalytics) {
    globalAnalytics = useAnalytics()
  }
  return globalAnalytics
}