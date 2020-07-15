import * as UserManage from "@/api/userManage.js"
import { handleError } from '@/api/errorHandler.js';
import { SnackbarProgrammatic as Snackbar } from 'buefy'
import { ToastProgrammatic as Toast } from 'buefy'

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
  getUser: state => {
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
  setUser(state, user) {
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

    commit('setUser', user)
  },
  async loginUserCache ({ commit }) {
    const user = await UserManage.loginUserCache()

    // Update user info if loggined in successfully
    commit('setUser', user)
  },
  async signupUserPassword ({ commit }, userInfo) {
    const user = await UserManage.signupUserPassword(userInfo)

    // Update user info if loggined in successfully
    commit('setUser', user)
  },
  async signupLoginUserGoogle ({ commit }, userInfo) {
    const user = await UserManage.signupLoginUserGoogle(userInfo)
    
    // Update user info if loggined in successfully
    commit('setUser', user)
  },
  async signupLoginUserOrcid ({ commit }, userInfo) {
    try {
      const user = await UserManage.signupLoginUserOrcid(userInfo)
      
      if (user && user.email) {
        // Update user info if loggined in successfully
        commit('setUser', user)
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
              await UserManage.resendValidationEmail(error.username)
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
    commit('setUser', user)
  },
  async getRoles ({ commit }) {
    const roles = await UserManage.getRoles()

    // Update user roles
    commit('setRoles', roles)
  },
  async syncUserProfile ({ commit }) {
    const user = this.getters.getUser
    if (user && user.username) {
      const userInfo = await UserManage.fetchUserInfo(user.username)

      // Update user info
      commit('setUser', userInfo)
    }
  }
}