<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Mobile Game Collection</h1>
        <p class="text-gray-600">Choose a game to play</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="game in games" 
          :key="game.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img 
            :src="game.thumbnail" 
            :alt="game.title"
            class="w-full h-48 object-cover"
            @error="handleImageError"
          >
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ game.title }}</h3>
            <p class="text-gray-600 mb-4">{{ game.description }}</p>
            <router-link 
              :to="`/game/${game.id}`"
              class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium min-h-[48px] min-w-[48px] transition-colors"
            >
              Play Game
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="games.length === 0" class="text-center py-12">
        <p class="text-gray-500">No games available at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'HomePage',
  setup() {
    const games = ref([])

    const loadGames = async () => {
      try {
        const response = await fetch('/games.json')
        if (response.ok) {
          games.value = await response.json()
        }
      } catch (error) {
        console.error('Failed to load games:', error)
      }
    }

    const handleImageError = (event) => {
      // Set a placeholder image if the game thumbnail fails to load
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbWUgSW1hZ2U8L3RleHQ+PC9zdmc+'
    }

    onMounted(() => {
      loadGames()
    })

    return {
      games,
      handleImageError
    }
  }
}
</script>