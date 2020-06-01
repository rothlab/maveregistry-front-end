<template>
  <div>
    <!-- Header -->
    <div class="hero is-light is-bold">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p
                  v-if="isNew"
                  class="is-size-3 has-text-weight-medium"
                >
                  Register New Project
                </p>
              </div>
            </div>
            <div
              v-if="isEdit"
              class="level-right"
            >
              <!-- Register new project -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-mobile"
                @click="isNewActivityModalActive = true"
              >
                Edit Project
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="isNewActivityModalActive = true"
              >
                Edit
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <div class="content">
        <p class="is-size-4">
          Project Information
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      target: {}
    }
  },
  computed: {
    isNew() {
      return this.$route.params.action === 'new'
    },
    isEdit() {
      return this.$route.params.action === 'edit'
    }
  }
}
</script>