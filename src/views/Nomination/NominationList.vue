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
                  Nominations
                </p>
              </div>
            </div>
            <div class="level-right">
              <!-- Nominate new target -->
              <!-- Non-mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-warning"
                size="is-medium"
                class="is-hidden-mobile small-shadow"
                @click="handleNewTargetModal()"
              >
                Nominate a Target
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-warning"
                size="is-medium"
                class="is-hidden-tablet small-shadow"
                @click="handleNewTargetModal()"
              >
                Nominate
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
        <TipAction tip="nomination">
          <p class="has-text-weight-bold field-margin description">
            What is a
            <span class="has-text-info">nomination</span>
            ?
          </p>
          A nomination is a target sequence feature for which we will love to see a variant effect map.
        </TipAction>

        <!-- Add key here so that when user log in/out, the table columns will be refreshed -->
        <b-table
          :key="JSON.stringify(currentUser)" 
          :data="nominations"
          :loading="isLoading.page"
          hoverable
          paginated
          pagination-position="top"
          backend-pagination
          icon-pack="mdil"
          :per-page="pagination.limit"
          :total="pagination.count"
          :current-page="pagination.current"
          @page-change="(change) => { pagination.current = change; fetchNominations() }"
        >
          <!-- Filter -->
          <!-- These filters will be on the same line -->
          <template slot="top-left">
            <div class="filter-same-line">
              <!-- Filter by type -->
              <b-dropdown
                :triggers="['hover', 'click']"
                v-model="filter.type"
                :mobile-modal="false"
                @input="fetchNominations()"
                class="filter-item"
              >
                <b-button
                  slot="trigger"
                  slot-scope="{ active }"
                  :type="filter.type ? 'is-info' : 'is-light'"
                >
                  <FilterOutline
                    class="filter-icon icon-18px"
                  />
                  <span style="margin-left: 0.25rem">Type</span>
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
                :triggers="['hover', 'click']"
                v-model="filter.organism"
                :mobile-modal="false"
                position="is-bottom-left"
                @input="fetchNominations()"
                class="filter-item"
              >
                <b-button
                  slot="trigger"
                  slot-scope="{ active }"
                  :type="filter.organism ? 'is-info' : 'is-light'"
                >
                  <FilterOutline
                    class="filter-icon icon-18px"
                  />
                  <span style="margin-left: 0.25rem">Organism</span>
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

              <!-- Filter by ID (only shown when a query param is available) -->
              <b-tag
                style="height: 2.5rem !important; font-size: 16px"
                type="is-info"
                closable
                @close="clearIdFilter"
                v-if="queryId"
                class="filter-item"
              >
                ID: {{ queryId }}
              </b-tag>

              <!-- Filter by creation date -->
              <b-datepicker
                v-model="filter.created_after"
                placeholder="Created Since"
                icon="mdil-calendar"
                icon-prev="mdil-chevron-left"
                icon-next="mdil-chevron-right"
                :class="{ 'highlight-filter': filter.created_after }"
                :max-date="new Date()"
                @input="fetchNominations()"
                class="filter-item"
              >
                <template v-slot:trigger>
                  <b-tooltip
                    label="Target nominated on or after this date"
                    type="is-dark"
                  >
                    <b-button
                      :type="filter.created_after ? 'is-info' : 'is-light'"
                    >
                      <FilterOutline
                        class="filter-icon icon-18px"
                      />
                      <span>
                        {{ filter.created_after ? filter.created_after.toLocaleDateString() : "Date" }}
                      </span>
                    </b-button>
                  </b-tooltip>
                </template>
                <b-button
                  type="is-info"
                  outlined
                  @click="filter.created_after = undefined; fetchNominations()"
                  expanded
                  v-if="filter.created_after"
                >
                  Clear Filter
                </b-button>
              </b-datepicker>

              <!-- Filter by name -->
              <b-field
                class="filter-item"
                style="width: 10rem"
              >
                <b-input
                  v-model="filter.name"
                  placeholder="Search Name"
                  icon="mdil-magnify"
                  :icon-right="filter.name ? 'mdil-delete': ''"
                  icon-right-clickable
                  @icon-right-click="filter.name = ''; fetchNominations()"
                  :class="{ 'highlight-filter': filter.name }"
                  @input="debouncedFetchNominations()"
                />
              </b-field>
            </div>
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

          <!-- Target name-->
          <b-table-column
            field="target_name"
            label="Name"
            class="is-uppercase"
            v-slot="props"
          >
            {{ props.row.target.name }}
          </b-table-column>

          <!-- Target type -->
          <b-table-column
            field="target_type"
            label="Type"
            class="is-capitalized"
            v-slot="props"
          >
            {{ props.row.target.type }}
          </b-table-column>

          <!-- Target species -->
          <b-table-column
            field="target_organism"
            label="Organism"
            v-slot="props"
          >
            <i>{{ props.row.target.organism }}</i>
          </b-table-column>

          <!-- Reason -->
          <b-table-column
            field="reason"
            label="Reason"
            width="32vw"
            v-slot="props"
          >
            {{ props.row.reason }}
          </b-table-column>

          <!-- Nominator -->
          <b-table-column
            field="nominator"
            label="Nominator"
            width="5vw"
            v-slot="props"
          >
            <router-link
              :to="{ path: `/user/${props.row.by.username}`}"
              target="_blank"
            >
              <b-tag
                size="is-medium"
                class="is-capitalized shadow has-fullwidth"
                style="justify-content: left"
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
            v-slot="props"
          >
            <b-field>
              <p class="control action-button">
                <b-tooltip
                  label="Up Vote"
                  type="is-success"
                  position="is-left"
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
                  type="is-danger"
                  position="is-left"
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
            v-slot="props"
          >
            <b-field>
              <p
                class="control action-button"
                v-if="hasLoggedIn"
              >
                <b-tooltip
                  label="Add New Project"
                  type="is-dark"
                  position="is-left"
                >
                  <b-button
                    icon-right="mdil-plus"
                    @click="addNewProject(props.row)"
                    type="is-light"
                  />
                </b-tooltip>
              </p>
              <p class="control action-button">
                <b-tooltip
                  v-if="props.row.target.type == 'Gene' && props.row.target.organism == 'H. sapiens'"
                  label="Explore at MaveQuest"
                  type="is-info"
                  position="is-left"
                >
                  <b-button
                    tag="a"
                    :href="'https://mavequest.varianteffect.org/query?gene=' + props.row.name"
                    target="_blank"
                    type="is-light"
                    class="mavequest-button"
                  >
                    <img src="@/assets/image/mavequest_logo_grey.png">
                  </b-button>
                </b-tooltip>
                <b-tooltip
                  v-else
                  label="Look up"
                  type="is-info"
                  position="is-left"
                >
                  <b-button
                    tag="a"
                    :href="'https://www.google.com/search?q=' + props.row.name"
                    rel="noopener noreferrer"
                    target="_blank"
                    icon-right="mdil-magnify"
                    type="is-light"
                  />
                </b-tooltip>
              </p>
              <p
                class="control action-button"
                v-if="hasLoggedIn && currentUser && currentUser.username === props.row.by.username"
              >
                <b-tooltip
                  label="Edit Nomination"
                  type="is-dark"
                  position="is-left"
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
                v-if="hasLoggedIn && currentUser && currentUser.username === props.row.by.username"
              >
                <b-tooltip
                  label="Delete Nomination"
                  position="is-left"
                  type="is-dark"
                >
                  <b-button
                    icon-right="mdil-delete"
                    type="is-light"
                    @click="selectedNomination = props.row; isConfirmDeleteModalActive = true"
                  />
                </b-tooltip>
              </p>
            </b-field>
          </b-table-column>
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

      <!-- Confirm Delete Modal -->
      <ConfirmDangerModal
        :active.sync="isConfirmDeleteModalActive"
        type="nomination"
        action="delete"
        :on-action="deleteNomination"
        title="Delete Nomination"
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
import TipAction from '@/components/Action/TipAction.vue'
import FilterOutline from "vue-material-design-icons/FilterOutline.vue"
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'
import debounce from 'lodash/debounce'

const variables = require("@/assets/script/variables.json")

export default {
  title: "Nominations",
  components: {
    NewTargetModal,
    Error,
    TipAction,
    FilterOutline,
    ConfirmDangerModal
  },
  watch: {
    async currentUser() {
      if (this.hasInitLoad) await this.fetchNominations()
    },
    async '$route.query.id'() {
      await this.fetchNominations()
    }
  },
  computed: {
    queryId() {
      if (this.$route.query && this.$route.query.id) return this.$route.query.id

      return undefined
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
        name: "",
        created_after: undefined
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
      },
      selectedNomination: undefined,
      isConfirmDeleteModalActive: false,
      hasInitLoad: false
    }
  },
  async mounted() {
    // If filter queries are supplied, process them
    if (this.$route.query) {
      if (this.$route.query.type) this.filter.type = this.$route.query.type
      if (this.$route.query.name) this.filter.name = this.$route.query.name
      if (this.$route.query.organism) this.filter.organism = this.$route.query.organism
      if (this.$route.query.created_after) {
        const convertedDate = new Date(this.$route.query.created_after)
        if (Object.prototype.toString.call(convertedDate) === '[object Date]' && isFinite(convertedDate)) {
          this.filter.created_after = convertedDate
        }
      }
    }
    await this.fetchNominations()
    this.hasInitLoad = true
  },
  methods: {
    async fetchNominations() {
      this.isLoading.page = true

      // Check if an ID is provided, if so, use it
      if (this.queryId) {
        try {
          const nomination = await NominationManage.queryById(this.queryId)
          this.nominations = [nomination]

          // Update count
          this.pagination.count = 1
        } catch (error) {
          this.errorMessage = await handleError(error)
        } finally {
          this.isLoading.page = false
        }

        return
      }

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
    debouncedFetchNominations: debounce(async function() {
      return await this.fetchNominations()
    }, 500),
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
    async deleteNomination() {
      await NominationManage.deleteNomination(this.selectedNomination)
      await this.fetchNominations()
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
    },
    clearIdFilter() {
      this.$router.push({ path: 'Nominations' })
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