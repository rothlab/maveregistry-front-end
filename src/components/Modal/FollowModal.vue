<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="is-capitalized">Follow {{ type }}</span>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="isActive = false"
        />
      </header>
      <section class="modal-card-body">
        <div class="content">
          <b-field :label="`Please briefly summarize your interest in following this ${type}.`">
            <b-input
              v-model="request"
              maxlength="300"
              type="textarea"
              placeholder="Maximum 300 characters."
              required
            />
          </b-field>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button
          expanded
          :disabled="request.length <= 0"
          :loading="isLoading"
          type="is-primary"
          @click="follow"
        >
          Submit Request
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"
import { handleError } from "@/api/errorHandler.js"

export default {
  props: {
    source: {
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
      isLoading: false,
      request: ""
    }
  },
  methods: {
    async follow() {
      // Loading
      this.isLoading = true

      try {
        await FollowManage.follow(this.source, this.type, this.request)
      } catch (error) {
        this.$buefy.toast.open({
          message: await handleError(error),
          type: "is-danger",
          duration: 5000
        })
        return
      } finally {
        this.isLoading = false
      }

      // Show status update
      this.isActive = false
      this.request = ""
      this.$buefy.toast.open({
        message: `Followed successfully.`,
        type: "is-success",
        duration: 5000
      })

      this.$emit("change")
    }
  }
}
</script>