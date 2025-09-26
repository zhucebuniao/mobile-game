<template>
  <div class="interactive-puzzle" @click="handleInteraction" @touchstart="handleTouch">
    <div class="puzzle-container" :class="{ 'completed': isCompleted }">
      <!-- Puzzle pieces that unlock as user interacts -->
      <div 
        v-for="(piece, index) in puzzlePieces" 
        :key="index"
        class="puzzle-piece"
        :class="{ 
          'unlocked': piece.unlocked, 
          'animated': piece.animated,
          'hover-effect': !piece.unlocked 
        }"
        :style="{ 
          left: piece.x + '%', 
          top: piece.y + '%',
          animationDelay: piece.delay + 's'
        }"
        @click.stop="unlockPiece(index)"
        @touchstart.stop="unlockPiece(index)"
      >
        <div class="piece-content">
          <svg v-if="!piece.unlocked" class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="7" r="4"/>
            <path d="M7 13v4"/>
            <path d="M17 13v4"/>
          </svg>
          <div v-else class="unlocked-content">
            <div class="glow-effect"></div>
            <span class="piece-text">{{ piece.text }}</span>
          </div>
        </div>
      </div>
      
      <!-- Central CTA that appears when puzzle is completed -->
      <transition name="cta-reveal">
        <div v-if="isCompleted" class="central-cta">
          <button 
            @click="handleCTAClick" 
            class="main-cta-btn"
            aria-label="开始探索游戏世界"
          >
            <span class="cta-text">开始探索</span>
            <div class="cta-glow"></div>
            <div class="ripple-effect"></div>
          </button>
        </div>
      </transition>
    </div>
    
    <!-- Progress indicator -->
    <div class="progress-indicator">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <div class="progress-text">{{ unlockedCount }}/{{ totalPieces }} 已解锁</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'InteractivePuzzle',
  emits: ['puzzle-completed', 'piece-unlocked', 'cta-clicked'],
  setup(props, { emit }) {
    const puzzlePieces = ref([])
    const isCompleted = ref(false)
    const totalPieces = 6
    
    const unlockedCount = computed(() => 
      puzzlePieces.value.filter(piece => piece.unlocked).length
    )
    
    const progressPercentage = computed(() => 
      (unlockedCount.value / totalPieces) * 100
    )
    
    const initializePuzzle = () => {
      const pieces = [
        { x: 20, y: 25, text: '探索', unlocked: false, animated: false, delay: 0 },
        { x: 65, y: 20, text: '挑战', unlocked: false, animated: false, delay: 0.2 },
        { x: 80, y: 55, text: '成长', unlocked: false, animated: false, delay: 0.4 },
        { x: 60, y: 75, text: '竞技', unlocked: false, animated: false, delay: 0.6 },
        { x: 25, y: 70, text: '乐趣', unlocked: false, animated: false, delay: 0.8 },
        { x: 10, y: 50, text: '创新', unlocked: false, animated: false, delay: 1.0 }
      ]
      
      puzzlePieces.value = pieces
    }
    
    const unlockPiece = (index) => {
      if (puzzlePieces.value[index].unlocked) return
      
      puzzlePieces.value[index].unlocked = true
      puzzlePieces.value[index].animated = true
      
      // Emit piece unlocked event for analytics
      emit('piece-unlocked', { index, piece: puzzlePieces.value[index] })
      
      // Add haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      // Check if puzzle is completed
      if (unlockedCount.value === totalPieces) {
        setTimeout(() => {
          isCompleted.value = true
          emit('puzzle-completed')
        }, 500)
      }
    }
    
    const handleInteraction = (event) => {
      // Create ripple effect at click/touch point
      createRippleEffect(event.clientX, event.clientY)
    }
    
    const handleTouch = (event) => {
      // Handle touch interactions for mobile
      if (event.touches.length === 1) {
        const touch = event.touches[0]
        createRippleEffect(touch.clientX, touch.clientY)
      }
    }
    
    const createRippleEffect = (x, y) => {
      const ripple = document.createElement('div')
      ripple.className = 'interaction-ripple'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      
      document.body.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 1000)
    }
    
    const handleCTAClick = () => {
      emit('cta-clicked')
    }
    
    onMounted(() => {
      initializePuzzle()
    })
    
    return {
      puzzlePieces,
      isCompleted,
      totalPieces,
      unlockedCount,
      progressPercentage,
      unlockPiece,
      handleInteraction,
      handleTouch,
      handleCTAClick
    }
  }
}
</script>

<style scoped>
.interactive-puzzle {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  cursor: crosshair;
  user-select: none;
}

.puzzle-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
}

.puzzle-piece {
  position: absolute;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.puzzle-piece.hover-effect:hover {
  transform: scale(1.1);
}

.puzzle-piece.unlocked {
  animation: pieceUnlock 0.8s ease-out forwards;
}

.puzzle-piece.animated {
  animation: pieceGlow 2s ease-in-out infinite alternate;
}

.piece-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.lock-icon {
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.6);
}

.unlocked-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glow-effect {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.piece-text {
  position: relative;
  z-index: 2;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.central-cta {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.main-cta-btn {
  position: relative;
  width: 160px;
  height: 60px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(74, 222, 128, 0.4);
}

.main-cta-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(74, 222, 128, 0.6);
}

.main-cta-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.cta-text {
  position: relative;
  z-index: 2;
}

.cta-glow {
  position: absolute;
  inset: -5px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 35px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-cta-btn:hover .cta-glow {
  opacity: 1;
}

.ripple-effect {
  position: absolute;
  inset: 0;
  border-radius: 30px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 50%);
  transform: scale(0);
  opacity: 0;
}

.main-cta-btn:active .ripple-effect {
  animation: ripple 0.6s ease-out;
}

.progress-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
  transition: width 0.5s ease;
  border-radius: 3px;
}

.progress-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Animations */
@keyframes pieceUnlock {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1.1) rotate(360deg);
    opacity: 1;
  }
}

@keyframes pieceGlow {
  0% {
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
  }
  100% {
    box-shadow: 0 0 30px rgba(74, 222, 128, 0.8);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.cta-reveal-enter-active {
  animation: ctaReveal 1s ease-out;
}

@keyframes ctaReveal {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Global ripple effect styles */
:global(.interaction-ripple) {
  position: fixed;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  animation: globalRipple 1s ease-out forwards;
}

@keyframes globalRipple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(10);
    opacity: 0;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .puzzle-piece {
    width: 60px;
    height: 60px;
  }
  
  .piece-text {
    font-size: 12px;
  }
  
  .main-cta-btn {
    width: 140px;
    height: 50px;
    font-size: 16px;
  }
  
  .progress-bar {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .puzzle-piece {
    width: 50px;
    height: 50px;
  }
  
  .lock-icon {
    width: 24px;
    height: 24px;
  }
  
  .piece-text {
    font-size: 10px;
  }
  
  .main-cta-btn {
    width: 120px;
    height: 45px;
    font-size: 14px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .puzzle-piece,
  .main-cta-btn {
    transition: background-color 0.2s ease;
  }
  
  .puzzle-piece:hover {
    transform: none;
  }
  
  .main-cta-btn:hover {
    transform: none;
  }
  
  .puzzle-piece.unlocked {
    animation: none;
  }
  
  .puzzle-piece.animated {
    animation: none;
  }
  
  .glow-effect {
    animation: none;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .puzzle-piece:hover {
    transform: none;
  }
  
  .main-cta-btn:hover {
    transform: none;
    box-shadow: 0 10px 30px rgba(74, 222, 128, 0.4);
  }
}
</style>