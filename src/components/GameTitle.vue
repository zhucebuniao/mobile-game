<template>
  <div class="game-title-container">
    <div class="title-wrapper" :class="{ 'animate-in': isLoaded }">
      <h1 class="game-title">{{ title }}</h1>
      <p v-if="description" class="game-subtitle">{{ description }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'GameTitle',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  setup() {
    const isLoaded = ref(false)

    onMounted(() => {
      // Trigger animation after mount
      setTimeout(() => {
        isLoaded.value = true
      }, 100)
    })

    return {
      isLoaded
    }
  }
}
</script>

<style scoped>
.game-title-container {
  text-align: center;
  padding: 2rem 1rem;
}

.title-wrapper {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.title-wrapper.animate-in {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.game-title {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.game-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.02em;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .game-title {
    font-size: 2.5rem;
  }
  
  .game-subtitle {
    font-size: 1.1rem;
  }
  
  .game-title-container {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 2rem;
  }
  
  .game-subtitle {
    font-size: 1rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .title-wrapper {
    transition: opacity 0.3s ease;
    transform: none;
  }
  
  .title-wrapper.animate-in {
    transform: none;
  }
}
</style>