<template>
  <div class="error-display">
    <div class="error-icon">
      <span class="mdil mdil-alert-circle" />
    </div>
    <h1>{{ isSuccess ? 'Success' : 'Info' }}</h1>
    <h2>{{ message }}</h2>
    <p>
      <b-button
        type="is-primary"
        tag="router-link"
        to="/"
      >
        Return to Homepage
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
    }
  }
}
</script>

<style lang="sass" scoped>
  .error-display
    position: absolute
    top: 50%
    transform: translateY(-50%)
    left: 40%
    max-width: 560px
    width: 100%
    padding-left: 160px
    line-height: 1
    .error-icon
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