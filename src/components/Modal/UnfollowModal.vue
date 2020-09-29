<template>
  <b-modal
    :active.sync="isActive"
    :width="500"
    :can-cancel="['escape', 'outside']"
    class="card-modal"
  >
    <div class="card">
      <div class="card-content">
        <!-- Header -->
        <div class="level is-mobile">
          <div class="level-left">
            <p class="is-size-5 has-text-primary is-capitalized">
              Unfollow {{ type }}
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
                class="has-text-danger icon-48px"
              />
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  Are you sure you want to unfollow this {{ type }}? <br>
                  You will need to request to follow again.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="buttons footer-actions">
          <b-button
            @click="isActive = false"
          >
            Cancel
          </b-button>
          <b-button
            :loading="isLoading"
            type="is-danger"
            @click="unfollow"
          >
            Unfollow
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import AlertCircleIcon from 'vue-material-design-icons/AlertCircle.vue'

export default {
  components: {
    AlertCircleIcon
  },
  props: {
    follow: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
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
    async unfollow() {
      // Loading
      this.isLoading = true

      // Unfollow
      try {
        await FollowManage.unfollow(this.follow)
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
        message: `${this.capitalize(this.type)} Unfollowed`,
        type: "is-success"
      })

      this.$emit("change")
    },
  }
}
</script>

<style lang="sass" scoped>
.footer-actions
  margin-top: 1.5rem
  justify-content: flex-end
</style>