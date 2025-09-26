<template>
  <div class="loading-intro" :class="{ 'fade-out': isComplete }">
    <div class="story-container">
      <!-- Animated logo/title -->
      <div class="main-title" :class="{ 'animate': showTitle }">
        <h1 class="title-text">
          <span class="title-word" v-for="(word, index) in titleWords" :key="index" 
                :style="{ animationDelay: (index * 0.3) + 's' }">
            {{ word }}
          </span>
        </h1>
      </div>
      
      <!-- Story narrative -->
      <div class="story-narrative" :class="{ 'show': showStory }">
        <p class="narrative-text" v-for="(line, index) in storyLines" :key="index"
           :class="{ 'visible': currentLine >= index }"
           :style="{ animationDelay: (index * 1.2) + 's' }">
          {{ line }}
        </p>
      </div>
      
      <!-- Interactive loading progress -->
      <div class="loading-section" :class="{ 'show': showLoading }">
        <div class="loading-puzzle">
          <div class="puzzle-grid">
            <div v-for="(cell, index) in loadingCells" :key="index"
                 class="loading-cell"
                 :class="{ 'filled': cell.filled, 'glowing': cell.glowing }"
                 :style="{ animationDelay: (index * 0.1) + 's' }">
            </div>
          </div>
        </div>
        
        <div class="loading-text">
          <span class="loading-dots">{{ loadingText }}</span>
          <div class="progress-percentage">{{ Math.round(loadingProgress) }}%</div>
        </div>
      </div>
      
      <!-- Call to action hint -->
      <div class="interaction-hint" :class="{ 'show': showHint }">
        <div class="hint-content">
          <div class="tap-icon">
            <div class="tap-circle"></div>
            <div class="tap-ripple"></div>
          </div>
          <p class="hint-text">点击任意位置开始探索</p>
        </div>
      </div>
    </div>
    
    <!-- Skip button -->
    <button @click="skipIntro" class="skip-btn" aria-label="跳过介绍">
      <span class="skip-text">跳过</span>
      <svg class="skip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
    
    <!-- Background particles for ambiance -->
    <div class="ambient-particles">
      <div v-for="n in 15" :key="n" class="particle" 
           :style="{ 
             left: Math.random() * 100 + '%',
             animationDelay: Math.random() * 3 + 's',
             animationDuration: (Math.random() * 3 + 2) + 's'
           }">
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'LoadingIntro',
  emits: ['intro-complete', 'intro-skipped'],
  setup(props, { emit }) {
    const isComplete = ref(false)
    const showTitle = ref(false)
    const showStory = ref(false)
    const showLoading = ref(false)
    const showHint = ref(false)
    const currentLine = ref(-1)
    const loadingProgress = ref(0)
    const loadingText = ref('加载中')
    
    const titleWords = ['游戏', '世界', '等你', '探索']
    const storyLines = [
      '在这个神奇的数字世界里',
      '隐藏着无数等待发现的秘密',
      '只有通过智慧和勇气',
      '才能解锁所有的可能性...'
    ]
    
    const loadingCells = ref([])
    const gridSize = 25 // 5x5 grid
    
    const initializeLoadingGrid = () => {
      const cells = []
      for (let i = 0; i < gridSize; i++) {
        cells.push({
          filled: false,
          glowing: false
        })
      }
      loadingCells.value = cells
    }
    
    const animateLoadingGrid = () => {
      let filledCount = 0
      const interval = setInterval(() => {
        if (filledCount < gridSize) {
          // Fill random unfilled cell
          const unfilledIndices = loadingCells.value
            .map((cell, index) => cell.filled ? null : index)
            .filter(index => index !== null)
          
          if (unfilledIndices.length > 0) {
            const randomIndex = unfilledIndices[Math.floor(Math.random() * unfilledIndices.length)]
            loadingCells.value[randomIndex].filled = true
            loadingCells.value[randomIndex].glowing = true
            
            // Remove glow effect after a short delay
            setTimeout(() => {
              if (loadingCells.value[randomIndex]) {
                loadingCells.value[randomIndex].glowing = false
              }
            }, 300)
            
            filledCount++
            loadingProgress.value = (filledCount / gridSize) * 100
          }
        } else {
          clearInterval(interval)
          // Show completion hint after a brief delay
          setTimeout(() => {
            showHint.value = true
          }, 500)
        }
      }, 150)
    }
    
    const startIntroSequence = () => {
      // Show title first
      setTimeout(() => {
        showTitle.value = true
      }, 500)
      
      // Show story after title
      setTimeout(() => {
        showStory.value = true
        // Animate story lines
        const lineInterval = setInterval(() => {
          currentLine.value++
          if (currentLine.value >= storyLines.length) {
            clearInterval(lineInterval)
            // Start loading section after story
            setTimeout(() => {
              showLoading.value = true
              animateLoadingGrid()
            }, 1000)
          }
        }, 1200)
      }, 2000)
      
      // Animate loading text dots
      let dotCount = 0
      const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4
        loadingText.value = '加载中' + '.'.repeat(dotCount)
      }, 500)
      
      // Clean up interval when component unmounts or completes
      setTimeout(() => {
        clearInterval(dotInterval)
      }, 15000)
    }
    
    const skipIntro = () => {
      isComplete.value = true
      setTimeout(() => {
        emit('intro-skipped')
      }, 300)
    }
    
    const completeIntro = () => {
      isComplete.value = true
      setTimeout(() => {
        emit('intro-complete')
      }, 300)
    }
    
    onMounted(() => {
      initializeLoadingGrid()
      startIntroSequence()
      
      // Auto-complete after reasonable duration
      setTimeout(() => {
        if (!isComplete.value) {
          completeIntro()
        }
      }, 12000)
      
      // Listen for click to complete intro early
      const handleClick = () => {
        if (showHint.value && !isComplete.value) {
          completeIntro()
          document.removeEventListener('click', handleClick)
        }
      }
      
      setTimeout(() => {
        document.addEventListener('click', handleClick)
      }, 8000)
    })
    
    return {
      isComplete,
      showTitle,
      showStory,
      showLoading,
      showHint,
      currentLine,
      loadingProgress,
      loadingText,
      titleWords,
      storyLines,
      loadingCells,
      skipIntro
    }
  }
}
</script>

<style scoped>
.loading-intro {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
}

.loading-intro.fade-out {
  opacity: 0;
  pointer-events: none;
}

.story-container {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.main-title {
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.main-title.animate {
  opacity: 1;
  transform: translateY(0);
}

.title-text {
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #4ade80 0%, #06d6a0 50%, #4ade80 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(74, 222, 128, 0.3);
}

.title-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: wordSlideIn 0.8s ease forwards;
}

.story-narrative {
  margin-bottom: 3rem;
  opacity: 0;
  transition: opacity 1s ease;
}

.story-narrative.show {
  opacity: 1;
}

.narrative-text {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.8s ease;
}

.narrative-text.visible {
  opacity: 1;
  transform: translateX(0);
}

.loading-section {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  margin-bottom: 3rem;
}

.loading-section.show {
  opacity: 1;
  transform: translateY(0);
}

.loading-puzzle {
  margin-bottom: 2rem;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  max-width: 150px;
  margin: 0 auto;
}

.loading-cell {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.loading-cell.filled {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.loading-cell.glowing {
  animation: cellGlow 0.6s ease;
  transform: scale(1.2);
}

.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loading-dots {
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 80px;
}

.progress-percentage {
  font-size: 2rem;
  font-weight: 700;
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.interaction-hint {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.interaction-hint.show {
  opacity: 1;
  transform: translateY(0);
}

.hint-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tap-icon {
  position: relative;
  width: 60px;
  height: 60px;
}

.tap-circle {
  width: 20px;
  height: 20px;
  background: #4ade80;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.6);
}

.tap-ripple {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(74, 222, 128, 0.6);
  border-radius: 50%;
  animation: tapRipple 2s ease-in-out infinite;
}

.hint-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.skip-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 3;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.skip-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.skip-icon {
  width: 16px;
  height: 16px;
}

.ambient-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(74, 222, 128, 0.6);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

/* Animations */
@keyframes wordSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cellGlow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }
  50% {
    transform: scale(1.3);
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }
}

@keyframes tapRipple {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .story-container {
    padding: 1.5rem;
  }
  
  .title-text {
    font-size: 2.5rem;
  }
  
  .narrative-text {
    font-size: 1.1rem;
  }
  
  .skip-btn {
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .story-container {
    padding: 1rem;
  }
  
  .title-text {
    font-size: 2rem;
  }
  
  .narrative-text {
    font-size: 1rem;
  }
  
  .progress-percentage {
    font-size: 1.5rem;
  }
  
  .puzzle-grid {
    max-width: 120px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .title-word,
  .narrative-text,
  .loading-section,
  .interaction-hint {
    animation: none;
    transition: opacity 0.3s ease;
  }
  
  .loading-cell.glowing {
    animation: none;
    transform: none;
  }
  
  .particle {
    animation: none;
    opacity: 0.3;
  }
  
  .tap-ripple {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .loading-intro {
    background: #000;
  }
  
  .title-text {
    background: #fff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .skip-btn {
    border-color: white;
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>