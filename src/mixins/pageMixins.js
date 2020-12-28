// Source: https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863

function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? 'Mave Registry - ' + title.call(vm)
      : 'Mave Registry - ' + title
  }
}

// language exceptions
const exceptions = {
	"are": "were",
	"eat": "ate",
	"go": "went",
	"have": "had",
	"inherit": "inherited",
	"is": "was",
	"run": "ran",
	"sit": "sat",
  "visit": "visited",
  "cancel": "cancelled"
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
      return this.$route.hash && this.$route.hash.split('?')[0] === action
    },
    getPastTense(verb) {
      // Rules from here: https://gist.github.com/letsgetrandy/1e05a68ea74ba6736eb5
      if (exceptions[verb]) return exceptions[verb]
      if ((/e$/i).test(verb)) return verb + 'd'
      if ((/[aeiou]c/i).test(verb)) return verb + 'ked'
      if ((/el$/i).test(verb)) return verb + 'ed' // for american english only
      if ((/[aeio][aeiou][dlmnprst]$/).test(verb)) return verb + 'ed'
      if ((/[aeiou][bdglmnprst]$/i).test(verb)) return verb.replace(/(.+[aeiou])([bdglmnprst])/, '$1$2$2ed');
      return verb + 'ed'
    }
  }
}