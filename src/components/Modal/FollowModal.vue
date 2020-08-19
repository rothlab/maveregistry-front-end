<template>
  <b-modal
    :active.sync="isActive"
    :width="650"
    :can-cancel="['escape', 'outside']"
    class="card-modal"
  >
    <div class="card">
      <div class="card-content">
        <!-- Header -->
        <div class="level is-mobile">
          <div class="level-left">
            <p class="is-size-5 has-text-primary is-capitalized">
              Follow {{ type }}
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
        <div class="is-flex p-margin">
          <span>
            Your request will be submitted to the {{ type }} creator
            <figure
              class="image is-24x24 is-inline-flex"
              style="margin: 0 0.25rem"
            >
              <img
                class="is-rounded"
                :src="profileImageUrl(creator)"
                alt="Profile Image"
              >
            </figure>
            <router-link
              :to="{ name: 'User Profile View', params: { username: creator.username } }"
              target="_blank"
              style="margin-right: 0.25rem"
            >
              <span class="is-capitalized">{{ creator.first_name }} {{ creator.last_name }}</span>
            </router-link>
            for review.
          </span>
        </div>


        <b-field :label="`Please briefly summarize your interest in following this ${type}.`">
          <b-input
            v-model.trim="request"
            maxlength="300"
            type="textarea"
            placeholder="Maximum 300 characters."
            required
          />
        </b-field>

        <b-field>
          <b-checkbox v-model="requestEdit">
            Request edit permission on this {{ type }} (optional).
          </b-checkbox>
        </b-field>
        <b-button
          expanded
          :disabled="request.length <= 0"
          :loading="isLoading"
          type="is-primary"
          @click="follow"
        >
          Submit Request
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"

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
    creator: {
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
      request: "",
      requestEdit: false
    }
  },
  methods: {
    async follow() {
      // Loading
      this.isLoading = true

      try {
        await FollowManage.follow(this.source, this.type, this.request, this.requestEdit)
      } catch (error) {
        await displayErrorToast(error)
        return
      } finally {
        this.isLoading = false
      }

      // Show status update
      this.isActive = false
      this.request = ""
      this.$buefy.toast.open({
        message: `Follow Request Sent`,
        type: "is-success",
        duration: 5000
      })

      this.$emit("change")
    }
  }
}
</script>