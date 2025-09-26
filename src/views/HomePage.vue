<template>
  <div class="interactive-landing-page">
    <!-- Loading intro animation -->
    <LoadingIntro 
      v-if="showIntro"
      @intro-complete="handleIntroComplete"
      @intro-skipped="handleIntroSkipped"
    />
    
    <!-- Dynamic background -->
    <DynamicBackground />
    
    <!-- Main content -->
    <div class="landing-content" :class="{ 'content-ready': !showIntro }">
      <!-- Logo and minimal navigation -->
      <header class="landing-header">
        <div class="logo-section">
          <div class="main-logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <span class="logo-text">游戏世界</span>
          </div>
        </div>
        
        <div class="header-controls">
          <button 
            @click="toggleSound" 
            class="control-btn"
            :class="{ 'active': soundEnabled }"
            aria-label="切换音效"
          >
            <svg v-if="soundEnabled" class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <svg v-else class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          </button>
          
          <button 
            @click="showHelp"
            class="control-btn help-btn"
            aria-label="帮助"
          >
            <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>
      </header>
      
      <!-- Core interactive area -->
      <main class="interactive-main">
        <InteractivePuzzle
          @puzzle-completed="handlePuzzleComplete"
          @piece-unlocked="handlePieceUnlock"
          @cta-clicked="handleMainCTA"
        />
      </main>
      
      <!-- Game selection area (revealed after puzzle completion) -->
      <section class="game-selection" :class="{ 'revealed': puzzleCompleted }">
        <div class="selection-header">
          <h2 class="selection-title">选择你的冒险</h2>
          <p class="selection-subtitle">每个游戏都是一个新的世界</p>
        </div>
        
        <div class="games-grid">
          <div 
            v-for="game in games" 
            :key="game.id"
            class="game-card"
            @click="selectGame(game)"
            @mouseenter="handleGameHover"
            tabindex="0"
            role="button"
            :aria-label="`选择游戏：${game.title}`"
          >
            <div class="card-background">
              <img 
                :src="game.thumbnail" 
                :alt="game.title"
                class="game-thumbnail"
                @error="handleImageError"
                loading="lazy"
              >
              <div class="card-overlay"></div>
            </div>
            
            <div class="card-content">
              <h3 class="game-title">{{ game.title }}</h3>
              <p class="game-description">{{ game.description }}</p>
              
              <div class="game-stats" v-if="getGameStats(game.id)">
                <div class="stat-item">
                  <span class="stat-label">最高分</span>
                  <span class="stat-value">{{ getGameStats(game.id).bestScore || 0 }}</span>
                </div>
              </div>
              
              <div class="card-action">
                <span class="action-text">开始游戏</span>
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 3l14 9-14 9V3z"/>
                </svg>
              </div>
            </div>
            
            <div class="card-glow"></div>
          </div>
        </div>
        
        <div v-if="games.length === 0" class="no-games">
          <div class="no-games-content">
            <svg class="no-games-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="no-games-text">暂时没有可用的游戏</p>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Hidden footer -->
    <HiddenFooter 
      :is-visible="showFooter"
      @settings-changed="handleSettingsChange"
    />
    
    <!-- Help modal -->
    <div v-if="showHelpModal" class="help-modal-overlay" @click="closeHelp">
      <div class="help-modal" @click.stop>
        <div class="help-header">
          <h3 class="help-title">如何使用</h3>
          <button @click="closeHelp" class="close-btn" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="help-content">
          <div class="help-section">
            <h4>互动探索</h4>
            <p>点击屏幕上的神秘图标来解锁隐藏的游戏世界</p>
          </div>
          
          <div class="help-section">
            <h4>音效控制</h4>
            <p>点击右上角的音效按钮来开启或关闭声音</p>
          </div>
          
          <div class="help-section">
            <h4>无障碍功能</h4>
            <p>支持键盘导航和屏幕阅读器，确保所有人都能享受游戏</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingIntro from '../components/LoadingIntro.vue'
import DynamicBackground from '../components/DynamicBackground.vue'
import InteractivePuzzle from '../components/InteractivePuzzle.vue'
import HiddenFooter from '../components/HiddenFooter.vue'
import { useGlobalSoundEffects } from '../composables/useSoundEffects'
import { useGlobalAnalytics } from '../composables/useAnalytics'

export default {
  name: 'HomePage',
  components: {
    LoadingIntro,
    DynamicBackground,
    InteractivePuzzle,
    HiddenFooter
  },
  setup() {
    const router = useRouter()
    const { playSound, isEnabled: soundEnabled, toggleSound } = useGlobalSoundEffects()
    const { analytics, initializeAnalytics } = useGlobalAnalytics()
    
    const games = ref([])
    const showIntro = ref(true)
    const puzzleCompleted = ref(false)
    const showFooter = ref(false)
    const showHelpModal = ref(false)
    
    let analyticsCleanup = null
    
    const loadGames = async () => {
      try {
        const response = await fetch('/games.json')
        if (response.ok) {
          games.value = await response.json()
        }
      } catch (error) {
        console.error('Failed to load games:', error)
        analytics.errorOccurred('game_loading_error', error.message)
      }
    }
    
    const getGameStats = (gameId) => {
      try {
        const storageKey = `leaderboard_${gameId}`
        const scores = JSON.parse(localStorage.getItem(storageKey) || '[]')
        if (scores.length > 0) {
          return {
            bestScore: Math.max(...scores.map(s => s.score)),
            totalPlays: scores.length
          }
        }
      } catch (error) {
        console.warn('Failed to load game stats:', error)
      }
      return null
    }
    
    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaVsOaLoSBJbWFnZTwvdGV4dD48L3N2Zz4='
    }
    
    const handleIntroComplete = () => {
      showIntro.value = false
      playSound('whoosh')
      analytics.introCompleted()
    }
    
    const handleIntroSkipped = () => {
      showIntro.value = false
      playSound('click')
      analytics.introSkipped()
    }
    
    const handlePuzzleComplete = () => {
      puzzleCompleted.value = true
      showFooter.value = true
      playSound('puzzleComplete')
      analytics.puzzleCompleted()
      
      // Add slight delay before showing games for dramatic effect
      setTimeout(() => {
        const gameSelection = document.querySelector('.game-selection')
        if (gameSelection) {
          gameSelection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 1000)
    }
    
    const handlePieceUnlock = (data) => {
      playSound('unlock')
      analytics.puzzlePieceUnlocked(data.index, {
        pieceName: data.piece.text
      })
    }
    
    const handleMainCTA = () => {
      // If no games available, show help
      if (games.value.length === 0) {
        showHelp()
        return
      }
      
      // Navigate to first available game or show selection
      if (games.value.length === 1) {
        selectGame(games.value[0])
      } else {
        puzzleCompleted.value = true
        showFooter.value = true
        playSound('success')
        analytics.ctaClicked('main_explore')
      }
    }
    
    const selectGame = (game) => {
      playSound('click')
      analytics.gameSelected(game.id, {
        gameTitle: game.title,
        fromSection: 'landing_page'
      })
      
      // Navigate to game detail page
      router.push(`/game/${game.id}`)
    }
    
    const handleGameHover = () => {
      if (soundEnabled.value) {
        playSound('hover', { volume: 0.1 })
      }
    }
    
    const toggleSoundWithFeedback = () => {
      const wasEnabled = soundEnabled.value
      toggleSound()
      
      if (!wasEnabled) {
        // Play a test sound when enabling
        setTimeout(() => playSound('click'), 100)
      }
      
      analytics.soundToggled(soundEnabled.value)
    }
    
    const showHelp = () => {
      showHelpModal.value = true
      playSound('click')
    }
    
    const closeHelp = () => {
      showHelpModal.value = false
      playSound('click')
    }
    
    const handleSettingsChange = (settings) => {
      analytics.trackEvent('settings_changed', settings)
    }
    
    // Handle keyboard navigation
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        if (showHelpModal.value) {
          closeHelp()
        }
      } else if (event.key === 'h' || event.key === 'H') {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          showHelp()
        }
      }
    }
    
    onMounted(() => {
      loadGames()
      
      // Initialize analytics
      analyticsCleanup = initializeAnalytics()
      
      // Add keyboard listeners
      document.addEventListener('keydown', handleKeydown)
      
      // Track landing page view
      analytics.landingPageView({
        hasIntro: showIntro.value,
        gameCount: games.value.length
      })
    })
    
    onUnmounted(() => {
      if (analyticsCleanup) {
        analyticsCleanup()
      }
      document.removeEventListener('keydown', handleKeydown)
    })
    
    return {
      games,
      showIntro,
      puzzleCompleted,
      showFooter,
      showHelpModal,
      soundEnabled,
      getGameStats,
      handleImageError,
      handleIntroComplete,
      handleIntroSkipped,
      handlePuzzleComplete,
      handlePieceUnlock,
      handleMainCTA,
      selectGame,
      handleGameHover,
      toggleSound: toggleSoundWithFeedback,
      showHelp,
      closeHelp,
      handleSettingsChange
    }
  }
}
</script>

<style scoped>
.interactive-landing-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.landing-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 1s ease;
}

.landing-content.content-ready {
  opacity: 1;
}

/* Header */
.landing-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.logo-section {
  display: flex;
  align-items: center;
}

.main-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  color: #4ade80;
  filter: drop-shadow(0 0 10px rgba(74, 222, 128, 0.5));
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #4ade80 0%, #06d6a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

.header-controls {
  display: flex;
  gap: 1rem;
}

.control-btn {
  position: relative;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.control-btn:hover,
.control-btn:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(74, 222, 128, 0.5);
  color: #4ade80;
  transform: translateY(-2px);
}

.control-btn.active {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
  color: #4ade80;
}

.control-icon {
  width: 24px;
  height: 24px;
}

/* Main interactive area */
.interactive-main {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 70vh;
}

/* Game selection area */
.game-selection {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
  transform: translateY(100%);
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
}

.game-selection.revealed {
  transform: translateY(0);
}

.selection-header {
  text-align: center;
  margin-bottom: 2rem;
}

.selection-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #4ade80 0%, #06d6a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.selection-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.game-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.game-card:hover,
.game-card:focus {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(74, 222, 128, 0.2);
  border-color: rgba(74, 222, 128, 0.3);
}

.card-background {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.game-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.game-card:hover .game-thumbnail {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.game-card:hover .card-overlay {
  opacity: 0.3;
}

.card-content {
  position: relative;
  padding: 1.5rem;
  z-index: 2;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.game-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.game-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4ade80;
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #4ade80;
  font-weight: 600;
}

.action-text {
  font-size: 1.1rem;
}

.action-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.game-card:hover .action-icon {
  transform: translateX(5px);
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3) 0%, rgba(6, 214, 160, 0.3) 100%);
  border-radius: 22px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.game-card:hover .card-glow,
.game-card:focus .card-glow {
  opacity: 1;
}

/* No games state */
.no-games {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.no-games-content {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.no-games-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.no-games-text {
  font-size: 1.1rem;
  margin: 0;
}

/* Help modal */
.help-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.help-modal {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.95) 100%);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.help-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #4ade80;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover,
.close-btn:focus {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.help-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #4ade80;
}

.help-section p {
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .landing-header {
    padding: 1rem;
  }
  
  .logo-text {
    font-size: 1.4rem;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .control-icon {
    width: 20px;
    height: 20px;
  }
  
  .interactive-main {
    padding: 1rem;
  }
  
  .game-selection {
    padding: 1rem;
  }
  
  .selection-title {
    font-size: 2rem;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .game-card {
    border-radius: 16px;
  }
  
  .card-background {
    height: 150px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .help-modal-overlay {
    padding: 1rem;
  }
  
  .help-modal {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .landing-header {
    padding: 0.75rem;
  }
  
  .main-logo {
    gap: 0.75rem;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .control-btn {
    width: 36px;
    height: 36px;
  }
  
  .control-icon {
    width: 18px;
    height: 18px;
  }
  
  .selection-title {
    font-size: 1.8rem;
  }
  
  .selection-subtitle {
    font-size: 1rem;
  }
  
  .game-title {
    font-size: 1.3rem;
  }
  
  .game-description {
    font-size: 0.9rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .landing-content,
  .game-selection,
  .game-card,
  .control-btn {
    transition: opacity 0.2s ease, background-color 0.2s ease;
  }
  
  .game-card:hover,
  .game-card:focus {
    transform: none;
  }
  
  .control-btn:hover,
  .control-btn:focus {
    transform: none;
  }
  
  .game-thumbnail {
    transition: none;
  }
  
  .game-card:hover .game-thumbnail {
    transform: none;
  }
  
  .action-icon {
    transition: none;
  }
  
  .game-card:hover .action-icon {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .interactive-landing-page {
    background: #000;
  }
  
  .landing-header {
    background: rgba(0, 0, 0, 0.9);
    border-bottom: 2px solid #fff;
  }
  
  .logo-text,
  .selection-title {
    background: #00ff00;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .control-btn {
    border-color: #fff;
    background: rgba(0, 0, 0, 0.8);
  }
  
  .control-btn:hover,
  .control-btn:focus,
  .control-btn.active {
    background: #00ff00;
    color: #000;
  }
  
  .game-card {
    border-color: #fff;
    background: rgba(0, 0, 0, 0.8);
  }
  
  .help-modal {
    background: #000;
    border-color: #fff;
  }
}

/* Focus styles for accessibility */
.game-card:focus {
  outline: 3px solid #4ade80;
  outline-offset: 2px;
}

.control-btn:focus {
  outline: 2px solid #4ade80;
  outline-offset: 2px;
}
</style>