<template>
  <div>
    <!-- Transfer ownership -->
    <b-button
      v-if="isOwner && !transfer"
      type="is-light"
      icon-left="mdil-repeat"
      @click="isTransferOwnershipModalActive = true"
      expanded
    >
      Transfer Ownership
    </b-button>
    <b-button
      v-else-if="isOwner && transfer"
      type="is-warning"
      icon-left="mdil-repeat-off"
      @click="isCancelTransferOwnershipModalActive = true"
      expanded
    >
      Cancel Ownership Transfer
    </b-button>
    <b-button
      v-else-if="hasLoggedIn && !isOwner && transfer"
      type="is-warning"
      icon-left="mdil-repeat"
      @click="isReviewTransferOwnershipModalActive = true"
      expanded
    >
      Review Ownership Transfer
    </b-button>

    <!-- Transfer ownership modal -->
    <TransferOwnershipModal
      v-if="isOwner && !transfer"
      :active.sync="isTransferOwnershipModalActive"
      :type="type"
      :target-id="targetId"
      @transfer="(e) => transfer = e"
    />

    <!-- Cancel ownership transfer modal -->
    <CancelTransferModal
      v-if="isOwner && transfer"
      :active.sync="isCancelTransferOwnershipModalActive"
      :transfer="transfer"
      @transfer="transfer = undefined; isCancelTransferOwnershipModalActive = false"
    />

    <!-- Cancel ownership transfer modal -->
    <ReviewTransferModal
      v-if="hasLoggedIn && !isOwner && transfer"
      :active.sync="isReviewTransferOwnershipModalActive"
      :transfer="transfer"
      @transfer="loadPage(); transfer = undefined; isReviewTransferOwnershipModalActive = false"
    />
  </div>
</template>

<script>
import * as TransferManage from "@/api/transferManage.js"
import TransferOwnershipModal from '@/components/Modal/TransferOwnershipModal.vue'
import CancelTransferModal from '@/components/Modal/CancelTransferModal.vue'
import ReviewTransferModal from '@/components/Modal/ReviewTransferModal.vue'

export default {
  components: {
    TransferOwnershipModal,
    CancelTransferModal,
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
  watch: {
    transfer(val) {
      this.$emit("has-transfer", !!val)
    }
  },
  data() {
    return {
      isTransferOwnershipModalActive: false,
      isCancelTransferOwnershipModalActive: false,
      isReviewTransferOwnershipModalActive: false,
      transfer: undefined
    }
  },
  async mounted() {
    if (this.hasLoggedIn) {
      // Fetch pending transfer
      await this.fetchTransfer()

      // Open review transfer modal
      if (this.hasDeepLink("#review-transfer-request") && this.transfer)
        this.isReviewTransferOwnershipModalActive = true
      
      this.$emit("has-transfer", !!this.transfer)
    }
  },
  methods: {
    async fetchTransfer() {
      const target = {
        type: this.type,
        id: this.targetId
      }

      this.transfer = await TransferManage.fetchTransfer("owner", target, this.isOwner)
    }
  }
}
</script>