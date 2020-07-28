<template>
  <!-- Follow -->
  <div v-if="!followStatus || !followStatus.id">
    <b-button
      icon-left="mdil-bell"
      type="is-warning"
      size="is-medium"
      class="small-shadow"
      @click="isFollowModelActive = true"
    >
      Follow
    </b-button>
    <!-- Follow up modal -->
    <FollowModal
      :active.sync="isFollowModelActive"
      :source="targetId"
      :creator="creator"
      :type="type"
      @change="emitChange"
    />
  </div>

  <!-- Unfollow -->
  <div v-else>
    <b-button
      :icon-left="followStatus.status === 'pending' ? 'mdil-bell': 'mdil-bell-off'"
      type="is-warning"
      size="is-medium"
      class="small-shadow"
      @click="isUnfollowModelActive = true"
    >
      {{ followStatus.status === 'pending' ? "Pending Approval" : "Unfollow" }}
    </b-button>
    <!-- Unfollow modal -->
    <UnfollowModal
      :active.sync="isUnfollowModelActive"
      :follow="followStatus.id"
      :type="type"
      @change="emitChange"
    />
  </div>
</template>

<script>
import FollowModal from '@/components/Modal/FollowModal.vue'
import UnfollowModal from '@/components/Modal/UnfollowModal.vue'

export default {
  components: {
    FollowModal,
    UnfollowModal
  },
  props: {
    followStatus: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      default: ""
    },
    creator: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFollowModelActive: false,
      isUnfollowModelActive: false
    }
  },
  methods: {
    emitChange() {
      this.$emit("change")
    }
  }
}
</script>