<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
        <h2 v-if="game" class="text-xl text-gray-600">{{ game.title }}</h2>
      </header>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div v-if="scores.length > 0">
          <div class="space-y-3">
            <div 
              v-for="(score, index) in scores" 
              :key="score.id"
              class="flex items-center justify-between p-4 rounded-lg border"
              :class="getRankClass(index)"
            >
              <div class="flex items-center gap-4">
                <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-white"
                     :class="getRankBadgeClass(index)">
                  {{ index + 1 }}
                </div>
                <div>
                  <div class="font-semibold">Score: {{ score.score }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(score.timestamp) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <button 
              @click="clearScores"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium min-h-[48px] transition-colors"
            >
              Clear All Scores
            </button>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500 mb-4">No scores recorded yet.</p>
          <router-link 
            :to="`/play/${id}`"
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium min-h-[48px] inline-block transition-colors"
          >
            Play First Game
          </router-link>
        </div>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          :to="`/play/${id}`"
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-center min-h-[48px] transition-colors"
        >
          Play Game
        </router-link>
        <router-link 
          :to="`/game/${id}`"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center min-h-[48px] transition-colors"
        >
          Game Details
        </router-link>
        <router-link 
          to="/"
          class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium text-center min-h-[48px] transition-colors"
        >
          All Games
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'LeaderboardPage',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const game = ref(null)
    const scores = ref([])

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

    const loadScores = () => {
      const storageKey = `leaderboard_${props.id}`
      const savedScores = JSON.parse(localStorage.getItem(storageKey) || '[]')
      scores.value = savedScores
    }

    const clearScores = () => {
      if (confirm('Are you sure you want to clear all scores? This action cannot be undone.')) {
        const storageKey = `leaderboard_${props.id}`
        localStorage.removeItem(storageKey)
        scores.value = []
      }
    }

    const getRankClass = (index) => {
      switch (index) {
        case 0: return 'bg-yellow-50 border-yellow-200'
        case 1: return 'bg-gray-50 border-gray-200'
        case 2: return 'bg-orange-50 border-orange-200'
        default: return 'bg-white border-gray-200'
      }
    }

    const getRankBadgeClass = (index) => {
      switch (index) {
        case 0: return 'bg-yellow-500'
        case 1: return 'bg-gray-500'
        case 2: return 'bg-orange-500'
        default: return 'bg-blue-500'
      }
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString() + ' ' + 
             new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onMounted(() => {
      loadGame()
      loadScores()
    })

    return {
      game,
      scores,
      clearScores,
      getRankClass,
      getRankBadgeClass,
      formatDate
    }
  }
}
</script>