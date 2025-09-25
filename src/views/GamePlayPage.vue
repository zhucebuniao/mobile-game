<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <header class="bg-gray-800 p-4 flex justify-between items-center">
      <h1 v-if="game" class="text-white text-xl font-semibold">{{ game.title }}</h1>
      <div class="flex gap-2">
        <router-link 
          :to="`/leaderboard/${id}`"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium min-h-[48px] min-w-[48px] flex items-center transition-colors"
        >
          Leaderboard
        </router-link>
        <router-link 
          :to="`/game/${id}`"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium min-h-[48px] min-w-[48px] flex items-center transition-colors"
        >
          Back
        </router-link>
      </div>
    </header>

    <main class="flex-1 relative">
      <div v-if="game" class="w-full h-full">
        <iframe 
          ref="gameFrame"
          :src="game.entry"
          class="w-full h-full border-0"
          @load="onGameLoad"
        ></iframe>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-white text-xl">Loading game...</p>
      </div>
    </main>

    <!-- Game End Modal -->
    <div 
      v-if="showScoreModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-center">Game Over!</h2>
        <p class="text-xl text-center mb-6">Your Score: <span class="font-bold text-blue-600">{{ finalScore }}</span></p>
        <div class="flex flex-col gap-3">
          <button 
            @click="playAgain"
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium min-h-[48px] transition-colors"
          >
            Play Again
          </button>
          <router-link 
            :to="`/leaderboard/${id}`"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center min-h-[48px] transition-colors"
          >
            View Leaderboard
          </router-link>
          <router-link 
            :to="`/game/${id}`"
            class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium text-center min-h-[48px] transition-colors"
          >
            Back to Game Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'GamePlayPage',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const game = ref(null)
    const gameFrame = ref(null)
    const showScoreModal = ref(false)
    const finalScore = ref(0)

    const loadGame = async () => {
      try {
        const response = await fetch('/games.json')
        if (response.ok) {
          const games = await response.json()
          game.value = games.find(g => g.id === props.id)
        }
      } catch (error) {
        console.error('Failed to load game:', error)
      }
    }

    const handleGameMessage = (event) => {
      // Listen for game end messages from iframe
      if (event.data && event.data.type === 'END' && typeof event.data.score === 'number') {
        finalScore.value = event.data.score
        saveScore(event.data.score)
        showScoreModal.value = true
      }
    }

    const saveScore = (score) => {
      const storageKey = `leaderboard_${props.id}`
      const existingScores = JSON.parse(localStorage.getItem(storageKey) || '[]')
      
      const newScore = {
        score: score,
        timestamp: new Date().toISOString(),
        id: Date.now() // Simple ID generation
      }
      
      existingScores.push(newScore)
      existingScores.sort((a, b) => b.score - a.score) // Sort by score descending
      
      // Keep only top 10 scores
      const topScores = existingScores.slice(0, 10)
      localStorage.setItem(storageKey, JSON.stringify(topScores))
    }

    const playAgain = () => {
      showScoreModal.value = false
      // Reload the iframe to restart the game
      if (gameFrame.value && game.value) {
        gameFrame.value.src = game.value.entry
      }
    }

    const onGameLoad = () => {
      console.log('Game loaded successfully')
    }

    onMounted(() => {
      loadGame()
      window.addEventListener('message', handleGameMessage)
    })

    onUnmounted(() => {
      window.removeEventListener('message', handleGameMessage)
    })

    return {
      game,
      gameFrame,
      showScoreModal,
      finalScore,
      playAgain,
      onGameLoad
    }
  }
}
</script>