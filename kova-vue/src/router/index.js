import { createRouter, createWebHistory } from 'vue-router';
import { authClient } from '../utils/auth';

const routes = [
  { path: '/',         component: () => import('../views/Landing.vue')  },
  { path: '/register',  component: () => import('../views/Register.vue') },
  { path: '/login',     component: () => import('../views/Login.vue')    },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/habits/new', component: () => import('../views/NewHabit.vue'), meta: { requiresAuth: true } },
  { path: '/habits/:id', component: () => import('../views/HabitDetail.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  // Simple check for auth pages: if we are GOING TO login/register, let it through.
  // We'll handle the "redirect if already logged in" inside the components or a simpler guard.
  next();
});

export default router;
