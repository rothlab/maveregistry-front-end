<template>
  <div class="action-buttons">
    <b-button
      icon-left="mdil-lock"
      type="is-light"
      expanded
      @click="resetPassword"
      :loading="isLoading"
    >
      Reset Password
    </b-button>
    <b-button
      icon-left="mdil-delete"
      type="is-light"
      expanded
      disabled
    >
      Delete Account (Under Dev.)
    </b-button>
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import { handleError } from "@/api/errorHandler.js"

export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    async resetPassword() {
      try {
        this.isLoading = true

        await UserManage.resetPassword(this.email)

        // Confirmation
        this.$buefy.toast.open({
          duration: 5000,
          message: "A password reset email is sent. Please check your mailbox.",
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(error),
          type: 'is-danger',
          queue: false
        })
      }

      this.isLoading = false
    }
  }
}
</script>

<style lang="sass" scoped>
.action-buttons
  .button
    margin-bottom: 0.5rem
</style>