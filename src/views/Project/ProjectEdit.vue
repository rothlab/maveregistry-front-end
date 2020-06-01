<template>
  <div>
    <!-- Header -->
    <div class="hero is-light is-bold">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p
                  v-if="isNew"
                  class="is-size-3 has-text-weight-medium"
                >
                  Register New Project
                </p>
              </div>
            </div>
            <div
              v-if="isEdit"
              class="level-right"
            >
              <!-- Register new project -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-mobile"
                @click="isNewActivityModalActive = true"
              >
                Edit Project
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="isNewActivityModalActive = true"
              >
                Edit
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <div class="content">
        <!-- Project information -->
        <div class="columns">
          <div class="column is-7">
            <div class="project-header">
              <p class="is-size-4">
                Project Information
              </p>
            </div>
            
            <!-- Project Lead -->
            <div class="project-content">
              <div
                v-for="(lead, index) in projectLeads"
                :key="index"
                class="columns"
              >
                <div class="column is-3">
                  <p class="is-size-5">
                    Project Lead {{ index === 0 ? '(*)' : '' }}
                  </p>
                  <b-button
                    v-if="projectLeads.length > 1"
                    icon-left="mdil-delete"
                    @click="projectLeads.splice(index, 1)"
                  >
                    Delete
                  </b-button>
                </div>
                <div class="column is-9">
                  <PersonalInfo
                    v-model="projectLeads[index]"
                  />
                </div>
              </div>
              <!-- Add project lead -->
              <b-button
                class="add-record"
                type="is-light"
                icon-left="mdil-plus"
                expanded
                @click="projectLeads.push(newLead())"
              >
                Add a Project Lead
              </b-button>
            </div>

            <!-- Principal Investigator -->
            <div class="project-content">
              <div class="columns">
                <div class="column is-3">
                  <p class="is-size-5">
                    Principal Investigator (*)
                  </p>
                </div>
                <div class="column is-9">
                  <PersonalInfo
                    v-model="investigator"
                    is-pi
                  />
                </div>
              </div>
            </div>

            <!-- Collaborators -->
            <div class="project-content">
              <div
                v-for="(collab, index) in collaborators"
                :key="index"
                class="columns"
              >
                <div class="column is-3">
                  <p class="is-size-5">
                    Collaborator
                  </p>
                  <b-button
                    v-if="collaborators.length > 1"
                    icon-left="mdil-delete"
                    @click="collaborators.splice(index, 1)"
                  >
                    Delete
                  </b-button>
                </div>
                <div class="column is-9">
                  <PersonalInfo
                    v-model="collaborators[index]"
                    is-pi
                  />
                </div>
              </div>
              <!-- Add project lead -->
              <b-button
                class="add-record"
                type="is-light"
                icon-left="mdil-plus"
                expanded
                @click="collaborators.push(newLead())"
              >
                Add a Collaborator
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfo from '@/components/PersonalInfo'

export default {
  components: {
    PersonalInfo
  },
  data () {
    return {
      target: {},
      projectLeads: [
        this.newLead()
      ],
      positions: [
        "Student",
        "Post-doc Fellow",
        "Faculty",
        "Research Staff",
        "Other"
      ],
      investigator: this.newPi(),
      collaborators: [
        this.newPi()
      ]
    }
  },
  computed: {
    isNew() {
      return this.$route.params.action === 'new'
    },
    isEdit() {
      return this.$route.params.action === 'edit'
    }
  },
  methods: {
    newLead() {
      return {
          first_name: "",
          last_name: "",
          email: "",
          position: "",
          custom_position: ""
      }
    },
    newPi() {
      return {
        first_name: "",
        last_name: "",
        email: "",
        affiliation: ""
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.project-content
  padding: 0.5rem 1rem 1rem 1rem
  .columns
    margin-bottom: 0
.add-record
  margin-bottom: 1rem
</style>