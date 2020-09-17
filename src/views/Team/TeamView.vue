<template>
  <div>
    <!-- Header -->
    <div class="hero is-light">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">
                  View Team
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
                type="is-warning"
                size="is-medium"
                class="small-shadow"
                @click="editTeam"
              >
                Edit
              </b-button>
            </div>
            <div
              class="level-right"
              v-else-if="hasLoggedIn && isMember && followStatus" 
            >
              <FollowButtonAction
                :follow-status="followStatus"
                type="team"
                :target-id="teamId"
                :creator="creator"
                @change="fetchTeam()"
              />
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

      <div
        class="content"
        v-else-if="!isLoading.page && errorMessage === ''"
      >
        <div class="columns">
          <div
            class="column is-6"
          >
            <div
              class="project-header"
            >
              <p class="is-size-4 has-text-weight-bold">
                People
              </p>
            </div>

            <div
              class="project-content"
            >
              <p
                class="is-size-5"
                v-if="principalInvestigator"
              >
                <b>Principal Investigator</b> <br>
                <!-- Email -->
                <a
                  v-if="principalInvestigator.email"
                  :href="'mailto:' + principalInvestigator.email"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b-icon icon="mdil-email" />
                </a>

                <!-- Website -->
                <a
                  v-if="principalInvestigator.website"
                  :href="principalInvestigator.website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b-icon icon="mdil-link" />
                </a>

                <span class="is-capitalized">{{ principalInvestigator.first_name + " " + principalInvestigator.last_name }},</span>
                {{ principalInvestigator.affiliation }}
              </p>

              <div
                class="is-size-5"
                v-if="members.length > 0"
                style="margin-bottom: 1em"
              >
                <b>Member{{ members.length > 1 ? 's' : '' }}</b><br>
                <figure
                  v-for="(member, id) in members"
                  :key="id"
                  class="image is-32x32 is-inline-block member-icons"
                >
                  <router-link
                    :to="{ name: 'User Profile View', params: { username: member.username } }"
                    target="_blank"
                    class="is-capitalized"
                  >
                    <b-tooltip
                      :label="`${member.first_name} ${member.last_name}`"
                      type="is-dark"
                    >
                      <img
                        :src="getProfileImageFromUser(member)"
                        class="is-rounded"
                      >
                    </b-tooltip>
                  </router-link>
                </figure>
              </div>

              <div
                class="is-size-5"
                v-if="collaborators.length > 0"
              >
                <b>Collaborating Team{{ collaborators.length > 1 ? 's' : '' }}</b><br>
                <div
                  v-for="(collaborator, id) in collaborators"
                  :key="id"
                >
                  <router-link
                    :to="{ name: 'Team View', params: { id: collaborator.id } }"
                    target="_blank"
                  >
                    <b-icon icon="mdil-link" />
                  </router-link>
                  <span class="is-capitalized">{{ collaborator.first_name + " " + collaborator.last_name }},</span>
                  {{ collaborator.affiliation }}
                </div>
              </div>
            </div>

            <hr v-if="hasProject">

            <!-- Add no project detail display -->
            <div
              class="no-project has-vcentered"
              style="height: 80%"
              v-if="!hasProject"
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
                  <span class="is-size-5 has-text-grey-dark">No Projects Available</span><br>
                  <span v-if="isOwner">Add a project by visiting the "MAVE Projects" page.</span>
                </p>
              </div>
            </div>

            <div
              class="project-header"
              v-if="hasProject"
            >
              <p class="is-size-4 has-text-weight-bold">
                Projects
              </p>
            </div>

            <div
              class="project-content"
              v-if="hasProject"
            >
              <p
                class="is-size-5"
                v-for="(project, id) in projects"
                :key="id"
              >
                <b class="is-capitalized">
                  {{ project.target.name.toUpperCase() }} ({{ project.target.type }}),
                  <i>{{ project.target.organism }}</i>
                </b>
                <br>
                <span class="has-text-grey is-size-6">Features: {{ project.features.join(", ") }}</span>
                <br>
                <span>
                  <router-link
                    :to="{ name: 'Project View', params: { id: project.id } }"
                    target="_blank"
                  >
                    <b-icon icon="mdil-link" />
                  </router-link>

                  <span v-if="project.activities">
                    {{ project.activities.type }},
                    <i>
                      {{ project.activities.start_date.toLocaleDateString() }} -
                      {{ project.activities.end_date ? project.activities.end_date.toLocaleDateString() : "Present" }}
                    </i>
                  </span>
                  <span v-else>
                    Under Investigation
                  </span>      
                </span>
              </p>
            </div>
          </div>

          <div class="column is-4 is-offset-2">
            <div class="project-header">
              <p class="is-size-4 has-text-weight-bold">
                About Team
              </p>
            </div>

            <div class="project-content">
              <p
                class="is-size-5"
                v-if="creator && creator.username"
              >
                <b>Creator</b> <br>
                <b-icon icon="mdil-account" />
                <router-link
                  :to="{ name: 'User Profile View', params: { username: creator.username } }"
                  target="_blank"
                  class="is-capitalized"
                >
                  {{ creator.first_name + ' ' + creator.last_name }}
                </router-link>
              </p>
              <p class="is-size-5">
                <b>Last Update</b> <br>
                <b-icon icon="mdil-clock" />
                {{ updatedDate.toLocaleString() }}
              </p>
              <div
                class="is-size-5"
                v-if="(followerCount > 0 || requestCount > 0) && isOwner"
              >
                <b>Follower{{ followerCount > 1 ? 's' : '' }}</b> <br>
                <div class="buttons">
                  <b-button
                    v-if="followerCount > 0"
                    class="action-button"
                    icon-left="mdil-settings"
                    type="is-light"
                    @click="openFollowerModal(false)"
                  >
                    Manage <b>{{ followerCount }}</b> Follower{{ followerCount > 1 ? 's' : '' }}
                  </b-button>
                  <b-button
                    v-if="requestCount > 0"
                    class="action-button"
                    icon-left="mdil-comment-text"
                    type="is-light"
                    @click="openFollowerModal(true)"
                  >
                    Review <b>{{ requestCount }}</b> Request{{ requestCount > 1 ? 's' : '' }}
                  </b-button>
                </div>
              </div>
            </div>

            <div
              class="project-header"
              v-if="hasActions"
            >
              <p class="is-size-4 has-text-weight-bold">
                Actions
              </p>
            </div>

            <div
              class="project-content action-buttons"
              v-if="hasActions"
            >
              <TransferAction
                type="team"
                :load-page="loadPage"
                :is-owner="isOwner"
                :target-id="teamId"
                @has-transfer="(e) => hasTransfer = e"
                style="margin-bottom: 0.5rem"
              />
              <b-button
                v-if="isModerator && !isOwner"
                icon-left="mdil-trophy"
                type="is-light"
                expanded
                @click="isConfirmObtainOnwershipModalActive = true"
                style="margin-bottom: 0.5rem"
              >
                Obtain Ownership
              </b-button>
              <b-button
                v-if="isOwner"
                icon-left="mdil-delete"
                type="is-light"
                expanded
                @click="isConfirmDeleteModalActive = true"
              >
                Delete Team
              </b-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Manage follower modal -->
      <ManageFollowerModal
        :active.sync="isManageFollowerModalActive"
        :target="teamId"
        :is-request="isRequest"
        type="team"
        @change="fetchFollowerAndRequestCount(teamId)"
      />

      <!-- Obtain ownership modal -->
      <ConfirmDangerModal
        :active.sync="isConfirmObtainOnwershipModalActive"
        type="team"
        action="obtain"
        :on-action="obtainTeam"
      >
        <p style="margin: 1rem 0">
          The current owner will not be notified.
        </p>
      </ConfirmDangerModal>

      <!-- Confirm Delete Modal -->
      <ConfirmDangerModal
        :active.sync="isConfirmDeleteModalActive"
        type="team"
        action="delete"
        :on-action="deleteTeam"
        :action-disabled="projects.length > 0"
      >
        <div
          v-if="projects.length > 0"
          style="margin-top: 0.5rem"
        >
          To deleted a team, it cannot have any associated projects. <br>
          This team has <b>{{ projects.length }}</b> projects. Please reassign them to other teams.
        </div>
      </ConfirmDangerModal>
    </div>
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import * as FollowManage from "@/api/followManage.js"
import Error from '@/components/Error.vue'
import ManageFollowerModal from '@/components/Modal/ManageFollowerModal.vue'
import { handleError } from '@/api/errorHandler.js'
import FollowButtonAction from '@/components/Action/FollowButtonAction.vue'
import TransferAction from '@/components/Action/TransferAction.vue'
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'

export default {
  title: "View Team",
  components: {
    Error,
    ManageFollowerModal,
    FollowButtonAction,
    TransferAction,
    ConfirmDangerModal
  },
  computed: {
    teamId() {
      return this.$route.params.id
    },
    hasProject() {
      return this.projects && this.projects.length > 0
    },
    hasActions() {
      return !!this.hasTransfer || this.isOwner || this.isModerator
    },
    isOwner() {
      return this.creator && this.creator.username && this.$store.getters.isOwner(this.creator.username)
    }
  },
  data () {
    return {
      isLoading: {
        page: false
      },
      isManageFollowerModalActive: false,
      isConfirmObtainOnwershipModalActive: false,
      isConfirmDeleteModalActive: false,
      followStatus: undefined,
      principalInvestigator: {},
      members: [],
      collaborators: [],
      projects: [],
      updatedDate: new Date(),
      creator: {},
      errorMessage: "",
      followerCount: 0,
      requestCount: 0,
      isRequest: false,
      hasTransfer: true,
      hasInitLoad: false
    }
  },
  watch: {
    async currentUser() {
      if (this.hasInitLoad) await this.loadPage()
    }
  },
  async mounted() {
    this.isLoading.page = true

    await this.loadPage()
    this.hasInitLoad = true
    
    // Open follow request modal if needed
    if (this.hasDeepLink("#manage-request")) this.openFollowerModal(true)
    
    this.isLoading.page = false
  },
  methods: {
    async loadPage() {
      this.errorMessage = ""
      
      // Fetch team
      const team = await this.fetchTeam()

      // Fetch team follower and request count
      if (team && this.isOwner) await this.fetchFollowerAndRequestCount(team.id)
    },
    async fetchTeam() {
      // Fetch team
      let team
      try {
        team = await TeamManage.queryById(this.teamId, true, true, true)
      } catch (error) {
        this.errorMessage = await handleError(error)
        return
      }

      // Format PI
      this.principalInvestigator = {
        first_name: team.first_name,
        last_name: team.last_name,
        email: team.email,
        affiliation: team.affiliation
      }
      if (team.website && team.website.length > 0) this.principalInvestigator.website = team.website

      // Format members
      if (team.members) this.members = team.members

      // Format creator and update date
      this.creator = team.creator
      this.updatedDate = team.update_date

      // Format projects and collaborators
      if (team.projects) {
        this.projects = team.projects
        const collaborators = team.projects.map(e => e.collaborators).filter(Boolean)
        if (collaborators.length > 0) this.collaborators = [].concat.apply([], collaborators)
      }

      // Format follow status
      if (team.follow_status) this.followStatus = team.follow_status
      
      return team
    },
    async fetchFollowerAndRequestCount(teamId) {
      try {
        this.followerCount = await FollowManage.countFollows(teamId, "team")
        this.requestCount = await FollowManage.countFollows(teamId, "team", true)
      } catch (error) {
        this.errorMessage = await handleError(error)
        throw error
      }
    },
    openFollowerModal(request) {
      this.isManageFollowerModalActive = true
      this.isRequest = request
    },
    editTeam() {
      this.$router.push({ name: 'Team Edit', params: { id: this.teamId, action: 'edit' } })
    },
    hasDeepLink(action) {
      return this.$route.hash === action
    },
    async obtainTeam() {
      await TeamManage.obtainTeam(this.teamId)
      await this.loadPage()
    },
    async deleteTeam() {
      await TeamManage.deleteTeam(this.teamId)
      this.$router.push({ name: 'Teams' })
    }
  }
}
</script>

<style lang="sass" scoped>
.action-button
  margin-top: 0.5rem
.member-icons
  margin: 0.5rem 0 0 0 !important
  &:not(:first-of-type)
    margin-left: 0.25rem !important
  img
    width: 32px
    height: 32px
</style>