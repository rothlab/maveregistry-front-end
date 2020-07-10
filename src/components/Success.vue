<template>
  <div class="success-display">
    <div class="success-icon">
      <span
        class="mdil mdil-check"
        :class="{ 'has-text-success': isSuccess }"
      />
    </div>
    <h1 :class="{ 'has-text-success': isSuccess }">
      {{ isSuccess ? 'Success' : 'Info' }}
    </h1>
    <h2 :class="{ 'has-text-success': isSuccess }">
      {{ message }}
    </h2>
    <p>
      <b-button
        type="is-primary"
        outlined
        tag="router-link"
        :to="redirectLink"
      >
        Return to {{ redirectDescription }} <span v-if="redirectTimer > 0">in {{ countDown }} second{{ countDown > 1 ? 's' : '' }}</span>
      </b-button>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    isSuccess: {
      type: Boolean,
      default: true
    },
    redirectDescription: {
      type: String,
      default: "Homepage"
    },
    redirectLink: {
      type: String,
      default: "/"
    },
    redirectTimer: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      countDown: 0
    }
  },
  mounted () {
    this.countDown = this.redirectTimer

    if (this.countDown > 0) {
      const timer = setInterval(() => {
        this.countDown -= 1
        if (this.countDown < 1) {
          this.$router.push({ path: this.redirectLink })
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="sass" scoped>
  .success-display
    position: absolute
    top: 50%
    transform: translateY(-50%)
    left: 40%
    max-width: 560px
    width: 100%
    padding-left: 160px
    line-height: 1
    .success-icon
      position: absolute
      left: 0
      top: 0
      display: inline-block
      width: 140px
      height: 140px
      span
        font-size: 140px
      &::before
        content: ''
        position: absolute
        width: 100%
        height: 100%
        transform: scale(2.4)
        border-radius: 50%
        background-color: #f2f5f8
        z-index: -1
    h1
      font-size: 65px
      font-weight: bold
      margin-top: 0px
      margin-bottom: 10px
      color: #151723
      text-transform: uppercase
      padding-top: 0.75rem
    h2
      font-size: 21px
      font-weight: medium
      margin: 0
      text-transform: uppercase
      color: #151723
    p
      margin: 1rem 0
      color: #999fa5
      font-weight: lighter
</style>