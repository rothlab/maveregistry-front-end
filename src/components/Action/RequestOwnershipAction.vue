<template>
  <div>
    <!-- Moderator function -->
    <div v-if="isModerator">
      <!-- Obtain ownership -->
      <b-button
        v-if="!isOwner"
        icon-left="mdil-trophy"
        type="is-light"
        expanded
        @click="isConfirmObtainOnwershipModalActive = true"
        :loading="isLoading"
        style="margin-bottom: 0.5rem"
      >
        Obtain Ownership
      </b-button>
    </div>

    <!-- Member functions -->
    <div v-if="isMember">
      <!-- Request ownership -->
      <b-button
        v-if="!isModerator && !isOwner && !request"
        icon-left="mdil-trophy"
        type="is-light"
        expanded
        @click="isConfirmRequestOnwershipModalActive = true"
        :loading="isLoading"
        style="margin-bottom: 0.5rem"
      >
        Request Ownership
      </b-button>

      <!-- Cancel request -->
      <b-button
        v-else-if="!isModerator && !isOwner && request"
        icon-left="mdil-trophy"
        type="is-warning"
        expanded
        @click="isConfirmCancelOnwershipRequestModalActive = true"
        :loading="isLoading"
        style="margin-bottom: 0.5rem"
      >
        Cancel Onwership Request
      </b-button>
    </div>

    <!-- Obtain ownership modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmObtainOnwershipModalActive"
      :type="type"
      action="obtain"
      :on-action="onAction"
    >
      <p style="margin: 1rem 0">
        As a moderator, you can obtain the ownership of this {{ type }} record without notifying the current depositor.
      </p>
    </ConfirmDangerModal>

    <!-- Request ownership modal -->
    <ConfirmInfoModal
      :active.sync="isConfirmRequestOnwershipModalActive"
      action="request"
      type="ownership"
      :on-action="onAction"
      @change="fetchRequest"
      :is-irreversible="false"
    >
      <p style="margin: 1rem 0">
        Your request will be sent to the {{ type }} depositor for approval.
      </p>
    </ConfirmInfoModal>

    <!-- Obtain ownership modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmCancelOnwershipRequestModalActive"
      type="request"
      action="cancel"
      :on-action="cancelRequest"
      @change="fetchRequest"
    />
  </div>
</template>

<script>
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'
import ConfirmInfoModal from '@/components/Modal/ConfirmInfoModal.vue'
import * as TransferManage from "@/api/transferManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"

export default {
  components: {
    ConfirmDangerModal,
    ConfirmInfoModal
  },
  props: {
    type: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      required: true
    },
    isOwner: {
      type: Boolean,
      required: true
    },
    onAction: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      isConfirmObtainOnwershipModalActive: false,
      isConfirmRequestOnwershipModalActive: false,
      isConfirmCancelOnwershipRequestModalActive: false,
      request: undefined
    }
  },
  async mounted () {
    await this.fetchRequest()
  },
  methods: {
    async fetchRequest() {
      this.isLoading = true

      // Init parameter
      this.request = undefined
      
      const target = {
        type: this.type,
        id: this.targetId
      }

      try {
        const records = await TransferManage.fetchTransfer("request", target, this.isOwner)
        if (records.length > 0) this.request = records[0]
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading = false
      }
    },
    async cancelRequest() {
      await TransferManage.cancelTransfer(this.request.id)
    }
  }
}
</script>