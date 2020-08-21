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
              :loading="isLoading"
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
              <div class="has-text-right">
                <!-- View Profile -->
                <b-tooltip
                  label="View Profile"
                  position="is-left"
                  type="is-dark"
                >
                  <router-link
                    :to="{ name: 'User Profile View', params: { username: follower.by.username } }"
                    target="_blank"
                  >
                    <b-icon icon="mdil-eye" />
                  </router-link>
                </b-tooltip>

                <!-- Approve -->
                <b-tooltip
                  label="Approve"
                  position="is-left"
                  type="is-dark"
                  v-if="isRequest"
                >
                  <a @click="approveFollower(follower.id, follower.can_edit)"><b-icon
                    icon="mdil-check"
                    type="is-success"
                  /></a>
                </b-tooltip>

                <!-- Remove -->
                <b-tooltip
                  label="Remove"
                  position="is-left"
                  type="is-dark"
                >
                  <a @click="removeFollower(follower.id)"><b-icon
                    icon="mdil-delete"
                    type="is-danger"
                  /></a>
                </b-tooltip>
              </div>

              <b-select
                size="is-small"
                icon="mdil-pencil"
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
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
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
      isLoading: false,
      isSettingFollower: -1,
      followers: {},
      filteredFollowers: {} ,
      keyword: ""
    }
  },
  methods: {
    async fetchFollowers() {
      this.isLoading = true

      try {
        this.followers = await FollowManage.fetchFollows(this.target, this.type, this.isRequest)
        this.filteredFollowers = this.followers
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading = false
      }
    },
    async filterByName(keyword) {
      if (keyword === "") {
        this.filteredFollowers = this.followers
        this.keyword = ""
      } else {
        this.isLoading = true

        this.keyword = keyword.toLowerCase()

        // Fetch followers
        try {
          this.filteredFollowers = await FollowManage.queryByName(this.target, this.type, this.keyword)
        } catch (error) {
          await displayErrorToast(error)
        } finally {
          this.isLoading = false
        }
      }
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return string.slice(0,1).toUpperCase() + string.slice(1)
      return string.replace(keyword, '')
    },
    removeFollower(id) {
      this.$buefy.dialog.confirm({
        title: `Remove ${this.classText}`,
        message: `Are you sure you want to remove this ${this.classText}?<br>They will <b>not</b> be notified.`,
        type: "is-danger",
        hasIcon: true,
        iconPack: "mdi",
        icon: "alert-circle",
        cancelText: "Cancel",
        confirmText: "Remove",
        onConfirm: async () => {
          // Delete follower
          try {
            await FollowManage.unfollow(id)
            await this.fetchFollowers()
            this.$emit("change")

            this.$buefy.toast.open({
              duration: 5000,
              message: `${this.capitalize(this.classText)} Removed`,
              type: 'is-success',
              queue: false
            })
          } catch (error) {
            await displayErrorToast(error)
          }
        }
      })
    },
    async approveFollower(id, canEdit = false) {
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