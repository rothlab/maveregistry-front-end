import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
    loginUser ({ commit }, credential) {
      // TODO: retrieve user info based on credential
      credential
      let user = {
        id: "user_1",
        first_name: "Kevin",
        last_name: "Kuang",
        auth_token: "anothertoken",
      }
      
      commit('loginUser', user)
    }
  },
  modules: {
  }
})
