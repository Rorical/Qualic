import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('../views/Main.vue')
    },
    {
      path: '/editor/visual',
      name: 'Visual',
      component: () => import('../views/Editor/Visual.vue')
    },
    {
      path: '/editor/text',
      name: 'Text',
      component: () => import('../views/Editor/Text.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Settings.vue')
    }
  ]
})

export default router
