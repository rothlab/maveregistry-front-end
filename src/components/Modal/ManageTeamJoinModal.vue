<template>
  <b-modal
    :active.sync="isActive"
    :can-cancel="['escape', 'outside']"
    :width="600"
    class="card-modal"
  >
    <div class="card">      
      <div class="card-content manage-team-join-request">
        <!-- Title -->
        <header class="level is-mobile">
          <div class="level-left">
            <p class="has-text-primary is-capitalized is-size-5">
              Manage Team Join Request
            </p>
          </div>
          <div class="level-right">
            <button
              class="delete"
              aria-label="close"
              @click="isActive = false"
            />
          </div>
        </header>

        <!-- Search and pagination function -->
        <div class="level is-mobile">
          <div class="level-left">
            <b-input
              type="search"
              icon="mdil-magnify"
              placeholder="Search Name"
              @input="filterByName"
            />
          </div>

          <div class="level-right">
            <b-pagination
              :total="filteredRequests.length"
              icon-pack="mdil"
              icon-prev="chevron-left"
              order="is-right"
              simple
            />
          </div>
        </div>

        <div v-if="filteredRequests.length > 0">
          <div
            class="media"
            v-for="(request, id) in filteredRequests"
            :key="id"
          >
            <figure class="media-left">
              <p class="image is-48x48">
                <img
                  class="is-rounded"
                  :src="getProfileImageFromUser(request.member)"
                >
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <!-- Add highlighting when a keyword is given -->
                  <b><mark class="is-capitalized">{{ request.member.first_name.startsWith(keyword) ? keyword : '' }}</mark>{{ trimKeyword(request.member.first_name, keyword) }} </b>
                  <b><mark class="is-capitalized">{{ request.member.last_name.startsWith(keyword) ? keyword : '' }}</mark>{{ trimKeyword(request.member.last_name, keyword) }} </b><br>
                  {{ request.created_at.toLocaleString() }}
                  <!-- <b-icon icon="mdil-comment-text" />No reason -->
                </p>
              </div>
            </div>
            <div class="media-right">
              <div class="has-text-right action-buttons has-vcentered">
                <!-- View Profile -->
                <b-tooltip
                  label="View Profile"
                  type="is-dark"
                >
                  <b-button
                    tag="router-link"
                    icon-right="mdil-eye mdil-18px"
                    type="is-info"
                    outlined
                    :to="{ name: 'User Profile View', params: { username: request.member.username } }"
                    target="_blank"
                  />
                </b-tooltip>

                <!-- Approve -->
                <b-tooltip
                  label="Approve"
                  type="is-dark"
                >
                  <b-button
                    icon-right="mdil-check mdil-18px"
                    type="is-success"
                    outlined
                    @click="requestId = request.id; approveRequest()"
                    :loading="isLoading.submit"
                  />
                </b-tooltip>

                <!-- Remove -->
                <b-tooltip
                  label="Remove"
                  type="is-dark"
                >
                  <b-button
                    icon-right="mdil-delete mdil-18px"
                    type="is-danger"
                    outlined
                    @click="requestId = request.id; isConfirmDeleteModalActive = true"
                    :loading="isLoading.submit"
                  />
                </b-tooltip>
              </div>
            </div>
          </div>
        </div>

        <!-- Nothing found -->
        <div
          v-else
          class="has-text-centered content"
        >
          <p class="has-text-grey">
            <b-icon icon="mdil-information" />
            No requests found{{ keyword.length > 0 ? ` with first or last name starting with "${keyword}".` : '.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Confirm Delete User Modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmDeleteModalActive"
      type="request"
      action="reject"
      :on-action="rejectRequest"
    />
  </b-modal>
</template>

<script>
import * as TeamManage from "@/api/teamManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'

export default {
  components: {
    ConfirmDangerModal
  },
  props: {
    active: {
      type: Boolean,
      required: true
    },
    requests: {
      type: Array,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }
    },
    async active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }

      if (val) this.filteredRequests = this.requests
    },
    requests() {
      this.filterByName(this.keyword)
    }
  },
  data () {
    return {
      isActive: false,
      isLoading: {
        list: false,
        submit: false
      },
      filteredRequests: [],
      keyword: "",
      isConfirmDeleteModalActive: false,
      requestId: ""
    }
  },
  methods: {
    async filterByName(keyword) {
      if (keyword === "") {
        this.keyword = ""
        this.filteredRequests = this.requests
      } else {
        keyword = keyword.toLowerCase()
        this.keyword = keyword
        this.filteredRequests = this.requests.filter((request) => {
          const member = request.member
          return member.first_name.startsWith(keyword) || member.last_name.startsWith(keyword)
        })
      }
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return string.slice(0,1).toUpperCase() + string.slice(1)
      return string.replace(keyword, '')
    },
    async rejectRequest() {
      this.isLoading.submit = true

      await TeamManage.rejectJoinRequest(this.requestId)
      this.$emit("change")

      this.isLoading.submit = false
    },
    async approveRequest() {
      this.isLoading.submit = true

      // Approve and refresh list
      try {
        await TeamManage.acceptJoinRequest(this.requestId)
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.submit = false
      }
      
      this.$emit("change")
    },
  }
}
</script>

<style lang="sass" scoped>
.manage-team-join-request
  padding: 2rem
</style>