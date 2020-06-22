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
                @click="handleNewTargetModal"
              >
                New Target
              </b-button>
              <!-- Mobile style -->
              <b-button
                icon-left="mdil-plus"
                type="is-primary"
                size="is-medium"
                class="is-hidden-tablet"
                @click="handleNewTargetModal"
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
        <b-table
          :data="nominations"
          :loading="isLoading.page"
        >
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
            >
              {{ props.row.reason }}
            </b-table-column>

            <!-- Nominator -->
            <b-table-column
              field="nominator"
              label="Nominator"
            >
              <router-link
                :to="{ path: `/user/${props.row.by.username}`}"
                target="_blank"
              >
                <b-tag
                  size="is-medium"
                  class="is-capitalized"
                >
                  <b-icon
                    icon="mdil-account"
                    class="team-icon"
                  />
                  {{ props.row.by.first_name }} {{ props.row.by.last_name }}
                </b-tag>
              </router-link>
            </b-table-column>

            <!-- Action -->
            <b-table-column
              field="action"
              label="Action"
              width="9vw"
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
                      @click="vote(props.row, 'up')"
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
                      @click="vote(props.row, 'down')"
                      :type="props.row.vote.current_user && props.row.vote.current_user.action === 'down' ? 'is-danger' : 'is-light' "
                    >
                      {{ props.row.vote.down }}
                    </b-button>
                  </b-tooltip>
                </p>
                <p class="control action-button">
                  <b-tooltip
                    label="Add new project"
                    position="is-left"
                    type="is-dark"
                  >
                    <b-button
                      icon-right="mdil-plus"
                      @click="handleNewTargetModal(props.row)"
                      type="is-light"
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
        title="Nominate a New Target"
        submit-text="Nominate Target"
        :submit="addNomination"
        has-reason
      />
    </div>
  </div>
</template>

<script>
import * as NominationManage from "@/api/nominationManage.js"
import { handleError } from "@/api/errorHandler.js"
import NewTargetModal from '@/components/Modal/NewTargetModal.vue'
import Error from '@/components/Error.vue'

export default {
  components: {
    NewTargetModal,
    Error
  },
  computed: {
    hasLoggedIn() {
      return this.$store.state.hasLoggedIn
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
      isNewTargetModalActive: false
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
        const nominations = await NominationManage.fetchNominations(this.pagination.limit, skip)
        this.nominations = nominations.results

        // Update count
        this.pagination.count = nominations.count
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading.page = false
      }
    },
    handleNewTargetModal() {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }

      this.isNewTargetModalActive = true
    },
    async addNomination(attrs) {
      await NominationManage.addNomination(attrs)
    },
    async vote(object, field) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login")
        return
      }


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
      }

      // Refresh
      await this.fetchNominations()
    }
  }
}
</script>