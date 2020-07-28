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
            <p class="is-size-5 has-text-primary">
              Add a New {{ isCollaborator ? "Collaborator" : "Team" }}
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
        <ValidationObserver
          ref="observer"
          v-slot="{ passed }"
        >
          <div class="content">
            <p class="is-size-5 has-text-weight-bold">
              Principal Investigator
            </p>

            <PIInfoField v-model="team" />
          </div>

          <b-button
            expanded
            :loading="isLoading"
            :disabled="!passed"
            type="is-primary"
            @click="addTeam"
          >
            Add {{ isCollaborator ? "Collaborator" : "Team" }}
          </b-button>
        </ValidationObserver>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import { ValidationObserver } from 'vee-validate'
import { displayErrorToast } from "@/api/errorHandler.js"
import PIInfoField from '@/components/Field/PIInfoField.vue'

function initTeam() {
  return {
    first_name: "",
    last_name: "",
    email: "",
    affiliation: "",
    website: ""
  }
}

export default {
  components: {
    ValidationObserver,
    PIInfoField
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    isCollaborator: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: false,
      isLoading: false,
      team: initTeam()
    }
  },
  watch: {
    active() {
      // This if statement if important because we only want to reinit data when parent state is changed
      if (this.isActive != this.active) {
        this.isActive = this.active
        this.team = initTeam()
      }
    },
    isActive(val) {
      this.$emit("update:active", val)
    }
  },
  methods: {
    async addTeam() {
      this.isLoading = true

      try {
        const team = await TeamManage.addTeam(this.team)

        // Handle UI changes
        this.isActive = false

        // Trigger change
        this.$emit("change", team.id)
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading = false
      }
    },
  }
}
</script>

<style lang="sass" scoped>
.modal-card-title
  margin-bottom: 0 !important
</style>