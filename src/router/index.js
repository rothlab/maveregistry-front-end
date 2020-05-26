import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "projects" */ '../views/Projects.vue')
  },
  // User management related
  {
    path: '/profile/:username',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
  },
  {
    path: '/reset_password',
    name: 'Reset Password',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "profile" */ '../views/ResetPassword.vue')
  },
  {
    path: '/callback/:method/:action',
    name: 'Callback',
    meta: { hideNav: true, hideFooter: true },
    component: () => import(/* webpackChunkName: "callback" */ '../views/Callback.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  linkExactActiveClass: 'is-active'
})

export default router
