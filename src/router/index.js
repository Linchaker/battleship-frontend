import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/Auth/LoginForm.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../components/Auth/RegistrationForm.vue'),
        },
      ],
    },

    {
      path: '/',
      name: 'home',
      meta: { auth: true },
      component: HomeView,
    },

    {
      path: '/game/:gameId',
      name: 'gameWithId',
      meta: { auth: true },
      component: () => import('../components/Game/Game.vue'),
    },
    {
      path: '/game',
      name: 'game',
      meta: { auth: true },
      component: () => import('../components/Game/Game.vue'),
    },

    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user') !== null;

  if (to.meta.auth && !isAuthenticated) {
    next('/auth/login');
  } else {
    next();
  }
});

export default router
