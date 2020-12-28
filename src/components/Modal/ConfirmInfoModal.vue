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
              {{ `${action} ${type}` }}
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
          <div
            class="media"
            style="align-items: center;"
          >
            <div class="media-left">
              <InformationIcon
                decorative
                class="has-text-primary icon-48px"
              />
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  Are you sure you want to {{ action }} the {{ type }}? <br>
                  <b v-if="isIrreversible">This action is not reversible.</b>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Inject slot -->
        <slot />

        <div class="buttons footer-actions">
          <b-button
            @click="isActive = false"
          >
            Cancel
          </b-button>
          <b-button
            :loading="isLoading"
            type="is-primary"
            @click="performAction"
            class="is-capitalized"
            :disabled="actionDisabled"
          >
            {{ action }}
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { displayErrorToast } from "@/api/errorHandler.js"
import InformationIcon from 'vue-material-design-icons/Information.vue'

export default {
  components: {
    InformationIcon
  },
  props: {
    action: {
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
    },
    onAction: {
      type: Function,
      required: true
    },
    actionDisabled: {
      type: Boolean,
      default: false
    },
    isIrreversible: {
      type: Boolean,
      default: true
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
    async performAction() {
      // Loading
      this.isLoading = true

      // Call action
      try {
        await this.onAction()
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
        message: `${this.capitalize(this.type)} ${this.capitalize(this.getPastTense(this.action))}`,
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