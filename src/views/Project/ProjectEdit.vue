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
        <div class="project-header">
          <p class="is-size-4">
            <b-icon icon="mdil-account" />
            People
          </p>
        </div>
        
        <div class="columns">
          <div class="column is-7">
            <!-- Project Lead -->
            <div class="project-content">
              <div
                v-for="(lead, index) in leads"
                :key="index"
                class="columns"
              >
                <div class="column is-3">
                  <p class="is-size-5">
                    Project Lead {{ index === 0 ? '(*)' : '' }}
                  </p>
                  <b-button
                    v-if="leads.length > 1"
                    icon-left="mdil-delete"
                    @click="leads.splice(index, 1)"
                  >
                    Delete
                  </b-button>
                </div>
                <div class="column is-9">
                  <PersonalInfo
                    v-model="leads[index]"
                  />
                </div>
              </div>
              <!-- Add project lead -->
              <b-button
                class="add-record"
                type="is-light"
                icon-left="mdil-plus"
                expanded
                @click="leads.push(newLead())"
              >
                Add a Project Lead
              </b-button>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-7">
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
          </div> 
        </div>

        <div class="columns">
          <div class="column is-7">
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

        <div class="columns">
          <div class="column is-7">
            <!-- Funding -->
            <div class="project-content">
              <div class="columns">
                <div class="column is-3">
                  <p class="is-size-5">
                    Funding
                  </p>
                </div>
                <div class="column is-9">
                  <b-checkbox v-model="openForFunding">
                    Open for Funding Opportunities
                  </b-checkbox>
                </div>
              </div>
            </div>
          </div>
          <div class="column is=5">
            <div class="content">
              <b-taglist attached>
                <b-tag
                  size="is-medium"
                  type="is-primary"
                >
                  <b-icon icon="mdil-information" />
                </b-tag>
                <b-tag size="is-medium">
                  Only trusted funders have access to funding status
                </b-tag>
              </b-taglist>
            </div>
          </div>
        </div>

        <!-- Activity -->
        <div class="project-header">
          <p class="is-size-4">
            <b-icon icon="mdil-clipboard-text" />
            Activity
          </p>
        </div>

        <div class="columns">
          <div class="column is-7">
            <div class="project-content">
              <div
                v-for="(activity, index) in activities"
                :key="index"
                class="columns"
              >
                <div class="column is-3">
                  <p
                    v-if="!activity.end_date"
                    class="is-size-5"
                  >
                    Current Activity
                  </p>
                  <p
                    v-else
                    class="is-size-5"
                  >
                    Previous Activity
                  </p>
                  <b-button
                    v-if="activities.length > 1"
                    icon-left="mdil-delete"
                    @click="activities.splice(index, 1)"
                  >
                    Delete
                  </b-button>
                </div>
                <div class="column is-9">
                  <ProjectActivity v-model="activities[index]" />
                </div>
              </div>
              <!-- Add project lead -->
              <b-button
                class="add-record"
                type="is-light"
                icon-left="mdil-plus"
                expanded
                @click="activities.push(newActivity())"
              >
                Add an Activity
              </b-button>
            </div>
          </div>

          <div class="column is-5">
            <b-notification :closable="false">
              <div class="content">
                <b-icon
                  class="header-icon"
                  type="is-primary"
                  custom-size="mdil-48px"
                  icon="mdil-information"
                />
                <p class="has-text-weight-bold">
                  MAVE Registry supports the following types:
                </p>
                <ol>
                  <li>Literature search: no experiments performed yet</li>
                  <li>Assay development: small-scale experiments</li>
                  <li>MAVE data collection: full-scale MAVE experiments</li>
                  <li>MAVE data analysis: computational analysis of MAVE data</li>
                  <li>Publication in preparation</li>
                  <li>Publication available</li>
                </ol>
              </div>
            </b-notification>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfo from '@/components/PersonalInfo'
import ProjectActivity from '@/components/ProjectActivity'

export default {
  components: {
    PersonalInfo,
    ProjectActivity
  },
  data () {
    return {
      target: {},
      leads: [
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
      ],
      openForFunding: false,
      activities: [
        this.newActivity()
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
    },
    newFunding() {
      return {
        type: "",
        agendcy: "",
        start_date: new Date(),
        end_date: new Date()
      }
    },
    newActivity() {
      return {
        type: "",
        start_date: new Date(),
        description: "",
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/variables"

.project-content
  padding: 0.5rem 1rem
  .columns
    margin-bottom: 0
.header-icon
  position: absolute
  right: 1.25rem
</style>