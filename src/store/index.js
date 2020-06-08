import Vue from 'vue'
import Vuex from 'vuex'
import createMutationsSharer from "vuex-shared-mutations";

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
      if (user) {
        state.hasLoggedIn = true
        state.user = user
      }
    }
  },
  actions: {
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
      const user = await UserManage.signupLoginUserOrcid(userInfo)

      if (!user && !!user.hasEmail) {
        // Update user info if loggined in successfully
        commit('loginUser', user)
        return user
      }
    },
    async updateUserProfile ({ commit }, userInfo) {
      const user = await UserManage.updateUserProfile(userInfo)

      // Update user info if loggined in successfully
      commit('loginUser', user)
    }
  },
  modules: {
  },
  plugins: [
    createMutationsSharer({
      predicate: ['loginUser', 'logoutUser']
    })
  ]
})
