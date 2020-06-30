import * as UserManage from "../api/userManage"
import { handleError } from '../api/errorHandler';
import { SnackbarProgrammatic as Snackbar } from 'buefy'
import { ToastProgrammatic as Toast } from 'buefy'
import { resendValidationEmail } from "@/api/userManage.js"

export const state = {
  user: undefined,
  roles: []
}

export const getters = {
  hasLoggedIn: state => {
    return !!state.user
  },
  hasRole: (state) => (role) => {
    return state.roles.includes(role)
  },
  user: state => {
    return state.user
  },
  isOwner: (state, getters) => (owner) => {
    return getters.hasLoggedIn && state.user.username === owner
  }
}

export const mutations = {
  logoutUser(state) {
    state.user = undefined
  },
  loginUser(state, user) {
    if (user) state.user = user
  },
  setRoles(state, roles) {
    state.roles = roles
  }
}

export const actions = {
  async logoutUser ({ commit }) {
    // Logout user no matter what
    commit('logoutUser')
    
    await UserManage.logoutUser()
  },
  async loginUserPassword ({ commit }, credential) {
    const user = await UserManage.loginUserPassword(credential.username, credential.password)

    commit('loginUser', user)
  },
  async loginUserCache ({ commit }) {
    const user = await UserManage.loginUserCache()

    // Update user info if loggined in successfully
    commit('loginUser', user)
  },
  async signupUserPassword ({ commit }, userInfo) {
    const user = await UserManage.signupUserPassword(userInfo.username, userInfo.email, userInfo.password, 
      userInfo.first_name, userInfo.last_name)

    // Update user info if loggined in successfully
    commit('loginUser', user)
  },
  async signupLoginUserGoogle ({ commit }, userInfo) {
    const user = await UserManage.signupLoginUserGoogle(userInfo)
    
    // Update user info if loggined in successfully
    commit('loginUser', user)
  },
  async signupLoginUserOrcid ({ commit }, userInfo) {
    try {
      const user = await UserManage.signupLoginUserOrcid(userInfo)
      
      if (user && user.email) {
        // Update user info if loggined in successfully
        commit('loginUser', user)
      }

      return user
    } catch (e) {
      // Handle email verfication failure
      // This error needs to be handled separately because we need to provide user
      // an option to resend verification email
      const error = await handleError(e)

      if (error instanceof Object && error.action === "resend_email") {
        Snackbar.open({
          message: error.message,
          type: "is-danger",
          position: "is-top",
          queue: false,
          actionText: "Resend Verification Email",
          indefinite: true,
          onAction: async () => {
            try {
              await resendValidationEmail(error.username)
            } catch (err) {
              Toast.open({
                message: await handleError(err),
                duration: 5000,
                type: 'is-danger'
              })
              return
            }
            
            Toast.open({
              message: "Verification email sent",
              duration: 5000,
              type: 'is-success'
            })
          }
        })

        return "resend_email"
      } else {
        throw e
      }
    }
  },
  async updateUserProfile ({ commit }, userInfo) {
    const user = await UserManage.updateUserProfile(userInfo)

    // Update user info if loggined in successfully
    commit('loginUser', user)
  },
  async getRoles ({ commit }) {
    const roles = await UserManage.getRoles()

    // Update user roles
    commit('setRoles', roles)
  }
}