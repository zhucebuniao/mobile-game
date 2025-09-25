<template>
  <div class="action-buttons-container">
    <!-- Primary Action - Start Game -->
    <button
      @click="handleStartGame"
      class="start-game-btn"
      :class="{ 'pulse': isPulsing }"
      aria-label="开始游戏"
    >
      <span class="btn-text">开始游戏</span>
      <div class="btn-glow"></div>
    </button>

    <!-- Game Statistics -->
    <div class="game-stats" v-if="bestScore !== null || lastScore !== null">
      <div class="stat-item" v-if="bestScore !== null">
        <span class="stat-label">最高分</span>
        <span class="stat-value">{{ bestScore }}</span>
      </div>
      <div class="stat-item" v-if="lastScore !== null">
        <span class="stat-label">上次成绩</span>
        <span class="stat-value">{{ lastScore }}</span>
      </div>
    </div>

    <!-- Secondary Actions -->
    <div class="secondary-actions">
      <button
        @click="handleLeaderboard"
        class="secondary-btn leaderboard-btn"
        aria-label="查看排行榜"
      >
        排行榜
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ActionButtons',
  props: {
    gameId: {
      type: String,
      required: true
    }
  },
  emits: ['start-game', 'view-leaderboard'],
  setup(props, { emit }) {
    const isPulsing = ref(false)
    const bestScore = ref(null)
    const lastScore = ref(null)

    const loadGameStats = () => {
      try {
        const storageKey = `leaderboard_${props.gameId}`
        const scores = JSON.parse(localStorage.getItem(storageKey) || '[]')
        
        if (scores.length > 0) {
          // Best score is the first one (they're sorted by score descending)
          bestScore.value = scores[0].score
          // Last score is the most recent one (by timestamp)
          const sortedByTime = [...scores].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          lastScore.value = sortedByTime[0].score
        }
      } catch (error) {
        console.error('Failed to load game stats:', error)
      }
    }

    const handleStartGame = () => {
      // Pulse animation
      isPulsing.value = true
      setTimeout(() => {
        isPulsing.value = false
      }, 300)

      // Emit start event after short delay for visual feedback
      setTimeout(() => {
        emit('start-game')
      }, 150)
    }

    const handleLeaderboard = () => {
      emit('view-leaderboard')
    }

    onMounted(() => {
      loadGameStats()
    })

    return {
      isPulsing,
      bestScore,
      lastScore,
      handleStartGame,
      handleLeaderboard
    }
  }
}
</script>

<style scoped>
.action-buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.start-game-btn {
  position: relative;
  width: 70%;
  min-height: 56px;
  background: #4ade80;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 25px rgba(74, 222, 128, 0.3);
  outline: none;
}

.start-game-btn:hover,
.start-game-btn:focus {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 35px rgba(74, 222, 128, 0.4);
  filter: brightness(1.1);
}

.start-game-btn:active {
  transform: translateY(0) scale(0.98);
}

.start-game-btn.pulse {
  animation: pulseEffect 0.3s ease-out;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.start-game-btn:hover .btn-glow {
  opacity: 1;
}

.game-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.secondary-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.secondary-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  outline: none;
}

.secondary-btn:hover,
.secondary-btn:focus {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.leaderboard-btn {
  animation: slideInFromBottom 0.6s ease-out 0.3s both;
}

@keyframes pulseEffect {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .start-game-btn {
    width: 80%;
    font-size: 1.1rem;
  }
  
  .game-stats {
    gap: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .start-game-btn {
    width: 90%;
    font-size: 1rem;
  }
  
  .action-buttons-container {
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }
  
  .game-stats {
    gap: 1rem;
  }
  
  .secondary-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .secondary-btn {
    width: 80%;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .start-game-btn,
  .secondary-btn {
    transition: background-color 0.2s ease;
  }
  
  .start-game-btn:hover,
  .start-game-btn:focus {
    transform: none;
  }
  
  .leaderboard-btn {
    animation: none;
  }
  
  .start-game-btn.pulse {
    animation: none;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .start-game-btn:hover,
  .secondary-btn:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .start-game-btn {
    border: 2px solid white;
  }
  
  .secondary-btn {
    border-color: white;
  }
}
</style>