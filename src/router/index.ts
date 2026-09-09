import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '/template-view',
          component: () => import('@/views/template-view/template-view.vue'),
        },
      ],
    },
  ],
})

export default router
