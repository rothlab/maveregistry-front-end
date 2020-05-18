import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Import Backend API
import * as UserManage from "../api/userManage"

export default new Vuex.Store({
  state: {
    user: undefined,
    hasLoggedIn: false
  },
  mutations: {
    logoutUser(state) {
      state.hasLoggedIn = false
      state.user = undefined
    },
    loginUser(state, user) {
      state.hasLoggedIn = true
      state.user = user
    }
  },
  actions: {
    logoutUser ({ commit }) {
      commit('logoutUser')
    },
    async loginUser ({ commit }, credential) {
      // TODO: retrieve user info based on credential
      let res = Object;
      switch (credential.method) {
        case "password":
          res = await UserManage.loginUserPassword(credential.email, credential.password)
          break;
        default:
          break;
      }

      if (!res.error) {
        // Update user info if loggined in successfully
        commit('loginUser', res.user)
      } else {
        throw res.error
      }
    }
  },
  modules: {
  }
})
