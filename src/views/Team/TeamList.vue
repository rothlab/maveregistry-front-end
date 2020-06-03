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
              {{ props.row.first_name + ' ' + props.row.last_name }}, 
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
    <b-modal
      :active.sync="isNewTeamModalActive"
      has-modal-card
      :can-cancel="['escape', 'outside']"
      @close="cleanupNewTeam()"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <span>Add a New Team</span>
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="isNewTeamModalActive = false; cleanupNewTeam();"
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
          
              <!-- First and last name -->
              <b-field
                grouped
                class="field-margin is-space-between"
              >
                <ValidationProvider
                  rules="required"
                  name="FirstName"
                  v-slot="{ errors, valid }"
                  class="name"
                >
                  <b-field
                    :message="errors"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="First Name"
                  >
                    <b-input
                      type="text"
                      placeholder="First Name"
                      v-model="newTeamProp.first_name"
                    />
                  </b-field>
                </ValidationProvider>
                <ValidationProvider
                  rules="required"
                  name="LastName"
                  v-slot="{ errors, valid }"
                  class="name"
                >
                  <b-field
                    :message="errors"
                    :type="{ 'is-danger': errors[0], '': valid }"
                    label="Last Name"
                  >
                    <b-input
                      type="text"
                      placeholder="Last Name"
                      v-model="newTeamProp.last_name"
                    />
                  </b-field>
                </ValidationProvider>
              </b-field>

              <!-- Email -->
              <ValidationProvider
                rules="required|email"
                name="Email"
                v-slot="{ errors, valid }"
              > 
                <b-field
                  :message="errors"
                  class="field-margin"
                  :type="{ 'is-danger': errors[0], '': valid }"
                  label="Email"
                >
                  <b-input
                    icon="mdil-email"
                    type="email"
                    placeholder="Email"
                    v-model="newTeamProp.email"
                  />
                </b-field>
              </ValidationProvider>

              <!-- Association -->
              <ValidationProvider
                rules="required"
                name="Affiliation"
                v-slot="{ errors, valid }"
              > 
                <b-field
                  :message="errors"
                  class="field-margin"
                  :type="{ 'is-danger': errors[0], '': valid }"
                  label="Affiliation"
                >
                  <b-input
                    icon="mdil-factory"
                    v-model="newTeamProp.affiliation"
                    type="affiliation"
                    placeholder="Affiliation"
                  />
                </b-field>
              </ValidationProvider>

              <!-- Website -->
              <ValidationProvider
                :rules="{ regex: 
                  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ 
                }"
                name="Website (Optional)"
                v-slot="{ errors, valid }"
                immediate
              > 
                <b-field
                  :message="errors"
                  class="field-margin"
                  :type="{ 'is-danger': errors[0], '': valid }"
                  label="Website (Optional)"
                >
                  <b-input
                    icon="mdil-link"
                    type="website"
                    placeholder="http:// or https://"
                    v-model="newTeamProp.website"
                  />
                </b-field>
              </ValidationProvider>
            </div>
          </section>

          <footer class="modal-card-foot">
            <b-button
              expanded
              :loading="isLoading.new_team"
              :disabled="!passed"
              type="is-primary"
              @click="addTeam(newTeamProp); cleanupNewTeam()"
            >
              Add Team
            </b-button>
          </footer>
        </ValidationObserver>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as TeamManage from "@/api/teamManage"

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      isNewTeamModalActive: false,
      isLoading: {
        fetch_team: false,
        new_team: false
      },
      newTeamProp: {
        first_name: "",
        last_name: "",
        email: "",
        affiliation: "",
        website: ""
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
    cleanupNewTeam() {
      this.newTeamProp = {
        first_name: "",
        last_name: "",
        email: "",
        affiliation: "",
        website: ""
      }
    },
    async addTeam(team) {
      this.isLoading.new_team = true

      await TeamManage.addTeam(team)

      this.isLoading.new_team = false
    },
    async fetchTeams(limit = 10, skip = 0) {
      // Loading
      this.isLoading.fetch_team = true

      // Update targets
      const teams = await TeamManage.fetchTeams(limit, skip)
      this.teams = teams.results

      // Update pagination
      this.pagination.count = teams.count

      this.isLoading.fetch_team = false
    }
  }
}
</script>