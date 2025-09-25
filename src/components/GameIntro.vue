<template>
  <div class="game-intro">
    <!-- Dynamic Background -->
    <DynamicBackground />
    
    <!-- Main Content -->
    <div class="content-layout">
      <!-- Game Cover Section (60%) -->
      <div class="cover-section">
        <GameTitle 
          :title="gameData.title" 
          :description="gameData.description" 
        />
      </div>
      
      <!-- Core Action Section (25%) -->
      <div class="action-section">
        <ActionButtons 
          :game-id="gameData.id"
          @start-game="handleStartGame"
          @view-leaderboard="handleViewLeaderboard"
        />
      </div>
      
      <!-- Auxiliary Section (15%) -->
      <div class="auxiliary-section">
        <button 
          @click="handleBackToCollection"
          class="back-btn"
          aria-label="返回游戏合集"
        >
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="back-text">返回合集</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicBackground from './DynamicBackground.vue'
import GameTitle from './GameTitle.vue'
import ActionButtons from './ActionButtons.vue'

export default {
  name: 'GameIntro',
  components: {
    DynamicBackground,
    GameTitle,
    ActionButtons
  },
  props: {
    gameData: {
      type: Object,
      required: true,
      validator(value) {
        return value && value.id && value.title && value.description
      }
    }
  },
  emits: ['start-game', 'view-leaderboard', 'back-to-collection'],
  setup(props, { emit }) {
    const handleStartGame = () => {
      emit('start-game')
    }

    const handleViewLeaderboard = () => {
      emit('view-leaderboard')
    }

    const handleBackToCollection = () => {
      emit('back-to-collection')
    }

    return {
      handleStartGame,
      handleViewLeaderboard,
      handleBackToCollection
    }
  }
}
</script>

<style scoped>
.game-intro {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-layout {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.cover-section {
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.action-section {
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auxiliary-section {
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  position: relative;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  outline: none;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}

.back-btn:hover,
.back-btn:focus {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-2px);
}

.back-icon {
  width: 20px;
  height: 20px;
}

.back-text {
  font-weight: 500;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .cover-section {
    padding: 1rem;
  }
  
  .back-btn {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
  
  .back-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .cover-section {
    height: 55%;
  }
  
  .action-section {
    height: 30%;
  }
  
  .auxiliary-section {
    height: 15%;
  }
}

/* Landscape orientation on mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .cover-section {
    height: 45%;
    padding: 1rem;
  }
  
  .action-section {
    height: 35%;
  }
  
  .auxiliary-section {
    height: 20%;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .back-btn {
    transition: background-color 0.2s ease;
  }
  
  .back-btn:hover,
  .back-btn:focus {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .back-btn {
    border: 1px solid white;
    background: rgba(0, 0, 0, 0.8);
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .back-btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .back-btn:hover {
    transform: none;
  }
}
</style>