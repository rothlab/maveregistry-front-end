<template>
  <transition
    name="slide-fade"
    appear
  >
    <div
      class="cookie-consent has-background-dark"
      v-if="!hasAcceptedCookieConsent"
    >
      <div class="level is-mobile">
        <div class="level-left">
          <p class="has-text-white">
            We use cookies to offer you a better experience. By using the Service, you agree to our
            <a
              href="/policy/terms"
              target="_blank"
              class="has-text-success"
            >Terms</a> and
            <a
              href="/policy/privacy"
              target="_blank"
              class="has-text-success"
            >Privacy Policy</a>.
          </p>
        </div>
        <div class="level-right">
          <b-button
            type="is-success"
            outlined
            @click="acceptCookieConsent"
          >
            I Accept
          </b-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    hasAcceptedCookieConsent() {
      return this.$store.getters.hasAcceptedCookieConsent
    }
  },
  data () {
    return {
      isActive : true
    }
  },
  methods: {
    acceptCookieConsent() {
      this.$store.dispatch("acceptCookieConsent")
      this.isActive = false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

.cookie-consent
  position: fixed
  bottom: 0
  width: 100%
  padding: 1rem 2rem
  z-index: 50
  transition: opacity 500ms
  .level .level-left
    @media screen and (max-width: $break-mobile)
      max-width: 60vw
    @media screen and (min-width: $break-mobile) and (max-width: $break-desktop)
      max-width: 75vw
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active, .slide-fade-leave-active 
  transition: all .3s ease-in-out
.slide-fade-enter, .slide-fade-leave-to
  transform: translateY(20%)
  opacity: 0
</style>