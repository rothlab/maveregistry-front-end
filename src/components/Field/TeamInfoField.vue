<template>
  <div>
    <label class="label">
      Find or Add a Principal Investigator
    </label>

    <b-autocomplete
      v-model="existTeamDisplay"
      class="field-margin"
      placeholder="Search by Name"
      open-on-focus
      icon-pack="mdi"
      icon="magnify"
      field="display"
      clearable
      :data="teams"
      :loading="isLoading"
      @typing="fetchTeams"
      @select="updateVal"
      @focus="fetchTeams()"
      :check-infinite-scroll="true"
      @infinite-scroll="fetchMoreTeams"
    >
      <template slot="empty">
        <p class="has-text-centered has-text-grey-light">
          <b-icon icon="mdil-information" />
          No results found
        </p>
      </template>
      <template slot="header">
        <a @click="isNewTeamModalActive = true">
          <b-icon icon="mdil-plus" />
          <span>Add new...</span>
        </a> 
      </template>
      <template slot="footer">
        <p
          class="has-text-centered has-text-grey-light"
          v-show="this.teams.length > 0"
        >
          <b-icon icon="mdil-information" />
          <span v-if="pagination.count <= this.teams.length">That's it! No more results.</span>
          <span v-else>Scroll down to see more results.</span>
        </p>
      </template>
      <template slot-scope="props">
        <b-icon icon="mdil-account" />
        <!-- Add keyword bolding -->
        <!-- To prevent XSS attack, we don't want to allow html tags, although it's going to be make the job much easier. -->
        <b class="is-capitalized">{{ props.option.first_name.startsWith(keyword) ? keyword : '' }}</b>{{ trimKeyword(props.option.first_name, keyword) }}
        <b class="is-capitalized">{{ props.option.last_name.startsWith(keyword) ? keyword : '' }}</b>{{ trimKeyword(props.option.last_name, keyword) }},
        {{ props.option.affiliation }}
      </template>
    </b-autocomplete>

    <!-- New team modal -->
    <div class="container">
      <NewTeamModal
        :active.sync="isNewTeamModalActive"
        :is-collaborator="isCollaborator"
        @change="updateExistTeamById"
      />
    </div>
  </div>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import NewTeamModal from "@/components/Modal/NewTeamModal.vue"
import { handleError } from "@/api/errorHandler.js"

// Helper
function capitalize(string) {
  return string.slice(0,1).toUpperCase() + string.slice(1)
}

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    isCollaborator: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NewTeamModal
  },
  watch: {
    async value () {
      if (this.id !== this.value) {
        await this.updateExistTeamById(this.value)
      }
    },
    async existTeamDisplay (newVal, oldVal) {
      if (newVal === "" && newVal !== oldVal) {
        this.id = ""
        this.$emit("input", this.id)
      }
    }
  },
  computed: {
    hasRequired() {
      return this.isRequired ? 'required' : ''
    }
  },
  async mounted() {
    if (this.value) this.updateExistTeamById(this.value)
  },
  data () {
    return {
      id: "",
      existTeamDisplay: "",
      teams: [],
      errorMessage: "",
      keyword: "",
      isNewTeamModalActive: false,
      isLoading: false,
      pagination: {
        count: 0,
        limit: 10,
        skip: 0
      }
    }
  },
  methods: {
    updateVal(option) {
      this.id = option.id
      this.$emit("input", this.id)
    },
    formatTeam(team) {
      team.display = `${capitalize(team.first_name)} ${capitalize(team.last_name)}, ${team.affiliation}`

      return team
    },
    async updateExistTeamById(id) {
      this.id = id

      // Update existing team
      const team = await this.queryTeamById(id)
      this.existTeamDisplay = this.formatTeam(team).display

      // update ID
      this.updateVal(team)
    },
    async queryTeamById(id) {
      if (id.length < 1) return

      this.isLoading = true

      try {
        const team = await TeamManage.queryById(id)

        return team
      } catch (error) {
        this.errorMessage = await handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchTeams(query = "", store = true) {
      this.isLoading = true

      // Set keyword for bolding
      this.keyword = query.toLowerCase()

      // Fetch some teams to populate the dropdown menu
      let teams
      try {
        if (query.length <= 0) {
          teams = await TeamManage.fetchTeams(this.pagination.limit, this.pagination.skip)
        } else {
          // Otherwise, search team with matching names
          teams = await TeamManage.queryByName(query)
          this.pagination.skip = 0
        }
      } catch (error) {
        this.errorMessage = await handleError(error)
        return
      } finally {
        this.isLoading = false
      }

      // Format and store
      this.pagination.count = teams.count
      teams = teams.results.map(this.formatTeam)
      if (store) this.teams = teams
      return teams
    },
    async fetchMoreTeams() {
      // Update pagination
      this.pagination.skip += this.pagination.limit

      if (this.pagination.skip >= this.pagination.count) return

      // Fetch teams and add to current teams
      this.teams = this.teams.concat(await this.fetchTeams(this.keyword, false))
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return capitalize(string)
      return string.replace(keyword, '')
    }
  }
}
</script>