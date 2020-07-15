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
                  Nominations
                </p>
              </div>
            </div>
            <div class="level-right">
              <!-- Nominate new target -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-mobile"
                @click="handleNewTargetModal()"
              >
                New Target
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="handleNewTargetModal()"
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
        :message="errorMessage"
        v-if="errorMessage !== ''"
      />

      <!-- Nomination table -->
      <div v-else>
        <!-- Tip -->
        <b-notification :closable="false">
          <div class="content">
            <b-icon
              class="header-icon"
              type="is-primary"
              custom-size="mdil-48px"
              icon="mdil-lightbulb-on"
            />
            <span>
              <b>What is a nomination?</b>
              <br>
              A nomination is a target of which variant effect maps we would love to see.
            </span>
          </div>
        </b-notification>

        <b-table
          :data="nominations"
          :loading="isLoading.page"
          hoverable
          paginated
          pagination-position="top"
          backend-pagination
          icon-pack="mdi"
          :per-page="pagination.limit"
          :total="pagination.count"
          :current-page="pagination.current"
          @page-change="(change) => { pagination.current = change; fetchNominations() }"
        >
          <!-- Filter -->
          <template slot="top-left">
            <!-- Filter by type -->
            <b-dropdown
              hoverable
              v-model="filter.type"
            >
              <b-button
                slot="trigger"
                slot-scope="{ active }"
                :type="filter.type ? 'is-info' : 'is-light'"
              >
                <b-icon
                  pack="mdi"
                  icon="filter-outline"
                  size="is-small"
                />
                <span>Type</span>
                <b-icon :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'" />
              </b-button>

              <b-dropdown-item
                v-if="filter.type !== ''"
                value=""
                class="has-text-info"
              >
                Clear Filter
              </b-dropdown-item>
              <b-dropdown-item
                v-for="(type, id) in types"
                :key="id"
                :value="type"
              >
                {{ type }}
              </b-dropdown-item>
            </b-dropdown>

            <!-- Filter by organism -->
            <b-dropdown
              hoverable
              v-model="filter.organism"
            >
              <b-button
                slot="trigger"
                slot-scope="{ active }"
                :type="filter.organism ? 'is-info' : 'is-light'"
              >
                <b-icon
                  pack="mdi"
                  icon="filter-outline"
                  size="is-small"
                />
                <span>Organism</span>
                <b-icon :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'" />
              </b-button>

              <b-dropdown-item
                v-if="filter.organism !== ''"
                value=""
                class="has-text-info"
              >
                Clear Filter
              </b-dropdown-item>
              <b-dropdown-item
                v-for="(organism, id) in organisms"
                :key="id"
                :value="organism"
              >
                <i>{{ organism }}</i>
              </b-dropdown-item>
            </b-dropdown>

            <!-- Filter by name -->
            <b-field style="margin-left: 0.5em">
              <b-input
                v-model="filter.name"
                placeholder="Search Name"
                type="search"
                icon="mdil-magnify"
              />
            </b-field>
          </template>

          <!-- No results -->
          <template slot="empty">
            <div
              class="no-project has-vcentered"
              v-if="!isLoading.page"
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
            <!-- Target name-->
            <b-table-column
              field="target_name"
              label="Name"
              class="is-uppercase"
            >
              {{ props.row.target.name }}
            </b-table-column>

            <!-- Target type -->
            <b-table-column
              field="target_type"
              label="Type"
              class="is-capitalized"
            >
              {{ props.row.target.type }}
            </b-table-column>

            <!-- Target species -->
            <b-table-column
              field="target_organism"
              label="Organism"
            >
              <i>{{ props.row.target.organism }}</i>
            </b-table-column>

            <!-- Reason -->
            <b-table-column
              field="reason"
              label="Reason"
              width="32vw"
            >
              {{ props.row.reason }}
            </b-table-column>

            <!-- Nominator -->
            <b-table-column
              field="nominator"
              label="Nominator"
              width="5vw"
            >
              <router-link
                :to="{ path: `/user/${props.row.by.username}`}"
                target="_blank"
              >
                <b-tag
                  size="is-medium"
                  class="is-capitalized shadow"
                >
                  <b-icon
                    icon="mdil-account"
                    class="team-icon"
                  />
                  {{ props.row.by.first_name }} {{ props.row.by.last_name }}
                </b-tag>
              </router-link>
            </b-table-column>

            <!-- Vote -->
            <b-table-column
              field="vote"
              label="Vote"
              width="5vw"
              v-if="isMember"
            >
              <b-field>
                <p class="control action-button">
                  <b-tooltip
                    label="Up Vote"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      icon-left="mdil-thumb-up"
                      @click="vote(props.row, 'up', props.index)"
                      :type="props.row.vote.current_user && props.row.vote.current_user.action === 'up' ? 'is-success' : 'is-light' "
                    >
                      {{ props.row.vote.up }}
                    </b-button>
                  </b-tooltip>
                </p>
                <p class="control action-button">
                  <b-tooltip
                    label="Down Vote"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      icon-left="mdil-thumb-down"
                      @click="vote(props.row, 'down', props.index)"
                      :type="props.row.vote.current_user && props.row.vote.current_user.action === 'down' ? 'is-danger' : 'is-light' "
                    >
                      {{ props.row.vote.down }}
                    </b-button>
                  </b-tooltip>
                </p>
              </b-field>
            </b-table-column>

            <!-- Action -->
            <b-table-column
              field="action"
              label="Action"
              width="5vw"
              v-if="hasLoggedIn"
            >
              <b-field>
                <p class="control action-button">
                  <b-tooltip
                    label="Add New Project"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      icon-right="mdil-plus"
                      @click="addNewProject(props.row)"
                      type="is-light"
                    />
                  </b-tooltip>
                </p>
                <p
                  class="control action-button"
                  v-if="currentUser && currentUser.username === props.row.by.username"
                >
                  <b-tooltip
                    label="Edit Nomination"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      icon-right="mdil-pencil"
                      type="is-light"
                      @click="handleNewTargetModal(props.row)"
                    />
                  </b-tooltip>
                </p>
                <p
                  class="control action-button"
                  v-if="currentUser && currentUser.username === props.row.by.username"
                >
                  <b-tooltip
                    label="Delete Nomination"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      icon-right="mdil-delete"
                      type="is-light"
                      @click="deleteNomination(props.row)"
                    />
                  </b-tooltip>
                </p>
              </b-field>
            </b-table-column>
          </template>
        </b-table>
      </div>

      <!-- New Target modal -->
      <NewTargetModal
        :active.sync="isNewTargetModalActive"
        :title="targetModalProps.title"
        :submit-text="targetModalProps.submit_text"
        :submit="targetModalProps.submit_function"
        :target="targetModalProps.target"
        :has-reason="targetModalProps.field === 'reason'"
        :has-feature="targetModalProps.field === 'feature'"
        @change="fetchNominations()"
      />
    </div>
  </div>
</template>

<script>
import * as NominationManage from "@/api/nominationManage.js"
import * as ProjectManage from "@/api/projectManage.js"
import { handleError } from "@/api/errorHandler.js"
import NewTargetModal from '@/components/Modal/NewTargetModal.vue'
import Error from '@/components/Error.vue'

const variables = require("@/assets/script/variables.json")

export default {
  components: {
    NewTargetModal,
    Error
  },
  watch: {
    filter: {
      deep: true,
      async handler() {
        await this.fetchNominations()
      }
    }
  },
  data() {
    return {
      errorMessage: "",
      nominations: [],
      isLoading: {
        page: false
      },
      pagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      filter: {
        type: "",
        organism: "",
        name: ""
      },
      types: variables.target_types,
      organisms: variables.target_organisms,
      isNewTargetModalActive: false,
      targetModalProps: {
        title: "Nominate a New Target",
        field: "reason",
        submit_text: "Nominate Target",
        target: undefined,
        submit_function: () => undefined
      }
    }
  },
  async mounted() {
    this.fetchNominations()
  },
  methods: {
    async fetchNominations() {
      this.isLoading.page = true

      // Calculate skip
      const skip = (this.pagination.current - 1) * this.pagination.limit

      try {
        const nominations = await NominationManage.fetchNominations(this.pagination.limit, skip, this.filter)
        this.nominations = nominations.results

        // Update count
        this.pagination.count = nominations.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.page = false
      }
    },
    handleNewTargetModal(prefilled = undefined) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      if (prefilled) {
        this.targetModalProps.title = "Edit a Nomination"
        this.targetModalProps.submit_text = "Edit Nomination"
        this.targetModalProps.submit_function = this.updateNomination
        this.targetModalProps.target = prefilled.target
        this.targetModalProps.target.id = prefilled.id
        this.targetModalProps.target.reason = prefilled.reason
      } else {
        this.targetModalProps.title = "Nominate a New Target"
        this.targetModalProps.submit_text = "Nominate Target",
        this.targetModalProps.submit_function = this.addNomination
        this.targetModalProps.target = undefined
      }
      this.targetModalProps.field = "reason"

      this.isNewTargetModalActive = true
    },
    addNewProject(prefilled) {
      this.targetModalProps.title = "Add a New Project"
      this.targetModalProps.submit_text = "Add Project"
      this.targetModalProps.target = prefilled.target
      this.targetModalProps.field = "feature"
      this.targetModalProps.submit_function = async (attrs) => {
        const projectId = await ProjectManage.addProject(attrs)

        // Jump to new project registration page
        this.$router.push({ name: 'Project Edit', params: { id: projectId, action: 'new' } })
      }

      this.isNewTargetModalActive = true

    },
    async addNomination(attrs) {
      // No need to catch error because it will be handled in the modal
      await NominationManage.addNomination(attrs)
    },
    async updateNomination(attrs) {
      // No need to catch error because it will be handled in the modal
      await NominationManage.updateNomination(attrs)
    },
    async deleteNomination(attrs) {
      this.$buefy.dialog.confirm({
        title: "Delete Nomination",
        message: "Are you sure you want to delete this nomination? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        iconPack: "mdi",
        hasIcon: true,
        onConfirm: async () => {
          // No need to catch error because it will be handled in the modal
          await NominationManage.deleteNomination(attrs)

          await this.fetchNominations()
        }
      })
    },
    async vote(object, field, index) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.isLoading.page = true

      try {
        // If already voted, we just have to update it
        if (object.vote && object.vote.current_user) {
          const voteId = object.vote.current_user.id
          await NominationManage.voteNomination(object.id, field, voteId)
        } else {
          await NominationManage.voteNomination(object.id, field)
        }
      } catch (error) {
        this.$buefy.toast.open({
          duration: 5000,
          message: await handleError(error),
          type: 'is-danger',
          queue: false
        })
        this.isLoading.page = false
        return
      }

      // Refresh vote status
      // Here, we have to update each property separately as Vue does not track object replacement reactively
      const votes = await NominationManage.queryVotes(object.id)
      this.nominations[index].vote = votes
      this.isLoading.page = false
    }
  }
}
</script>

<style lang="sass">
.b-table
  .tag
    height: 2.5rem !important
    padding: 0 1rem
</style>