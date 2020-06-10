<template>
  <b-modal
    :active.sync="isActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="is-capitalized">Manage Followers</span>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="isActive = false"
        />
      </header>
      <section class="modal-card-body">
        <!-- Search and pagination function -->
        <div class="level is-mobile">
          <div class="level-left">
            <b-input
              type="search"
              icon="mdil-magnify"
              placeholder="Search followers"
              :loading="isLoading.search"
              @input="filterByName"
            />
          </div>

          <div class="level-right">
            <b-pagination
              :total="filteredFollowers.count"
              icon-pack="mdi"
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
                  :src="getProfileImage(follower.by.profile_image)"
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
                </p>
              </div>
            </div>
            <div class="media-right">
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

              <!-- Remove -->
              <b-tooltip
                label="Remove"
                position="is-left"
                type="is-dark"
              >
                <a><b-icon icon="mdil-delete" /></a>
              </b-tooltip>
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
            No followers found with first or last name starting with "{{ keyword }}".
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button
          expanded
          :loading="isLoading.save"
          type="is-primary"
        >
          Save Changes
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import * as FollowManage from "@/api/followManage.js"

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    followers: {
      type: Object,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    },
    followers(val) {
      this.filteredFollowers = val
    }
  },
  mounted() {
    this.filteredFollowers = this.followers
  },
  data () {
    return {
      isActive: false,
      isLoading: {
        save: false,
        search: false
      },
      filteredFollowers: {} ,
      keyword: ""
    }
  },
  methods: {
    getProfileImage(url) {
      return url ? url : require("@/assets/image/blank-profile.png")
    },
    async filterByName(keyword) {
      if (keyword === "") {
        this.filteredFollowers = this.followers
        this.keyword = ""
      } else {
        this.isLoading.search = true
        this.keyword = keyword.toLowerCase()

        // Fetch followers
        this.filteredFollowers = await FollowManage.queryByName(this.target, this.type, this.keyword)

        this.isLoading.search = false
      }
    },
    trimKeyword(string, keyword) {
      if (keyword.length <= 0 || !string.startsWith(keyword)) return string.slice(0,1).toUpperCase() + string.slice(1)
      return string.replace(keyword, '')
    }
  }
}
</script>