<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="is-capitalized">Unfollow {{ type }}</span>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="isActive = false"
        />
      </header>
      <section class="modal-card-body">
        <div class="container">
          <div class="media">
            <div class="media-left">
              <b-icon
                pack="mdi"
                icon="alert-circle"
                size="is-large"
                type="is-warning"
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
      </section>
      <footer class="modal-card-foot has-hright">
        <div class="buttons">
          <b-button
            @click="isActive = false"
          >
            Cancel
          </b-button>
          <b-button
            :loading="isLoading"
            type="is-warning"
            @click="unfollow"
          >
            Unfollow
          </b-button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
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