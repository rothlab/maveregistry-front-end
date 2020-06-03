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
    component: () => import(/* webpackChunkName: "projects" */ '../views/Project/ProjectList.vue')
  },
  {
    path: '/project/:id/:action',
    name: 'Project Edit',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "project edit" */ '../views/Project/ProjectEdit.vue')
  },
  {
    path: '/project/:id',
    name: 'Project View',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "project view" */ '../views/Project/ProjectView.vue')
  },
  // User management related
  {
    path: '/user/:username',
    name: 'User Profile View',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/Profile/UserProfileEdit.vue')
  },
  {
    path: '/user/:username/:action',
    name: 'User Profile Edit',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/Profile/UserProfileView.vue')
  },
  {
    path: '/team/:id',
    name: 'Team',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/Profile/TeamProfile.vue')
  },
  {
    path: '/reset_password',
    name: 'Reset Password',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "resetPass" */ '../views/ResetPassword.vue')
  },
  {
    path: '/change_password',
    name: 'Change Password',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "changePass" */ '../views/ChangePassword.vue')
  },
  {
    path: '/reset_password_success',
    name: 'Reset Password Successful',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "resetPass" */ '../views/ResetPassword.vue'),
    props: { showSuccess: true }
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
