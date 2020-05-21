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
    async logoutUser ({ commit }) {
      const res = await UserManage.logoutUser()

      if (res.error) {
        throw res.error
      }

      // Logout user no matter what
      commit('logoutUser')
    },
    async loginUserPassword ({ commit }, credential) {
      let res = new Object;
      res = await UserManage.loginUserPassword(credential.username, credential.password)

      if (!res.error) {
        // Update user info if loggined in successfully
        commit('loginUser', res.user)
      } else {
        throw res.error
      }
    },
    async loginUserCache ({ commit }) {
      const res = await UserManage.loginUserCache()

      if (res.user) {
        // Update user info if loggined in successfully
        commit('loginUser', res.user)
      }
    },
    async signupUserPassword ({ commit }, userInfo) {
      let res = new Object;
      res = await UserManage.signupUserPassword(userInfo.username, userInfo.email, userInfo.password, 
        userInfo.first_name, userInfo.last_name)

      if (!res.error) {
        // Update user info if loggined in successfully
        commit('loginUser', res.user)
      } else {
        throw res.error
      }
    },
    async signupLoginUserGoogle ({ commit }, userInfo) {
      let res = new Object;
      res = await UserManage.signupLoginUserGoogle(userInfo)
      
      if (!res.error) {
        // Update user info if loggined in successfully
        commit('loginUser', res.user)
      } else {
        throw res.error
      }
    },
  },
  modules: {
  }
})
