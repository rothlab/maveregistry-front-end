<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>Add a New {{ isCollaborator ? "Collaborator" : "Team" }}</span>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="isActive = false"
        />
      </header>

      <ValidationObserver
        ref="observer"
        v-slot="{ passed }"
      >
        <section class="modal-card-body">
          <div class="content">
            <p class="is-size-5 has-text-weight-bold">
              Principal Investigator
            </p>

            <PIInfoField v-model="team" />
          </div>
        </section>

        <footer class="modal-card-foot">
          <b-button
            expanded
            :loading="isLoading"
            :disabled="!passed"
            type="is-primary"
            @click="addTeam"
          >
            Add {{ isCollaborator ? "Collaborator" : "Team" }}
          </b-button>
        </footer>
      </ValidationObserver>
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