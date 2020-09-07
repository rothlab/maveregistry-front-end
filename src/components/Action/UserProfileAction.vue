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
      icon-left="mdil-email"
      type="is-light"
      expanded
      @click="isNotificationPreferenceIdModalActive = true"
      :loading="isLoading"
    >
      Set Email Preference
    </b-button>
    <!-- <b-button
      icon-left="mdil-delete"
      type="is-light"
      expanded
      @click="isConfirmDeleteUserModalActive = true"
      disabled
    >
      Delete Account (under dev)
    </b-button> -->

    <!-- Email frequency modal -->
    <EmailPreferenceModal
      :id="notification"
      :active.sync="isNotificationPreferenceIdModalActive"
    />

    <!-- Confirm Delete User Modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmDeleteUserModalActive"
      type="account"
      action="delete"
      :on-action="deleteUser"
      :action-disabled="objectCount > 0"
      title="Delete Account"
    >
      <p
        v-if="objectCount > 0"
        style="margin-top: 1rem"
      >
        This user still owns <b>{{ objectCount }}</b> objects (e.g. projects, teams or nominations). 
        <b>Please delete or transfer them to other users.</b>
      </p>
    </ConfirmDangerModal>
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import EmailPreferenceModal from "@/components/Modal/EmailPreferenceModal.vue"
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'

export default {
  components: {
    EmailPreferenceModal,
    ConfirmDangerModal
  },
  props: {
    email: {
      type: String,
      required: true
    },
    notification: {
      type: String,
      required: true
    },
    objectCount: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isNotificationPreferenceIdModalActive: false,
      isConfirmDeleteUserModalActive: false,
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
          message: "Password Reset Email Sent",
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        await displayErrorToast(error)
      }

      this.isLoading = false
    },
    deleteUser() {
      throw new Error("Function under development")
    }
  }
}
</script>

<style lang="sass" scoped>
.action-buttons
  .button
    margin-bottom: 0.5rem
</style>