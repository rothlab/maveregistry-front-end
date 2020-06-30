import * as NotificationManage from "@/api/notificationManage.js"

export const state = {
  messages: []
}

export const getters = {
  getNotifications: state => {
    return state.messages.sort((a, b) => b.time - a.time)
  },
  countNotifications: state => {
    return state.messages.length
  }
}

export const mutations = {
  addNotification(state, item) {
    state.messages.unshift(item)
  },
  removeNotification(state, id) {
    state.messages = state.messages.filter(e => e.id !== id)
  }
}

export const actions = {
  async subscribeToNotifications({ commit }) {
    await NotificationManage.subscribe(commit)
  }
}