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
    },
  },
  actions: {
    logoutUser ({ commit }) {
      commit('logoutUser')
    },
    async loginUser ({ commit }, credential) {
      let res = new Object;
      switch (credential.method) {
        case "password":
          res = await UserManage.loginUserPassword(credential.username, credential.password)
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
    },
    async signupUser ({ commit }, userInfo) {
      let res = new Object;
      switch (userInfo.method) {
        case "password":
          res = await UserManage.signupUserPassword(userInfo.username, userInfo.email, userInfo.password, 
            userInfo.first_name, userInfo.last_name)
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
