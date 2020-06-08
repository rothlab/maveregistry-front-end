<template>
  <div>
    <!-- Header -->
    <div class="hero is-light is-bold">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="content">
            <p
              class="is-size-3 has-text-weight-medium"
            >
              {{ isNew ? 'Register New' : 'Edit' }} Project
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <!-- Loading -->
      <b-loading
        :is-full-page="false"
        :active="isLoading.page"
      />

      <Error
        v-if="!isLoading.page && errorMessage !== ''"
        :message="errorMessage"
      />

      <div
        class="content"
        v-else-if="!isLoading.page && errorMessage === ''"
      >
        <!-- Project information -->
        <ValidationObserver
          ref="observer"
          v-slot="{ passed }"
        >
          <div class="project-header">
            <p class="is-size-4 has-text-weight-bold">
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
                    <span class="is-size-5">
                      Project Lead {{ index === 0 ? '(*)' : '' }}
                    </span>
                    <b-button
                      v-if="leads.length > 1"
                      icon-left="mdil-delete"
                      type="is-light"
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

            <div class="column is-5">
              <b-notification :closable="false">
                <div class="content">
                  <b-icon
                    class="header-icon"
                    type="is-primary"
                    custom-size="mdil-48px"
                    icon="mdil-information"
                  />

                  <div class="field-margin">
                    <div class="has-text-white has-round-title has-background-primary is-inline-block">
                      <b-icon icon="mdil-lightbulb" />
                      About
                    </div>
                    <div class="level is-mobile is-marginless">
                      <div class="level-left">
                        <b-tooltip
                          label="Creator"
                          type="is-dark"
                        >
                          <b-icon icon="mdil-account" />
                          <router-link
                            :to="{ name: 'User Profile View', params: { username: user.username } }"
                            target="_blank"
                          >
                            {{ user.first_name }} {{ user.last_name }}
                          </router-link>
                        </b-tooltip>
                      </div>

                      <div class="level-right">
                        <b-tooltip
                          label="Last Update Date"
                          type="is-dark"
                        >
                          <b-icon icon="mdil-clock" />
                          {{ updatedDate.toLocaleString() }}
                        </b-tooltip>
                      </div>
                    </div>

                    <div class="level">
                      <div class="level-left">
                        <b-icon icon="mdil-tag" />
                        Feature: {{ features.join(", ") }}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="has-text-white has-round-title has-background-primary is-inline-block">
                      <b-icon icon="mdil-pin" />
                      Target
                    </div>
                    <div class="level is-mobile">
                      <div class="level-item is-capitalized">
                        Type: {{ target.type }}
                      </div>
                      <div class="level-item is-capitalized">
                        Name: {{ target.name }}
                      </div>
                      <div class="level-item">
                        Organism: <i>{{ target.organism }}</i>
                      </div>
                    </div>
                  </div>
                </div>
              </b-notification>
            </div>
          </div>

          <div class="columns">
            <div class="column is-7">
              <!-- Team -->
              <div class="project-content">
                <div class="columns">
                  <div class="column is-3">
                    <span class="is-size-5">
                      Team (*)
                    </span>
                  </div>
                  <div class="column is-9">
                    <TeamInfo v-model="team" />
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
                    <span class="is-size-5">
                      Collaborator
                    </span>
                    <b-button
                      v-if="collaborators.length > 1"
                      icon-left="mdil-delete"
                      type="is-light"
                      @click="collaborators.splice(index, 1)"
                    >
                      Delete
                    </b-button>
                  </div>
                  <div class="column is-9">
                    <TeamInfo
                      v-model="collaborators[index]"
                      :is-required="false"
                      is-collaborator
                    />
                  </div>
                </div>
                <!-- Add project lead -->
                <b-button
                  class="add-record"
                  type="is-light"
                  icon-left="mdil-plus"
                  expanded
                  @click="collaborators.push('')"
                >
                  Add a Collaborator
                </b-button>
              </div>
            </div>
          </div>

          <hr>

          <div class="project-header">
            <p class="is-size-4 has-text-weight-bold">
              Funding
            </p>
          </div>

          <div class="columns is-mobile">
            <div class="column is-7">
              <!-- Funding -->
              <div class="project-content">
                <div class="columns">
                  <div class="column is-3">
                    <p class="is-size-5">
                      Seek Funding
                    </p>
                  </div>
                  <div class="column is-9 is-flex">
                    <b-checkbox v-model="openForFunding">
                      Open for Funding Opportunities
                    </b-checkbox>
                  </div>
                </div>
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
                  <p>Only trusted funders can access funding information</p>
                </div>
              </b-notification>
            </div>
          </div>

          <hr>
          
          <!-- Activity -->
          <div class="project-header">
            <p class="is-size-4 has-text-weight-bold">
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
                      Current Activity (*)
                    </p>
                    <p
                      v-else
                      class="is-size-5"
                    >
                      Previous Activity (*)
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

          <hr>

          <div class="columns">
            <div class="column is-4 is-offset-8">
              <b-button
                :disabled="!passed"
                expanded
                type="is-primary"
                size="is-medium"
                icon-left="mdil-content-save"
                @click="updateProject"
                :loading="isLoading.submit"
              >
                {{ isNew ? 'Register' : 'Edit' }} Project
              </b-button>
            </div>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfo from '@/components/PersonalInfo.vue'
import TeamInfo from '@/components/TeamInfo.vue'
import ProjectActivity from '@/components/ProjectActivity.vue'
import Error from '@/components/Error.vue'
import { ValidationObserver } from 'vee-validate'
import { handleError } from "@/assets/errorHandler.js"
import * as ProjectManage from "@/api/projectManage.js"

// Helper functions
// Check if a person is empty
function isNotEmptyPerson (person, emptyPerson) {
  return JSON.stringify(person) !== JSON.stringify(emptyPerson)
}

export default {
  components: {
    PersonalInfo,
    TeamInfo,
    ProjectActivity,
    ValidationObserver,
    Error
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
      team: "",
      collaborators: [""],
      openForFunding: false,
      activities: [
        this.newActivity()
      ],
      features: [],
      user: {},
      updatedDate: new Date,
      isLoading: {
        page: false,
        submit: false
      },
      errorMessage: ""
    }
  },
  computed: {
    isNew() {
      return this.$route.params.action === 'new'
    },
    isEdit() {
      return this.$route.params.action === 'edit'
    },
    projectId() {
      return this.$route.params.id
    },
  },
  async mounted() {
    // If invalid actionm jump to view page
    if (!this.isNew && !this.isEdit) {
      this.$router.push({ name: 'Project View', params: { id: this.projectId } })
      return
    }

    const project = await this.fetchProject(this.projectId)

    // Populate project details if editing
    if (this.isEdit && project) {
      if (project.leads) this.leads = project.leads // Required, will always have value
      if (project.team) this.team = project.team // Required, will always have value
      if (project.collaborators && project.collaborators.length > 0) this.collaborators = project.collaborators
      if (project.funding && project.funding.open_for_funding) this.openForFunding = project.funding.open_for_funding
      if (project.activities) this.activities = project.activities
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
    newActivity() {
      return {
        type: "",
        start_date: new Date(),
        description: "",
      }
    },
    async fetchProject(id) {
      this.isLoading.page = true

      // Error handling
      try {
        const project = await ProjectManage.fetchProject(id, true)
      
        this.target = project.target
        this.features = project.features
        this.user = project.user
        this.updatedDate = project.update_date

        return project
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.page = false
      }
    },
    async updateProject() {
      this.isLoading.submit = true

      // Construct payload
      const project = {
        id: this.projectId,
        leads: this.leads.filter(e => isNotEmptyPerson(e, this.newLead())),
        team: this.team,
        collaborators: this.collaborators.filter(e => e !== ""),
        funding: {
          open_for_funding: this.openForFunding
        },
        activities: this.activities
      }

      // Update project
      try {
        await ProjectManage.updateProject(project)
      } catch (e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(e),
          type: 'is-danger',
          queue: false
        })
        this.isLoading.submit = false
        return
      } finally {
        this.isLoading.submit = false
      }

      // Update UI and router
      this.$router.push({ name: 'Project View', params: { id: this.projectId } })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/variables"

.header-icon
  position: absolute
  right: 1.25rem
.infocard-content
  margin-left: 1rem
.input
  box-shadow: none
.has-margin-right
  margin-right: -0.15rem !important
</style>