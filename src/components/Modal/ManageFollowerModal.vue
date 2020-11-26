<template>
  <b-modal
    :active.sync="isActive"
    :can-cancel="['escape', 'outside']"
    :width="600"
    @close="followers = {}"
    class="card-modal"
  >
    <div class="card">      
      <div class="card-content manage-follower">
        <!-- Title -->
        <header class="level is-mobile">
          <div class="level-left">
            <p class="has-text-primary is-capitalized is-size-5">
              Manage {{ classText }}
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
              :placeholder="`Search ${classText}s`"
              :loading="isLoading.page"
              @input="filterByName"
            />
          </div>

          <div class="level-right">
            <b-pagination
              :total="filteredFollowers.count ? filteredFollowers.count : 0"
              icon-pack="mdil"
              icon-prev="chevron-left"
              order="is-right"
              simple
            />
          </div>
        </div>

        <div v-if="filteredFollowers.count && filteredFollowers.count > 0">
          <div
            class="media"
            v-for="(follower, id) in filteredFollowers.results"
            :key="id"
          >
            <figure class="media-left">
              <p class="image is-48x48">
                <img
                  class="is-rounded"
                  :src="getProfileImageFromUser(follower.by)"
                >
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <!-- Add highlighting when a keyword is given -->
                  <b><mark class="is-capitalized">{{ follower.by.first_name.startsWith(keyword) ? keyword : '' }}</mark>{{ trimKeyword(follower.by.first_name, keyword) }} </b>
                  <b><mark class="is-capitalized">{{ follower.by.last_name.startsWith(keyword) ? keyword : '' }}</mark>{{ trimKeyword(follower.by.last_name, keyword) }} </b>
                  <small>{{ follower.create_date.toLocaleString() }}</small><br>
                  <b-icon icon="mdil-comment-text" />{{ follower.reason }}
                  <span
                    v-if="follower.can_edit"
                    class="has-text-danger"
                    style="font-size: 13px"
                  >
                    <br>
                    <b-icon
                      icon="mdil-alert"
                      custom-size="mdil-18px"
                    />
                    <span v-if="isRequest">If approved, {{ capitalize(follower.by.first_name) }} will be able to edit this project.</span>
                    <span v-else>{{ capitalize(follower.by.first_name) }} can edit this project.</span>
                  </span>
                </p>
              </div>
            </div>
            <div class="media-right">
              <div class="has-text-right action-buttons v-centered">
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
                    :to="{ name: 'User Profile View', params: { username: follower.by.username } }"
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
                    @click="approveFollower(follower.id, follower.can_edit)"
                    :loading="isLoading.action"
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
                    @click="deleteId = follower.id; isConfirmDeleteModalActive = true"
                    :loading="isLoading.action"
                  />
                </b-tooltip>
              </div>

              <b-select
                size="is-small"
                icon="mdil-pencil"
                expanded
                v-model="follower.can_edit"
                :loading="isSettingFollower === id"
                :disabled="isSettingFollower === id"
                @input="setEditRole(follower.id, follower.can_edit, id)"
              >
                <option :value="false">
                  Viewer
                </option>
                <option :value="true">
                  Editor
                </option>
              </b-select>
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
            No {{ classText }} found{{ keyword.length > 0 ? ` with first or last name starting with "${keyword}".` : '.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Confirm Delete User Modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmDeleteModalActive"
      type="follower"
      action="remove"
      :on-action="removeFollower"
    />
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"
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
    target: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    isRequest: {
      type: Boolean,
      default: false
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

      // Fetch followers if active
      if (val) {
        this.filteredFollowers = {}
        this.fetchFollowers()
      }
    },
  },
  computed: {
    classText() {
      return this.isRequest ? 'request' : 'follower'
    }
  },
  data () {
    return {
      isActive: false,
      isLoading: {
        page: false,
        action: false
      },
      isSettingFollower: -1,
      followers: {},
      filteredFollowers: {} ,
      keyword: "",
      isConfirmDeleteModalActive: false,
      deleteId: undefined
    }
  },
  methods: {
    async fetchFollowers() {
      this.isLoading.page = true

      try {
        this.followers = await FollowManage.fetchFollows(this.target, this.type, this.isRequest)
        this.filteredFollowers = this.followers
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.page = false
      }
    },
    async filterByName(keyword) {
      if (keyword === "") {
        this.filteredFollowers = this.followers
        this.keyword = ""
      } else {
        this.isLoading.page = true

        this.keyword = keyword.toLowerCase()

        // Fetch followers
        try {
          this.filteredFollowers = await FollowManage.queryByName(this.target, this.type, this.keyword)
        } catch (error) {
          await displayErrorToast(error)
        } finally {
          this.isLoading.page = false
        }
      }
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return string.slice(0,1).toUpperCase() + string.slice(1)
      return string.replace(keyword, '')
    },
    async removeFollower() {
      this.isLoading.action = true

      await FollowManage.unfollow(this.deleteId)
      await this.fetchFollowers()
      this.$emit("change")

      this.isLoading.action = false
    },
    async approveFollower(id, canEdit = false) {
      this.isLoading.action = true

      // Approve and refresh list
      try {
        await FollowManage.approve(id, canEdit)
        await this.fetchFollowers()
        this.$emit("change")

        this.$buefy.toast.open({
          duration: 5000,
          message: "Request Approved",
          type: 'is-success',
          queue: false
        })
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.action = false
      }
    },
    async setEditRole(id, canEdit, selectId) {
      // Disable the select component
      this.isSettingFollower = selectId
      
      try {
        await FollowManage.setEditRole(id, canEdit)
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isSettingFollower = -1
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.manage-follower
  padding: 2rem
</style>