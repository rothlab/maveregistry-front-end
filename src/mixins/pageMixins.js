// Source: https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863

function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? 'Mave Registry - ' + title.call(vm)
      : 'Mave Registry - ' + title
  }
}

export default {
  created () {
    const title = getTitle(this)
    if (title) {
      document.title = title
    }
  },
  methods: {
    isAction(action) {
      return this.$route.params && this.$route.params.action === action
    },
    capitalize(string) {
      return string.slice(0,1).toUpperCase() + string.slice(1)
    },
    hasDeepLink(action) {
      return this.$route.hash === action
    },
    boldFind(text, find) {
      if (!find || find.length < 1) return this.capitalize(text)

      find = find.toLowerCase()
      if (!text.startsWith(find)) return this.capitalize(text)
      const trimmedText = text.replace(find, '')

      console.log(`<b>${text.startsWith(find) ? find : '' }</b>${trimmedText}`)
      return `<b>${text.startsWith(find) ? this.capitalize(find) : '' }</b>${trimmedText}`
    }
  }
}