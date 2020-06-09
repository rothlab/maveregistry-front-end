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
    component: () => import(/* webpackChunkName: "user proile view" */ '../views/Profile/UserProfileView.vue')
  },
  {
    path: '/user/:username/:action',
    name: 'User Profile Edit',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user profile edit" */ '../views/Profile/UserProfileEdit.vue')
  },
  {
    path: '/teams',
    name: 'Teams',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "teams" */ '../views/Team/TeamList.vue')
  },
  {
    path: '/reset_password',
    name: 'Reset Password',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "reset password" */ '../views/Account/ResetPassword.vue')
  },
  {
    path: '/change_password',
    name: 'Change Password',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "change password" */ '../views/Account/ChangePassword.vue')
  },
  {
    path: '/reset_password_success',
    name: 'Reset Password Successful',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "reset password success" */ '../views/Account/ResetPassword.vue'),
    props: { showSuccess: true }
  },
  {
    path: '/callback/:method/:action',
    name: 'Callback',
    meta: { hideNav: true, hideFooter: true },
    component: () => import(/* webpackChunkName: "callback" */ '../views/Account/Callback.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  linkExactActiveClass: 'is-active'
})

export default router
