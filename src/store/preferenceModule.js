export const state = {
  hasAcceptedCookieConsent: false,
  showTip: {
    why_follow: true,
    team_help: true,
    nomination: true
  }
}

export const getters = {
  hasAcceptedCookieConsent: (state) => {
    return state.hasAcceptedCookieConsent
  },
  showTip: (state) => (tip) => {
    return !!state.showTip[tip]
  }
}

export const mutations = {
  setCookieConsent(state) {
    state.hasAcceptedCookieConsent = true
  },
  hideTip(state, tip) {
    if (state.showTip[tip]) state.showTip[tip] = false
  }
}

export const actions = {
  acceptCookieConsent({ commit }) {
    commit('setCookieConsent')
  },
  hideTip({ commit }, tip) {
    commit('hideTip', tip)
  }
}