// Source: https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863

function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
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
    }
  }
}