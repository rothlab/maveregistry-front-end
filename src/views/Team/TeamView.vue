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
                  <span class="is-hidden-mobile">View</span>
                  Team
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
              v-else-if="hasLoggedIn && followStatus" 
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
                style="margin-bottom: 1em"
              >
                <div class="is-flex has-vcentered">
                  <span><b>Member{{ members.length > 1 ? 's' : '' }}</b></span>
                  <div
                    class="is-inline-flex"
                    style="margin-left: 0.5rem"
                  >
                    <!-- Owner view -->
                    <div v-if="isOwner">
                      <!-- Invite to join team -->
                      <b-button
                        icon-left="mdil-plus"
                        rounded
                        size="is-small"
                        style="margin: 0.5rem 0.5rem 0 0"
                        type="is-link"
                        outlined
                        @click="isInviteModalActive = true"
                      >
                        Invite
                      </b-button>

                      <!-- Review join team request-->
                      <b-button
                        v-if="joinRequests.length > 0"
                        icon-left="mdil-comment-text"
                        rounded
                        size="is-small"
                        style="margin: 0.5rem 0.5rem 0 0"
                        type="is-primary"
                        outlined
                        @click="isReviewJoinRequestModalActive = true"
                      >
                        Review {{ joinRequests.length }} join {{ joinRequests.length > 1 ? "requests" : "request" }}
                      </b-button>
                    </div>

                    <!-- Other member view -->
                    <div v-else>
                      <!-- Join team -->
                      <b-button
                        v-if="!memberStats"
                        icon-left="mdil-plus"
                        rounded
                        size="is-small"
                        style="margin: 0.5rem 0.5rem 0 0"
                        type="is-link"
                        outlined
                        @click="isJoinTeamModalActive = true"
                      >
                        Join team
                      </b-button>
                  
                      <!-- Leave team -->
                      <b-button
                        v-else-if="memberStats !== 'invited'"
                        :icon-left="memberStats === 'pending' ? 'mdil-clock' : 'mdil-logout'"
                        rounded
                        size="is-small"
                        style="margin: 0.5rem 0.5rem 0 0"
                        type="is-danger"
                        outlined
                        @click="isLeaveTeamModalActive = true"
                      >
                        {{ memberStats === "pending" ? "Request pending approval" : "Leave team" }}
                      </b-button>

                      <!-- Review invitation -->
                      <b-button
                        v-else
                        rounded
                        size="is-small"
                        style="margin: 0.5rem 0.5rem 0 0"
                        icon-left="mdil-comment-text"
                        type="is-primary"
                        outlined
                        @click="isReviewInvitationModalActive = true"
                      >
                        Review Invitation
                      </b-button>
                    </div>
                  </div>
                </div>

                <figure
                  v-for="(member, id) in members"
                  :key="id"
                  class="image is-32x32 is-inline-block member-icons"
                >
                  <router-link
                    :to="{ name: 'User Profile View', params: { username: member.member.username } }"
                    target="_blank"
                    class="is-capitalized"
                  >
                    <b-tooltip
                      :label="`${member.member.first_name} ${member.member.last_name}`"
                      type="is-dark"
                    >
                      <img
                        :src="getProfileImageFromUser(member.member)"
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
              <div class="level is-mobile">
                <div class="level-left">
                  <p class="is-size-4 has-text-weight-bold">
                    Projects
                  </p>
                </div>
                <div class="level-right">
                  <b-pagination
                    :total="pagination.total"
                    :per-page="pagination.limit"
                    :current.sync="pagination.current"
                    icon-pack="mdil"
                    icon-prev="chevron-left"
                    order="is-right"
                    simple
                  />
                </div>
              </div>
            </div>

            <div
              class="project-content"
              v-if="hasProject"
            >
              <p
                class="is-size-5"
                v-for="(project, id) in projects.slice((pagination.current - 1) * pagination.limit, pagination.current * pagination.limit)"
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
              v-if="isMember"
            >
              <p class="is-size-4 has-text-weight-bold">
                Actions
              </p>
            </div>

            <div
              class="project-content action-buttons"
              v-if="isMember"
            >
              <TransferAction
                type="team"
                :load-page="loadPage"
                :is-owner="isOwner"
                :target-id="teamId"
                @transfer="loadPage"
                style="margin-bottom: 0.5rem"
              />
              <ReuqestOwnershipAction
                type="team"
                :target-id="teamId"
                :on-action="obtainTeam"
                :is-owner="isOwner"
                style="margin-bottom: 0.5rem"
              />
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

      <!-- Confirm Join Team Modal -->
      <ConfirmInfoModal
        :active.sync="isJoinTeamModalActive"
        action="join"
        type="team"
        :is-irreversible="false"
        :on-action="joinTeam"
      >
        <div style="margin-top: 1rem">
          Your request will be submitted to team creator
          <figure
            class="image is-24x24 is-inline-flex"
            style="margin: 0 0.25rem"
          >
            <img
              class="is-rounded"
              :src="getProfileImageFromUser(creator)"
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
        </div>
      </ConfirmInfoModal>

      <!-- Review Invitation Modal -->
      <ConfirmInfoModal
        :active.sync="isReviewInvitationModalActive"
        action="accept"
        type="invitation"
        :is-irreversible="false"
        :on-action="acceptInvitation"
      >
        <b-message
          v-if="invitationMessage"
          type="is-info"
        >
          <p class="is-size-5">
            <b-icon icon="mdil-message-text" />
            <span>Message</span>
          </p>
          {{ invitationMessage }}
        </b-message>
      </ConfirmInfoModal>

      <!-- Confirm Leave Team Modal -->
      <ConfirmDangerModal
        :active.sync="isLeaveTeamModalActive"
        :type="memberStats === 'pending' ? 'request' : 'team'"
        :action="memberStats === 'pending' ? 'retract' : 'leave'"
        :on-action="leaveTeam"
      >
        <p style="margin-top: 1rem">
          {{ memberStats === "pending" ? "To join" : "To rejoin" }}
          the team later, you need to request again.
        </p>
      </ConfirmDangerModal>

      <!-- Confirm Review Join Team Modal -->
      <ManageTeamJoinModal
        :active.sync="isReviewJoinRequestModalActive"
        :requests="joinRequests"
        @change="loadPage"
      />

      <!-- Invite to join team modal -->
      <InviteModal
        type="team"
        action="join"
        :type-id="teamId"
        :active.sync="isInviteModalActive"
        :members="members"
      />
    </div>
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import * as FollowManage from "@/api/followManage.js"
import * as InviteManage from "@/api/inviteManage.js"
import * as TransferManage from "@/api/transferManage.js"
import uniqBy from "lodash/uniqBy"
import Error from '@/components/Error.vue'
import ManageFollowerModal from '@/components/Modal/ManageFollowerModal.vue'
import ManageTeamJoinModal from '@/components/Modal/ManageTeamJoinModal.vue'
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'
import ConfirmInfoModal from '@/components/Modal/ConfirmInfoModal.vue'
import InviteModal from '@/components/Modal/InviteModal.vue'
import { handleError } from '@/api/errorHandler.js'
import FollowButtonAction from '@/components/Action/FollowButtonAction.vue'
import TransferAction from '@/components/Action/TransferAction.vue'
import ReuqestOwnershipAction from '@/components/Action/RequestOwnershipAction.vue'

export default {
  title: "View Team",
  components: {
    Error,
    ManageFollowerModal,
    InviteModal,
    ManageTeamJoinModal,
    ConfirmDangerModal,
    ConfirmInfoModal,
    FollowButtonAction,
    TransferAction,
    ReuqestOwnershipAction
  },
  computed: {
    teamId() {
      return this.$route.params.id
    },
    hasProject() {
      return this.projects && this.projects.length > 0
    },
    isOwner() {
      return this.creator && this.creator.username && this.$store.getters.isOwner(this.creator.username)
    },
    memberStats() {
      if (this.currentUser) {
        if (this.members.some(e => e.member.username === this.currentUser.username)) return "member"
        if (this.hasRequestedJoinTeam) return "pending"
        if (this.hasInvitedJoinTeam) return "invited"
      }

      return undefined
    }
  },
  data () {
    return {
      isLoading: {
        page: false
      },
      isManageFollowerModalActive: false,
      isConfirmDeleteModalActive: false,
      isJoinTeamModalActive: false,
      isLeaveTeamModalActive: false,
      isInviteModalActive: false,
      isReviewJoinRequestModalActive: false,
      isReviewInvitationModalActive: false,
      followStatus: undefined,
      principalInvestigator: {},
      joinRequests: [],
      members: [],
      memberId: "",
      hasRequestedJoinTeam: false,
      hasInvitedJoinTeam: false,
      invitationMessage: "",
      collaborators: [],
      projects: [],
      pagination: {
        total: 0,
        limit: 5,
        current: 1
      },
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
    await this.loadPage()
    this.hasInitLoad = true
    
    if (this.isOwner) {
      // Open follow request modal if needed
      if (this.hasDeepLink("#manage-request")) this.openFollowerModal(true)

      // Open join request review modal if needed
      if (this.hasDeepLink("#review-join-team-request")) this.isReviewJoinRequestModalActive = true
    } else {
      // Open accept invitation modal if needed
      if (this.hasDeepLink("#review-invitation") && this.memberStats === 'invited') this.isReviewInvitationModalActive = true
    }
  },
  methods: {
    async loadPage() {
      this.errorMessage = ""
      this.isLoading.page = true
      
      // Fetch team
      try {
        const team = await this.fetchTeam()

        // If no team, don't parse properties
        if (!team) return

        // Format members
        if (team.members) {
          // For owner, separate join requests
          if (this.isOwner) {
            this.joinRequests = team.members.filter(member => member.type === "request" && !member.approved_at)
          } else {
            // For member or request submiteer, get member/requestId
            const member = team.members.filter(e => e.member.username == this.currentUser.username)
            if (member && member.length === 1) {
              this.memberId = member[0].id
              this.hasRequestedJoinTeam = member[0].type === "request" && !member[0].approved_at
              this.hasInvitedJoinTeam = member[0].type === "invite" && !member[0].approved_at
              // Get invitation message
              if (this.hasInvitedJoinTeam)
                this.invitationMessage = await InviteManage.queryInvitationMessage("team", this.teamId)
            } else {
              this.memberId = ""
              this.hasRequestedJoinTeam = false
              this.hasInvitedJoinTeam = false
            }
          }

          // Choose only approved members
          this.members = team.members.filter(member => member.approved_at)
        }

        // Fetch team follower and request count
        if (team && this.isOwner) await this.fetchFollowerAndRequestCount(team.id)
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.page = false
      }
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

      // Format creator and update date
      this.creator = team.creator
      this.updatedDate = team.update_date

      // Format projects and collaborators
      if (team.projects) {
        this.projects = team.projects
        this.pagination.total = this.projects.length
        const collaborators = team.projects.map(e => e.collaborators).filter(Boolean)
        if (collaborators.length > 0) this.collaborators = uniqBy([].concat.apply([], collaborators), "id")
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
      // If moderator, obtain project
      if (this.isModerator) {
        await TeamManage.obtainTeam(this.teamId)
      } else {
        const target = {
          type: "team",
          id: this.teamId
        }
        await TransferManage.requestOwnership(target, this.creator.id)
      }

      await this.loadPage()
    },
    async deleteTeam() {
      await TeamManage.deleteTeam(this.teamId)
      this.$router.push({ name: 'Teams' })
    },
    async joinTeam() {
      await TeamManage.joinTeam(this.teamId, "request")
      await this.loadPage()
    },
    async leaveTeam() {
      await TeamManage.leaveTeam(this.memberId)
      await this.loadPage()
    },
    async acceptInvitation() {
      await TeamManage.acceptInvitation(this.memberId)
      await this.loadPage()
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