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
        <div
          class="media"
          v-for="(follower, id) in followers"
          :key="id"
        >
          <figure class="media-left">
            <p class="image is-48x48">
              <img
                class="is-rounded"
                src="https://bulma.io/images/placeholders/128x128.png"
              >
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <b>{{ follower.by.first_name }} {{ follower.by.last_name }} </b>
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
      </section>
      <footer class="modal-card-foot">
        <b-button
          expanded
          :loading="isLoading"
          type="is-primary"
        >
          Save Changes
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    followers: {
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
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    }
  },
  data () {
    return {
      isActive: false,
      isLoading: false
    }
  }
}
</script>