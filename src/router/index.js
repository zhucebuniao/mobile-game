import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import GameDetailPage from '../views/GameDetailPage.vue'
import GamePlayPage from '../views/GamePlayPage.vue'
import LeaderboardPage from '../views/LeaderboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/game/:id',
      name: 'game-detail',
      component: GameDetailPage,
      props: true
    },
    {
      path: '/play/:id',
      name: 'game-play',
      component: GamePlayPage,
      props: true
    },
    {
      path: '/leaderboard/:id',
      name: 'leaderboard',
      component: LeaderboardPage,
      props: true
    }
  ]
})

export default router