<template>
  <div>
    <!-- Header -->
    <div class="hero is-light is-bold">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  View Project
                </p>
              </div>
            </div>
            <!-- Show edit button if current user is the project creator -->
            <div
              class="level-right"
              v-if="isOwner"
            >
              <!-- Edit project -->
              <b-button
                icon-left="mdil-pencil"
                type="is-primary"
                size="is-medium"
                outlined
                @click="editProject"
              >
                Edit
              </b-button>
            </div>
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

      <!-- Project display -->
      <div
        class="content"
        v-else-if="!isLoading.page && errorMessage === ''"
      >
        <div class="columns">
          <div
            class="column is-6"
          >
            <!-- Add no project detail display -->
            <div
              class="no-project has-vcentered"
              v-if="!hasPeople && !hasActivity"
            >
              <div class="info-icon">
                <b-icon
                  icon="mdil-flask-empty"
                  custom-size="mdil-48px"
                  type="is-grey-light"
                />
              </div>
              <div class="info-content">
                <p class="has-text-grey">
                  <span class="is-size-5 has-text-grey-dark">No Project Detail</span><br>
                  <span v-if="isOwner">Using the "Edit" function to add project detail.</span>
                  <span v-else>You may contact the creator for more information.</span>
                </p>
              </div>
            </div>

            <div
              class="project-header"
              v-if="hasPeople"
            >
              <p class="is-size-4 has-text-weight-bold">
                People
              </p>
            </div>

            <div class="project-content">
              <p
                class="is-size-5"
                v-if="leads.length > 0"
              >
                <span>
                  <b>{{ 'Project Lead' + (leads.length > 1 ? 's' : '') }}</b> <br>
                </span>
                <span
                  v-for="(lead, id) in leads"
                  :key="id"
                >
                  <a
                    :href="'mailto:' + lead.email"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b-icon icon="mdil-email" />
                  </a>
                  <span class="is-capitalized">{{ lead.first_name + " " + lead.last_name }},</span>
                  {{ lead.position === "Other" ? lead.custom_position : lead.position }}
                </span>
              </p>

              <p class="is-size-5">
                <span v-if="team">
                  <b>Team</b> <br>
                  <a
                    :href="'mailto:' + team.email"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b-icon icon="mdil-email" />
                  </a>
                  <span class="is-capitalized">{{ team.first_name + " " + team.last_name }},</span>
                  {{ team.affiliation }}
                </span>
              </p>

              <p
                class="is-size-5"
                v-if="collaborators.length > 0"
              >
                <span>
                  <b>{{ 'Collaborator' + (collaborators.length > 1 ? 's' : '') }}</b> <br>
                </span>
                <span
                  v-for="(collaborator, id) in collaborators"
                  :key="id"
                >
                  <a
                    :href="'mailto:' + collaborator.email"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <b-icon icon="mdil-email" />
                  </a>
                  <span class="is-capitalized">{{ collaborator.first_name + " " + collaborator.last_name }},</span>
                  {{ collaborator.affiliation }}
                  <br>
                </span>
              </p>
            </div>

            <div
              class="project-header"
              v-if="hasActivity"
            >
              <p
                class="is-size-4 has-text-weight-bold"
              >
                Activity
              </p>
            </div>

            <div
              class="project-content"
              v-if="hasActivity"
            >
              <p
                class="is-size-5"
                v-for="(activity, id) in activities"
                :key="id"
              >
                <b>
                  {{ activity.start_date.toLocaleDateString() }} -
                  {{ activity.end_date ? activity.end_date.toLocaleDateString() : "Present" }}
                </b> | {{ activity.type }}
                <br>
                {{ activity.description }}
              </p>
            </div>
          </div>

          <div class="column is-4 is-offset-2">
            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                About Project
              </p>
            </div>
            
            <div class="project-content">
              <p class="is-size-5">
                <b>Target</b> <br>
                <b-icon icon="mdil-pin" />
                <router-link
                  :to="`/target/${target.id}`"
                  target="_blank"
                >
                  <span class="is-capitalized">
                    {{ target.name }} ({{ target.type }}),
                  </span>
                  <span class="is-italic">
                    {{ target.organism }}
                  </span>
                </router-link>
                <br>
              </p>
              <p class="is-size-5">
                <b>Feature</b> <br>
                <b-icon icon="mdil-tag" />
                {{ features.join(",") }}
              </p>
              <p
                class="is-size-5"
                v-if="funding"
              >
                <b>Funding</b> <br>
                <b-icon :icon="funding.open_for_funding ? 'mdil-eye' : 'mdil-eye-off'" />
                {{ funding.open_for_funding ? "Seek" : "Not Seek" }} Funding
              </p>
              <p
                class="is-size-5"
                v-if="user"
              >
                <b>Creator</b> <br>
                <b-icon icon="mdil-account" />
                <router-link
                  :to="{ name: 'User Profile View', params: { username: user.username } }"
                  target="_blank"
                >
                  {{ user.first_name + ' ' + user.last_name }}
                </router-link>
              </p>
              <p class="is-size-5">
                <b>Last Update</b> <br>
                <b-icon icon="mdil-clock" />
                {{ updatedDate.toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ProjectManage from "@/api/projectManage.js"
import * as TeamManage from "@/api/teamManage.js"
import { handleError } from "@/api/errorHandler.js"
import Error from '@/components/Error.vue'

export default {
  components: {
    Error
  },
  data() {
    return {
      isLoading: {
        page: false
      },
      isOwner: false,
      errorMessage: "",
      target: {},
      features: [],
      user: undefined,
      updatedDate: new Date(),
      leads: [],
      team: undefined,
      collaborators: [],
      funding: undefined,
      activities: []
    }
  },
  computed: {
    projectId() {
      return this.$route.params.id
    },
    hasPeople() {
      return this.leads.length > 0 && this.team && this.collaborators.length > 0
    },
    hasActivity() {
      return this.activities.length > 0
    }
  },
  async mounted() {
    this.isLoading.page = true

    const project = await this.fetchProject(this.projectId)

    if (project) {
      if (project.leads) this.leads = project.leads // Required, will always have value
      if (project.team) this.team = await TeamManage.queryById(project.team) // Required, will always have value
      if (project.collaborators)
        this.collaborators = await Promise.all(project.collaborators.map(e => TeamManage.queryById(e)))
      if (project.funding) this.funding = project.funding
      if (project.activities) this.activities = project.activities
    }

    // Set owner property
    if (this.user && this.user.username)
      this.isOwner = this.$store.state.hasLoggedIn && (this.user.username === this.$store.state.user.username)

    this.isLoading.page = false
  },
  methods: {
    async fetchProject(id) {
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
      }
    },
    editProject() {
      this.$router.push({ name: 'Project Edit', params: { id: this.projectId, action: 'edit' } })
    }
  }
}
</script>

<style lang="sass" scoped>
.project-header
  margin-bottom: 0.5rem
.no-project
  border: 1px dashed #b5b5b5
  border-radius: 6px
  height: 100%
  display: flex
  justify-content: center
  .info-icon
    margin: 2rem
    display: flex
</style>