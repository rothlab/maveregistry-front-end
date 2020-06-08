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
                  Team Progress
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
              <span class="is-capitalized">
                {{ props.row.first_name + ' ' + props.row.last_name }}
              </span>
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
              label="Project Progress"
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
                        {{ project.name + ": " + project.type }}
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
              width="8vw"
            >
              <div class="action-button is-flex">
                <b-button
                  icon-left="mdil-rss"
                  @click="prepareNewActivity(props.row); isNewActivityModalActive = true"
                >
                  Follow Team
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
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import NewTeamModal from "@/components/NewTeamModal.vue"

export default {
  components: {
    NewTeamModal
  },
  data() {
    return {
      isNewTeamModalActive: false,
      isLoading: {
        fetch_team: false,
        new_team: false
      },
      teams: [
        {
          id: "123",
          first_name: "Fritz",
          last_name: "Roth",
          affiliation: "University of Toronto",
          projects: [
            {
              id: "123",
              name: "CHEK2",
              type: "kk",
              open_for_funding: true
            },
            {
              id: "1234",
              name: "SDHB",
              type: "kkk",
              open_for_funding: false
            }
          ]
        }
      ],
      pagination: {
        count: 0,
        limit: 10,
        skip: 0
      },
    }
  },
  async mounted() {
    await this.fetchTeams()
  },
  methods: {
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
          message: error.message,
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