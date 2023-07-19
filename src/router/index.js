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
      path: '/oauth',
      name: 'OAuth',
      redirect: '/oauth/google',
      children: [
        {
          path: 'google',
          name: 'login_google',
          component: () => import('../components/Auth/LoginGoogle.vue'),
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
      path: '/game/:gameId?',
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
  const gameId = to.params.gameId;


  if (to.meta.auth && !isAuthenticated) {
    if (gameId) {
      localStorage.setItem('gameId', gameId);
    }
    next('/auth/login');
  } else {
    next();
  }
});

export default router
