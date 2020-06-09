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
                  Team Summary
                </p>
              </div>
            </div>
            <div class="level-right">
              <!-- Register new team -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-mobile"
                @click="isNewTeamModalActive = true"
              >
                New Team
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="isNewTeamModalActive = true"
              >
                New
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <!-- Team table -->
      <div>
        <!-- TODO: proper pagination -->
        <b-table
          :data="teams"
          :loading="isLoading.fetch_team"
          hoverable
          paginated
          backend-pagination
          icon-pack="mdi"
          :per-page="pagination.limit"
        >
          <template slot-scope="props">
            <!-- Team ID -->
            <b-table-column
              field="team_id"
              label="Team ID"
            >
              <router-link
                :to="{ path: `/team/${props.row.id}`}"
                target="_blank"
              >
                {{ props.row.id }}
              </router-link>
            </b-table-column>

            <!-- Principal Investigator -->
            <b-table-column
              field="principal_investigator"
              label="Principal Investigaor"
            >
              <div class="level is-mobile is-paddingless">
                <div class="level-left is-capitalized">
                  {{ props.row.first_name + ' ' + props.row.last_name }}
                </div>

                <div class="level-right">
                  <!-- Email link -->
                  <a
                    v-if="props.row.email"
                    :href="`mailto:${props.row.email}`"
                  >
                    <b-icon icon="mdil-email" />
                  </a>

                  <!-- Website icon -->
                  <a
                    v-if="props.row.website"
                    :href="props.row.website"
                    target="_blank"
                  >
                    <b-icon icon="mdil-link" />
                  </a>
                </div>
              </div>
            </b-table-column>

            <!-- Affiliation -->
            <b-table-column
              field="affiliation"
              label="Affiliation"
            >
              {{ props.row.affiliation }}
            </b-table-column>

            <!-- Project Progress -->
            <b-table-column
              field="progress"
              label="Project"
            >
              <div class="has-text-left">
                <b-collapse
                  class="card project-card has-background-light"
                  animation="slide"
                  v-for="(project, index) in props.row.projects"
                  :key="index"
                  :open="false"
                >
                  <div
                    slot="trigger"
                    class="card-header"
                    role="button"
                  >
                    <div class="card-header-title is-capitalized">
                      <router-link
                        :to="{ path: `/project/${project.id}`}"
                        target="_blank"
                      >
                        <b-icon icon="mdil-link" />
                        {{ project.target.name }} ({{ project.target.type }}): {{ project.features.join(",") }}
                      </router-link>
                    </div>
                    
                    <div class="card-header-icon">
                      <b-tooltip
                        label="Seek Funding"
                        v-if="project.open_for_funding"
                        type="is-warning"
                      >
                        <b-icon
                          class="circle-icon has-background-warning"
                          icon="mdil-currency-usd"
                        />
                      </b-tooltip>
                    </div>
                  </div>
                </b-collapse>
              </div>
            </b-table-column>

            <!-- Action -->
            <b-table-column
              field="action"
              label="Action"
              width="5vw"
            >
              <div class="action-button is-flex">
                <b-button
                  v-if="props.row.follow_status.id"
                  icon-left="mdil-bell-off"
                  :type="props.row.follow_status.status === 'pending' ? 'is-warning' : 'is-primary'"
                  @click="confirmUnfollow(props.row.follow_status.id)"
                  @change="fetchTeams()"
                  expanded
                >
                  <b-tooltip
                    v-if="props.row.follow_status.status === 'pending'"
                    label="Pending Approval"
                    type="is-dark"
                  >
                    Unfollow
                  </b-tooltip>
                  <span v-else>Unfollow</span>
                </b-button>
                <b-button
                  v-else
                  icon-left="mdil-bell"
                  @click="confirmFollow(props.row.id)"
                  @change="fetchTeams()"
                  expanded
                >
                  Follow
                </b-button>
              </div>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </div>

    <!-- New Team Modal -->
    <NewTeamModal
      :active.sync="isNewTeamModalActive"
      @change="fetchTeams"
    />

    <!-- Follow Team Modal -->
    <FollowModal
      :active.sync="isFollowModelActive"
      :source="followProp.source"
      :type="followProp.type"
      @change="fetchTeams()"
    />

    <!-- Unfollow Team Modal -->
    <UnfollowModal
      :active.sync="isUnfollowModelActive"
      :follow="followProp.follow"
      :type="followProp.type"
      @change="fetchTeams()"
    />
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import NewTeamModal from "@/components/Modal/NewTeamModal.vue"
import FollowModal from '@/components/Modal/FollowModal.vue'
import UnfollowModal from '@/components/Modal/UnfollowModal.vue'
import { handleError } from "@/api/errorHandler.js"

export default {
  components: {
    NewTeamModal,
    FollowModal,
    UnfollowModal
  },
  data() {
    return {
      isNewTeamModalActive: false,
      isFollowModelActive: false,
      isUnfollowModelActive: false,
      isLoading: {
        fetch_team: false,
        new_team: false
      },
      teams: [],
      pagination: {
        count: 0,
        limit: 10,
        skip: 0
      },
      followProp: {
        source: "",
        follow: "",
        type: "team"
      },
    }
  },
  async mounted() {
    await this.fetchTeams()
  },
  methods: {
    confirmFollow(id) {
      this.followProp.source = id
      this.isFollowModelActive = true
    },
    confirmUnfollow(id) {
      this.followProp.follow = id
      this.isUnfollowModelActive = true
    },
    async fetchTeams(limit = 10, skip = 0) {
      // Loading
      this.isLoading.fetch_team = true

      // Update targets
      try {
        const teams = await TeamManage.fetchTeams(limit, skip)
        this.teams = teams.results

        // Update pagination
        this.pagination.count = teams.count
      } catch (error) {
        this.$buefy.toast.open({
          message: await handleError(error),
          type: 'is-danger',
          queue: false,
          duration: 5000
        })
      } finally {
        this.isLoading.fetch_team = false
      }
    }
  }
}
</script>