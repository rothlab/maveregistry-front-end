export default {
  computed: {
    hasLoggedIn() {
      return this.$store.getters.hasLoggedIn
    },
    isModerator() {
      return this.$store.getters.hasRole("moderator")
    },
    isMember() {
      return this.$store.getters.hasRole("member")
    },
    currentUser() {
      return this.$store.getters.getUser
    }
  },
  methods: {
    profileImageUrl(user) {
      // Set url as placeholder
      let url
      if (!user || !user.profile_image) return require("@/assets/image/blank-profile.png")

      if (typeof user.profile_image === "string") {
        url = user.profile_image
      } else {
        url = user.profile_image.url()
      }

      return url
    }
  }
}