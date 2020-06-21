<template>
  <div>
    <div class="container has-fullheight-no-header has-top-padding has-touch-container-padding">
      <div class="columns is-centered has-vcentered-page">
        <div class="column is-5">
          <div>
            <Success message="Your email has been validated" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Success from "@/components/Success.vue"

export default {
  props: {
    showSuccess: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Success
  },
  data () {
    return {
      email: "",
      isActionLoading: false,
      hasReset: false
    }
  }
}
</script>