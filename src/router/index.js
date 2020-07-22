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

  // Project related
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
    component: () => import(/* webpackChunkName: "project edit" */ '../views/Project/ProjectEdit.vue')
  },
  {
    path: '/project/:id',
    name: 'Project View',
    component: () => import(/* webpackChunkName: "project view" */ '../views/Project/ProjectView.vue')
  },

  // User profile related
  {
    path: '/user/:username',
    name: 'User Profile View',
    component: () => import(/* webpackChunkName: "user proile view" */ '../views/Profile/UserProfileView.vue')
  },
  {
    path: '/user/:username/:action',
    name: 'User Profile Edit',
    component: () => import(/* webpackChunkName: "user profile edit" */ '../views/Profile/UserProfileEdit.vue')
  },

  // Team related
  {
    path: '/teams',
    name: 'Teams',
    component: () => import(/* webpackChunkName: "teams" */ '../views/Team/TeamList.vue')
  },
  {
    path: '/team/:id',
    name: 'Team View',
    component: () => import(/* webpackChunkName: "team view" */ '../views/Team/TeamView.vue')
  },
  {
    path: '/team/:id/:action',
    name: 'Team Edit',
    component: () => import(/* webpackChunkName: "team edit" */ '../views/Team/TeamEdit.vue')
  },

  // Nomination related
  {
    path: '/nominations',
    name: 'Nominations',
    component: () => import(/* webpackChunkName: "nominations" */ '../views/Nomination/NominationList.vue')
  },

  // Moderation related
  {
    path: '/moderation',
    name: 'Moderation',
    component: () => import(/* webpackChunkName: "moderation" */ '../views/Moderation/ModerationHome.vue')
  },

  // Policy related
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/Policy/PolicyAbout.vue')
  },
  {
    path: '/policy/terms',
    name: 'Terms',
    component: () => import(/* webpackChunkName: "terms" */ '../views/Policy/PolicyTerms.vue')
  },
  {
    path: '/policy/privacy',
    name: 'Privacy',
    component: () => import(/* webpackChunkName: "privacy" */ '../views/Policy/PolicyPrivacy.vue')
  },

  // Account related
  {
    path: '/reset_password',
    name: 'Reset Password',
    component: () => import(/* webpackChunkName: "reset password" */ '../views/Account/ResetPassword.vue')
  },
  {
    path: '/change_password',
    name: 'Change Password',
    component: () => import(/* webpackChunkName: "change password" */ '../views/Account/ChangePassword.vue')
  },
  {
    path: '/reset_password_success',
    name: 'Reset Password Successful',
    component: () => import(/* webpackChunkName: "reset password success" */ '../views/Account/ResetPassword.vue'),
    props: { showSuccess: true }
  },
  {
    path: '/validate_email_success',
    name: 'Validate Email Successful',
    component: () => import(/* webpackChunkName: "validate email success" */ '../views/Account/ValidateEmail.vue'),
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
