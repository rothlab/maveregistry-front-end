<template>
  <b-modal
    :active.sync="isUnfollowModelActive"
    has-modal-card
    :can-cancel="['escape', 'outside']"
    @close="cleanupFollow()"
  >
    <div
      class="modal-card"
      v-if="followProp"
    >
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>Unfollow target?</span>
        </p>
        <button
          class="delete"
          aria-label="close"
          @click="isUnfollowModelActive = false; cleanupFollow();"
        />
      </header>
      <section class="modal-card-body">
        <div class="container">
          <div class="media">
            <div class="media-left">
              <b-icon
                pack="mdi"
                icon="alert-circle"
                size="is-large"
                type="is-warning"
              />
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  Are you sure you want to unfollow {{ followProp.team.name }} on {{ followProp.target.name }}? <br>
                  Once unfollowed, you will need their permission to follow again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot has-hright">
        <div class="buttons">
          <b-button
            @click="isUnfollowModelActive = false; cleanupFollow();"
          >
            Cancel
          </b-button>
          <b-button
            :loading="isLoading.follow_unfollow"
            type="is-primary"
            outlined
            @click="unfollowTeam(followProp.team, followProp.target, followProp.project_index)"
          >
            Unfollow
          </b-button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>