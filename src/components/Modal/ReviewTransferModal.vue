<template>
  <b-modal
    :active.sync="isActive"
    :width="600"
    class="card-modal"
  >
    <div class="card">
      <div class="card-content">
        <!-- Header -->
        <div class="level is-mobile">
          <div class="level-left">
            <p class="is-size-5 has-text-primary is-capitalized">
              Review Pending Transfer
            </p>
          </div>
          <div class="level-right">
            <button
              class="delete"
              aria-label="close"
              @click="isActive = false"
            />
          </div>
        </div>

        <!-- Body -->
        <div class="container">
          <div class="media">
            <div class="media-left">
              <AlertCircleIcon
                decorative
                class="has-text-warning icon-48px"
              />
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <span>
                    <figure
                      class="image is-24x24 is-inline-flex"
                      style="margin: 0 0.25rem 0 0"
                    >
                      <img
                        class="is-rounded"
                        :src="profileImageUrl(transfer.original)"
                        alt="Profile Image"
                      >
                    </figure>
                    <router-link
                      :to="{ name: 'User Profile View', params: { username: transfer.original.username } }"
                      target="_blank"
                      style="margin-right: 0.25rem"
                    >
                      <span class="is-capitalized">{{ transfer.original.first_name }} {{ transfer.original.last_name }}</span>
                    </router-link>
                    initiated the transfer of ownership at {{ transfer.time.toLocaleString() }}.
                  </span>
                </p>
                <p>
                  Would you like to accept the ownership?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="buttons footer-actions">
          <b-button
            @click="isActive = false"
          >
            Dismiss
          </b-button>
          <b-button
            :loading="isLoading"
            type="is-warning"
            @click="acceptTransfer"
          >
            Accept Transfer
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as TransferManage from "@/api/transferManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import AlertCircleIcon from 'vue-material-design-icons/AlertCircle.vue'

export default {
  components: {
    AlertCircleIcon
  },
  props: {
    transfer: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val != this.active) {
        this.$emit("update:active", val)
      }
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: false
    }
  },
  methods: {
    async acceptTransfer() {
      // Loading
      this.isLoading = true

      // Accept transfer
      let transfer
      try {
        transfer = await TransferManage.acceptTransfer(this.transfer.id)
      } catch (error) {
        await displayErrorToast(error)
        return
      } finally {
        this.isLoading = false
      }
      
      // Handle UI changes
      this.isActive = false
      
      // Show status update
      this.$buefy.toast.open({
        message: `Ownership Transferred`,
        type: "is-success"
      })

      this.$emit("transfer", transfer)
    },
  }
}
</script>

<style lang="sass" scoped>
.footer-actions
  margin-top: 1.5rem
  justify-content: flex-end
</style>