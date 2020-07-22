<template>
  <div>
    <!-- Header -->
    <div class="hero is-light">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  Moderate the Registry
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <UnderConstruction />
    </div>
  </div>
</template>

<script>
import UnderConstruction from "@/components/UnderConstruction.vue"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
  components: {
    UnderConstruction
  },
  async mounted() {
    // Throw a test error
    await displayErrorToast(new Error("test error"))
  }
}
</script>