<template>
  <b-notification
    :closable="false"
    :active="isActive"
  >
    <div class="content">
      <b-icon
        class="header-icon"
        type="is-primary"
        custom-size="mdil-48px"
        icon="mdil-lightbulb-on"
      />
      <slot />
    </div>
    <b-button
      class="close-tip has-text-info"
      tag="a"
      type="is-light"
      size="is-small"
      @click="closeTip"
    >
      Do not show again
    </b-button>
  </b-notification>
</template>

<style lang="sass" scoped>
.close-tip
  display: inline
  position: absolute
  right: 1rem
  bottom: 1rem
</style>

<script>
export default {
  props: {
    tip: {
      type: String,
      required: true
    }
  },
  computed: {
    isActive() {
      return this.$store.getters.showTip(this.tip)
    }
  },
  methods: {
    closeTip() {
      this.$store.dispatch("hideTip", this.tip)
    }
  }
}
</script>