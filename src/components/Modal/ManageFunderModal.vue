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
              Manage Funders
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

        <div>
          <b-loading
            :is-full-page="false"
            v-model="isLoading.list"
          />

          <b-tabs
            v-model="activeTab"
            :animated="false"
            type="is-boxed"
            position="is-centered"
          >
            <!-- Request -->
            <b-tab-item>
              <template #header>
                <b-icon icon="mdil-comment-alert" />
                <span> Requests <b-tag rounded> {{ requestPagination.count }} </b-tag> </span>
              </template>

              <!-- Search and pagination function -->
              <div class="level is-mobile">
                <div class="level-left">
                  <b-input
                    v-model="requestKeyword"
                    type="search"
                    icon="mdil-magnify"
                    placeholder="Search Name"
                    @input="handleFetch()"
                  />
                </div>

                <div class="level-right">
                  <b-pagination
                    :total="requests.length"
                    icon-pack="mdil"
                    icon-prev="chevron-left"
                    order="is-right"
                    simple
                  />
                </div>
              </div>

              <div v-if="requests.length > 0">
                <div
                  class="media"
                  v-for="(request, id) in requests"
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
                        <b><mark class="is-capitalized">{{ request.member.first_name.startsWith(requestKeyword) ? requestKeyword : '' }}</mark>{{ trimKeyword(request.member.first_name, requestKeyword) }} </b>
                        <b><mark class="is-capitalized">{{ request.member.last_name.startsWith(requestKeyword) ? requestKeyword : '' }}</mark>{{ trimKeyword(request.member.last_name, requestKeyword) }} </b>
                        <small>{{ request.created_at.toLocaleString() }}</small><br>
                        <span class="is-capitalized">
                          {{ request.position }}, {{ request.agency.name }}, {{ countries[request.agency.country] }}
                        </span>
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
                  No funder requests found.
                </p>
              </div>
            </b-tab-item>
            <b-tab-item>
              <template #header>
                <b-icon icon="mdil-check" />
                <span> Approved <b-tag rounded> {{ funderPagination.count }} </b-tag> </span>
              </template>

              <!-- Search and pagination function -->
              <div class="level is-mobile">
                <div class="level-left">
                  <b-input
                    v-model="funderKeyword"
                    type="search"
                    icon="mdil-magnify"
                    placeholder="Search Name"
                    @input="handleFetch()"
                  />
                </div>

                <div class="level-right">
                  <b-pagination
                    :total="funders.length"
                    icon-pack="mdil"
                    icon-prev="chevron-left"
                    order="is-right"
                    simple
                  />
                </div>
              </div>

              <div v-if="funders.length > 0">
                <div
                  class="media"
                  v-for="(funder, id) in funders"
                  :key="id"
                >
                  <figure class="media-left">
                    <p class="image is-48x48">
                      <img
                        class="is-rounded"
                        :src="getProfileImageFromUser(funder.member)"
                      >
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <!-- Add highlighting when a keyword is given -->
                        <b><mark class="is-capitalized">{{ funder.member.first_name.startsWith(funderKeyword) ? funderKeyword : '' }}</mark>{{ trimKeyword(funder.member.first_name, funderKeyword) }} </b>
                        <b><mark class="is-capitalized">{{ funder.member.last_name.startsWith(funderKeyword) ? funderKeyword : '' }}</mark>{{ trimKeyword(funder.member.last_name, funderKeyword) }} </b>
                        <small>{{ funder.created_at.toLocaleString() }}</small><br>
                        <span class="is-capitalized">
                          {{ funder.position }}, {{ funder.agency.name }}, {{ countries[funder.agency.country] }}
                        </span>
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
                          :to="{ name: 'User Profile View', params: { username: funder.member.username } }"
                          target="_blank"
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
                          @click="requestId = funder.id; isConfirmDeleteModalActive = true"
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
                  No funders found.
                </p>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>

    <!-- Confirm Delete User Modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmDeleteModalActive"
      type="funder"
      action="remove"
      :on-action="removeFunder"
      @change="handleFetch()"
    />
  </b-modal>
</template>

<script>
import * as FunderManage from "@/api/funderManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'
const countries = require("@/assets/script/countries.json")

export default {
  components: {
    ConfirmDangerModal
  },
  props: {
    active: {
      type: Boolean,
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

      if (val) {
        await this.handleFetch(true)
      }
    }
  },
  data () {
    return {
      isActive: false,
      isLoading: {
        list: false,
        submit: false
      },
      funderPagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      requestPagination: {
        count: 0,
        limit: 10,
        current: 1
      },
      activeTab: 0,
      requests: [],
      funders: [],
      requestKeyword: "",
      funderKeyword: "",
      countries: countries,
      isConfirmDeleteModalActive: false,
      requestId: ""
    }
  },
  methods: {
    async handleFetch(all = false) {
      this.isLoading.list = true

      try {
        if (all || this.activeTab === 0) await this.fetchFunderRequests()
        if (all || this.activeTab === 1) await this.fetchFunders()
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.list = false
      }
      
    },
    async fetchFunderRequests() {
      // Calculate skip
      const skip = (this.requestPagination.current - 1) * this.requestPagination.limit

      const funders = await FunderManage.listFunders(this.requestKeyword, this.requestPagination.limit, skip, true)
      this.requests = funders.results
      this.requestPagination.count = funders.count
    },
    async fetchFunders() {
      // Calculate skip
      const skip = (this.funderPagination.current - 1) * this.funderPagination.limit

      const funders = await FunderManage.listFunders(this.funderKeyword, this.funderPagination.limit, skip, false)
      this.funders = funders.results
      this.funderPagination.count = funders.count
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return string.slice(0,1).toUpperCase() + string.slice(1)
      return string.replace(keyword, '')
    },
    async removeFunder() {
      this.isLoading.submit = true

      await FunderManage.removeFunder(this.requestId)
      this.$emit("change")
      await this.handleFetch()
      
      this.isLoading.submit = false
    },
    async approveRequest() {
      this.isLoading.submit = true

      // Approve and refresh list
      try {
        await FunderManage.approveFunderRequest(this.requestId)
        await this.handleFetch(true)
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