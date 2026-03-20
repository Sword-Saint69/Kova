import { createRouter, createWebHistory } from 'vue-router';
import { authClient } from '../utils/auth';

const routes = [
  { path: '/',         component: () => import('../views/Landing.vue')  },
  { path: '/register',  component: () => import('../views/Register.vue') },
  { path: '/login',     component: () => import('../views/Login.vue')    },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to, from, next) => {
  // Use a fresh fetch to avoid race conditions right after sign-in
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      cache: "no-cache"
    }
  });
  const isAuthenticated = !!session;

  // Re-route authenticated users away from auth pages
  if (isAuthenticated && ['/login', '/register'].includes(to.path)) {
    return next('/dashboard');
  }

  // Also re-route authenticated users from landing if they are logged in
  if (isAuthenticated && to.path === '/') {
    return next('/dashboard');
  }

  // Re-route unauthenticated users from protected pages
  if (!isAuthenticated && to.meta.requiresAuth) {
    return next('/login');
  }

  next();
});

export default router;
