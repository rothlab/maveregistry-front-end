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
                  Teams
                </p>
              </div>
            </div>
            <div
              class="level-right"
              v-if="hasLoggedIn"
            >
              <!-- Register new team -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-mobile"
                @click="addTeam"
              >
                New Team
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="addTeam"
              >
                New
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container has-fullheight has-top-padding has-touch-container-padding">
      <Error
        v-if="!isLoading.fetch_team && errorMessage !== ''"
        :message="errorMessage"
      />

      <!-- Team table -->
      <div v-else>
        <b-table
          :data="teams"
          :loading="isLoading.fetch_team"
          hoverable
          paginated
          pagination-position="top"
          backend-pagination
          icon-pack="mdi"
          :per-page="pagination.limit"
          :total="pagination.count"
          :current-page="pagination.current"
          @page-change="(change) => { pagination.current = change; fetchTeams() }"
        >
          <!-- Filter -->
          <template slot="top-left">
            <!-- Filter by PI -->
            <b-field>
              <b-input
                v-model="filter.pi"
                placeholder="Search Investigator"
                type="search"
                icon="mdil-magnify"
                @input="(query) => filterTeams(query, 'investigator')"
              />
            </b-field>
          </template>

          <!-- No results -->
          <template slot="empty">
            <div
              class="no-project has-vcentered"
              v-if="!isLoading.fetch_team"
            >
              <div class="info-icon">
                <b-icon
                  icon="mdil-clipboard"
                  custom-size="mdil-48px"
                  type="is-grey-light"
                />
              </div>
              <div class="info-content">
                <p class="has-text-grey">
                  <span class="is-size-5">Sorry, we couldn't find any results.</span>
                </p>
              </div>
            </div>
          </template>

          <template slot-scope="props">
            <!-- Principal Investigator -->
            <b-table-column
              field="principal_investigator"
              label="Principal Investigator"
            >
              <div class="level is-mobile is-paddingless">
                <div class="level-left">
                  <p>
                    <router-link
                      :to="{ path: `/team/${props.row.id}`}"
                      target="_blank"
                    >
                      <b class="is-capitalized">{{ props.row.first_name.startsWith(filter.pi) ? filter.pi : '' }}</b>{{ trimKeyword(props.row.first_name, filter.pi) }}
                      <b class="is-capitalized">{{ props.row.last_name.startsWith(filter.pi) ? filter.pi : '' }}</b>{{ trimKeyword(props.row.last_name, filter.pi) }}
                    </router-link>
                  </p>
                </div>

                <div class="level-right">
                  <!-- Email link -->
                  <a
                    v-if="props.row.website"
                    :href="props.row.website"
                    target="_blank"
                  >
                    <b-icon icon="mdil-link" />
                  </a>

                  <!-- Website icon -->
                  <a
                    v-if="props.row.email"
                    :href="`mailto:${props.row.email}`"
                  >
                    <b-icon icon="mdil-email" />
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
                <!-- If not member, show this panel to indicate that nothing is available -->
                <div
                  v-if="!props.row.projects || props.row.projects < 1"
                  class="card project-card has-background-light"
                >
                  <div class="card-header">
                    <p class="card-header-title is-capitalized">
                      <b-icon icon="mdil-play" />
                      Under Investigation
                    </p>
                  </div>
                </div>
                <b-collapse
                  v-else
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
                        {{ project.target.name.toUpperCase() }}
                        ({{ project.target.type }}, <i>{{ project.target.organism }}</i>):
                        {{ project.features.join(",") }}
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
                  v-if="props.row.follow_status && props.row.follow_status.id"
                  icon-left="mdil-bell-off"
                  :type="props.row.follow_status.status === 'pending' ? 'is-warning' : 'is-primary'"
                  @click="confirmUnfollow(props.row.follow_status.id)"
                  @change="fetchTeams"
                  class=""
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
                  type="is-light"
                  @click="confirmFollow(props.row.id)"
                  @change="fetchTeams"
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
import Error from '@/components/Error.vue'

// Helper
function capitalize(string) {
  return string.slice(0,1).toUpperCase() + string.slice(1)
}

export default {
  components: {
    NewTeamModal,
    FollowModal,
    UnfollowModal,
    Error
  },
  computed: {
    hasLoggedIn() {
      return this.$store.getters.hasLoggedIn
    }
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
        current: 1
      },
      followProp: {
        source: "",
        follow: "",
        type: "team"
      },
      filter: {
        pi: "",
      },
      errorMessage: ""
    }
  },
  async mounted() {
    await this.fetchTeams()
  },
  methods: {
    confirmFollow(id) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.followProp.source = id
      this.isFollowModelActive = true
    },
    confirmUnfollow(id) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.followProp.follow = id
      this.isUnfollowModelActive = true
    },
    async fetchTeams() {
      // Loading
      this.isLoading.fetch_team = true

      // Calculate skip
      const skip = (this.pagination.current - 1) * this.pagination.limit
      
      // Update targets
      try {
        const teams = await TeamManage.fetchTeams(this.pagination.limit, skip, ["project", "follow"])
        this.teams = teams.results

        // Update pagination
        this.pagination.count = teams.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.fetch_team = false
      }
    },
    addTeam() {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.isNewTeamModalActive = true
    },
    async filterTeams(query, type) {
      if (query === "") {
        this.fetchTeams()
        return
      }

      // Loading
      this.isLoading.fetch_team = true

      try {
        let teams
        switch (type) {
          case "investigator":
            teams = await TeamManage.queryByName(query, this.pagination.limit, 0, ["project", "follow"])
            break
          case "affiliation":
            // teams = await TeamManage.queryByAffiliation(query, this.pagination.limit, 0, ["project", "follow"])
            break
        }

        this.teams = teams.results
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
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return capitalize(string)
      return string.replace(keyword, '')
    }
  }
}
</script>