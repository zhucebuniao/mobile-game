<template>
  <div class="game-detail-page">
    <!-- Full-screen immersive game intro -->
    <GameIntro 
      v-if="game"
      :game-data="game"
      @start-game="handleStartGame"
      @view-leaderboard="handleViewLeaderboard"
      @back-to-collection="handleBackToCollection"
    />
    
    <!-- Loading state -->
    <div v-else-if="loading" class="loading-screen">
      <DynamicBackground />
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>
    </div>
    
    <!-- Game not found state -->
    <div v-else class="error-screen">
      <DynamicBackground />
      <div class="error-content">
        <h1 class="error-title">游戏未找到</h1>
        <p class="error-message">抱歉，您查找的游戏不存在。</p>
        <button 
          @click="handleBackToCollection"
          class="back-to-home-btn"
          aria-label="返回游戏合集"
        >
          返回游戏合集
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GameIntro from '../components/GameIntro.vue'
import DynamicBackground from '../components/DynamicBackground.vue'

export default {
  name: 'GameDetailPage',
  components: {
    GameIntro,
    DynamicBackground
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const game = ref(null)
    const loading = ref(true)

    const loadGame = async () => {
      try {
        loading.value = true
        const response = await fetch('/games.json')
        if (response.ok) {
          const games = await response.json()
          game.value = games.find(g => g.id === props.id)
        }
      } catch (error) {
        console.error('Failed to load game:', error)
        game.value = null
      } finally {
        loading.value = false
      }
    }

    const handleStartGame = () => {
      // Navigate directly to game play without confirmation
      router.push(`/play/${props.id}`)
    }

    const handleViewLeaderboard = () => {
      router.push(`/leaderboard/${props.id}`)
    }

    const handleBackToCollection = () => {
      router.push('/')
    }

    onMounted(() => {
      loadGame()
    })

    return {
      game,
      loading,
      handleStartGame,
      handleViewLeaderboard,
      handleBackToCollection
    }
  }
}
</script>

<style scoped>
.game-detail-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.loading-screen,
.error-screen {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content,
.error-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.error-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.back-to-home-btn {
  background: #4ade80;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
  outline: none;
}

.back-to-home-btn:hover,
.back-to-home-btn:focus {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .error-title {
    font-size: 2rem;
  }
  
  .error-message {
    font-size: 1.1rem;
  }
  
  .loading-content,
  .error-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .error-title {
    font-size: 1.8rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .back-to-home-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
    border-top-color: #4ade80;
  }
  
  .back-to-home-btn {
    transition: background-color 0.2s ease;
  }
  
  .back-to-home-btn:hover,
  .back-to-home-btn:focus {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .back-to-home-btn {
    border: 2px solid white;
  }
  
  .loading-spinner {
    border-color: white;
    border-top-color: #4ade80;
  }
}
</style>