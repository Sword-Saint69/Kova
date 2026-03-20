import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../App.vue';

const routes = [
  { path: '/',         component: () => import('../views/Landing.vue')  },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/login',    component: () => import('../views/Login.vue')    },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});
