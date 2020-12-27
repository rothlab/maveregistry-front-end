<template>
  <div>
    <!-- Transfer ownership -->
    <b-button
      v-if="isOwner"
      :type="hasAction ? 'is-warning' : 'is-light'"
      icon-left="mdil-repeat"
      @click="isTransferOwnershipModalActive = true"
      expanded
    >
      Change Ownership
      <span v-if="hasAction">
        <small>(Action Required)</small>
      </span>
    </b-button>

    <b-button
      v-else-if="isMember && transfer"
      type="is-warning"
      icon-left="mdil-repeat"
      @click="isReviewTransferOwnershipModalActive = true"
      expanded
    >
      Review Ownership Transfer
    </b-button>

    <!-- Transfer ownership modal -->
    <TransferOwnershipModal
      v-if="isOwner"
      :active.sync="isTransferOwnershipModalActive"
      :type="type"
      :target-id="targetId"
      :transfer="transfer"
      :requests="requests"
      @transfer="emitTransfer"
      @refresh="fetchRecords"
    />

    <!-- Cancel ownership transfer modal -->
    <ReviewTransferModal
      v-else-if="isMember && transfer"
      :active.sync="isReviewTransferOwnershipModalActive"
      :transfer="transfer"
      @transfer="loadPage(); transfer = undefined"
    />
  </div>
</template>

<script>
import * as TransferManage from "@/api/transferManage.js"
import TransferOwnershipModal from '@/components/Modal/TransferOwnershipModal.vue'
import ReviewTransferModal from '@/components/Modal/ReviewTransferModal.vue'

export default {
  components: {
    TransferOwnershipModal,
    ReviewTransferModal
  },
  props: {
    loadPage: {
      type: Function,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      required: true
    }
  },
  computed: {
    hasAction() {
      return this.transfer || this.requests.length > 0
    }
  },
  data() {
    return {
      isTransferOwnershipModalActive: false,
      isReviewTransferOwnershipModalActive: false,
      transfer: undefined,
      requests: []
    }
  },
  async mounted() {
    if (this.hasLoggedIn) {
      // Fetch pending transfer
      await this.fetchRecords()

      // Open review transfer modal
      if (this.transfer && this.hasDeepLink("#review-transfer-request"))
        this.isReviewTransferOwnershipModalActive = true
      
      if (this.hasDeepLink("#review-ownership-request"))
        this.isTransferOwnershipModalActive = true
    }
  },
  methods: {
    async fetchRecords() {
      // Init related variables
      this.transfer = undefined
      this.requests = []

      const target = {
        type: this.type,
        id: this.targetId
      }

      const records = await TransferManage.fetchTransfer(undefined, target, this.isOwner)

      // Get transfer and requests
      records.map((record) => {
        if (record.type === "owner") this.transfer = record
        if (record.type === "request") this.requests.push(record)
      })
    },
    emitTransfer() {
      this.$emit("transfer")
    }
  }
}
</script>