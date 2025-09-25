<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-2xl mx-auto">
      <div v-if="game" class="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          :src="game.thumbnail" 
          :alt="game.title"
          class="w-full h-64 object-cover"
          @error="handleImageError"
        >
        <div class="p-6">
          <h1 class="text-3xl font-bold mb-4">{{ game.title }}</h1>
          <p class="text-gray-600 mb-6 text-lg">{{ game.description }}</p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link 
              :to="`/play/${game.id}`"
              class="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium text-center min-h-[48px] transition-colors"
            >
              Start Game
            </router-link>
            <router-link 
              :to="`/leaderboard/${game.id}`"
              class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-center min-h-[48px] transition-colors"
            >
              View Leaderboard
            </router-link>
          </div>
          
          <div class="mt-6">
            <router-link 
              to="/"
              class="text-blue-500 hover:text-blue-600 font-medium"
            >
              ← Back to Games
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Game not found.</p>
        <router-link 
          to="/"
          class="text-blue-500 hover:text-blue-600 font-medium mt-4 inline-block"
        >
          ← Back to Games
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'GameDetailPage',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const game = ref(null)

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

    const handleImageError = (event) => {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbWUgSW1hZ2U8L3RleHQ+PC9zdmc+'
    }

    onMounted(() => {
      loadGame()
    })

    return {
      game,
      handleImageError
    }
  }
}
</script>