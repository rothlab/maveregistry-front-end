<template>
  <b-modal
    :active.sync="isActive"
    :width="500"
    class="card-modal"
    @close="users = []"
  >
    <div class="card">
      <div class="card-content manage-follower">
        <!-- Header -->
        <header class="level is-mobile">
          <div class="level-left">
            <p class="is-size-5 has-text-primary is-capitalized">
              Change Ownership
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

        <!-- Body -->
        <div class="container">
          <b-tabs
            v-model="activeTab"
            position="is-centered"
            type="is-boxed"
            :animated="false"
          >
            <b-tab-item>
              <template #header>
                <b-icon icon="mdil-repeat" />
                <span> Transfer </span>
              </template>

              <!-- Cancel transfer request -->
              <div
                v-if="transfer"
                class="content"
              >
                <p>
                  <span>
                    You initiated the transfer of ownership to
                    <figure
                      class="image is-24x24 is-inline-flex"
                      style="margin: 0 0.25rem"
                    >
                      <img
                        class="is-rounded"
                        :src="getProfileImageFromUser(transfer.recipient)"
                        alt="Profile Image"
                      >
                    </figure>
                    <router-link
                      :to="{ name: 'User Profile View', params: { username: transfer.recipient.username } }"
                      target="_blank"
                      style="margin-right: 0.25rem"
                    >
                      <span class="is-capitalized">{{ transfer.recipient.first_name }} {{ transfer.recipient.last_name }}</span>
                    </router-link>
                    at {{ transfer.time.toLocaleString() }}.
                  </span>
                </p>

                <b-button
                  style="margin-top: 1.5rem"
                  :loading="isLoading.submit"
                  type="is-warning"
                  expanded
                  @click="requestId = transfer.id; isConfirmCancelTransferModalActive = true"
                >
                  Cancel Pending Transfer
                </b-button>
              </div>

              <!-- Transfer ownership -->
              <div v-else>
                <div class="content">
                  <p>
                    Once accepted by the recipient, you will lose ownership of this {{ type }} record.
                    <b>This action is irreversible.</b>
                  </p>

                  <p>
                    Please enter recipient of the {{ type }}
                  </p>
            
                  <b-autocomplete
                    :data="users"
                    field="display"
                    placeholder="Search User by Name"
                    icon="mdil-magnify"
                    :loading="isLoading.autocomplete"
                    @typing="searchUser"
                    append-to-body
                    @select="selectUser"
                  >
                    <template slot="empty">
                      No results found
                    </template>

                    <template slot-scope="props">
                      <div
                        class="is-flex has-vcentered"
                        style="margin: 0.25rem 0"
                        v-if="!isLoading.autocomplete"
                      >
                        <figure
                          class="image is-24x24 is-inline-flex"
                          style="margin-right: 0.5rem"
                        >
                          <img
                            class="is-rounded"
                            :src="getProfileImageFromUser(props.option)"
                            alt="Profile Image"
                          >
                        </figure>
                        <span class="is-capitalized">
                          {{ props.option.first_name }}
                          {{ props.option.last_name }}
                        </span>
                      </div>
                    </template>
                  </b-autocomplete>
                </div>

                <b-button
                  style="margin-top: 1.5rem"
                  :loading="isLoading.submit"
                  :disabled="!recipientId"
                  type="is-warning"
                  expanded
                  @click="transferOwnership"
                >
                  Transfer Ownership
                </b-button>
              </div>
            </b-tab-item>
            <b-tab-item>
              <template #header>
                <b-icon icon="mdil-comment-alert" />
                <span> Requests <b-tag rounded> {{ requests.length }} </b-tag> </span>
              </template>

              <!-- Empty -->
              <div
                v-if="requests.length < 1"
                class="has-text-centered content"
              >
                <p
                  class="has-text-grey"
                  style="margin: 3rem 0 2rem 0"
                >
                  <b-icon icon="mdil-information" />
                  No requests available.
                </p>
              </div>

              <!-- Requests -->
              <div v-else>
                <div
                  class="media"
                  v-for="(request, id) in requests"
                  :key="id"
                >
                  <figure class="media-left profile">
                    <p class="image is-48x48">
                      <img
                        class="is-rounded"
                        :src="getProfileImageFromUser(request.recipient)"
                      >
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <span class="is-capitalized">{{ `${request.recipient.first_name} ${request.recipient.last_name}` }}</span><br>
                        <small>{{ request.time.toLocaleString() }}</small>
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
                          :to="{ name: 'User Profile View', params: { username: request.recipient.username } }"
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
                          @click="requestId = request.id; isConfirmTransferRequestModalActive = true"
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
                        />
                      </b-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>

    <!-- Confirm transfer -->
    <ConfirmInfoModal
      :active.sync="isConfirmTransferRequestModalActive"
      action="transfer"
      type="ownership"
      :on-action="approveRequest"
      @change="emitTransfer"
    >
      <p style="margin: 1rem 0">
        Your will immediately lose ownership of this {{ type }} record.
      </p>
    </ConfirmInfoModal>

    <!-- Remove request -->
    <ConfirmDangerModal
      :active.sync="isConfirmDeleteModalActive"
      type="request"
      action="remove"
      :on-action="cancelRequest"
      @change="emitRefresh"
    />

    <!-- Remove request -->
    <ConfirmDangerModal
      :active.sync="isConfirmCancelTransferModalActive"
      type="transfer"
      action="cancel"
      :on-action="cancelRequest"
      @change="emitRefresh"
    >
      <p style="margin: 1rem 0">
        The recipient will be notified.
      </p>
    </ConfirmDangerModal>
  </b-modal>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import * as TransferManage from "@/api/transferManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import ConfirmInfoModal from '@/components/Modal/ConfirmInfoModal.vue'
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'

export default {
  components: {
    ConfirmInfoModal,
    ConfirmDangerModal
  },
  props: {
    active: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      required: true
    },
    transfer: {
      type: Object,
      default: undefined
    },
    requests: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    isActive(val) {
      if (val !== this.active) {
        this.$emit("update:active", val)
      }

      if (val) {
        // If no transfer but with requests, set request tab as the active tab
        if (!this.transfer && this.requests.length > 0) {
          this.activeTab = 1
        } else {
          this.activeTab = 0
        }
      }
    },
    active(val) {
      if (val != this.isActive) {
        this.isActive = val
      }
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: {
        autocomplete: false,
        submit: false
      },
      isConfirmTransferRequestModalActive: false,
      isConfirmDeleteModalActive: false,
      isConfirmCancelTransferModalActive: false,
      recipientId: "",
      requestId: "",
      activeTab: 0,
      users: []
    }
  },
  methods: {
    async searchUser(name) {
      if (!name) {
        this.recipientId = ""
        return
      }

      this.isLoading.autocomplete = true

      try {
        let users = await UserManage.queryUserByName(name, false)

        // Filter out users already requesting a transfer
        if (this.requests.length > 0) {
          users = users.filter((user) => {
            return !this.requests.some(e => e.recipient.id === user.id)
          })
        }

        this.users = users.map((e) => {
          e.display = `${this.capitalize(e.first_name)} ${this.capitalize(e.last_name)}`
          return e
        })
      } catch (error) {
        displayErrorToast(error)
      } finally {
        this.isLoading.autocomplete = false
      }
    },
    selectUser(user) {
      this.recipientId = user.id
    },
    async transferOwnership() {
      if (!this.recipientId) return

      this.isLoading.submit = true

      try {
        const target = {
          type: this.type,
          id: this.targetId
        }
        await TransferManage.transferOwnership(target, this.recipientId)
        this.$emit("refresh")
      } catch (error) {
        displayErrorToast(error)
        return
      } finally {
        this.isLoading.submit = false
      }

      this.$buefy.toast.open({
        duration: 5000,
        message: `Transfer Ownership Request Sent`,
        type: 'is-success',
        queue: false
      })
      this.isActive = false
    },
    async approveRequest(){
      await TransferManage.acceptTransfer(this.requestId)
    },
    async cancelRequest() {
      await TransferManage.cancelTransfer(this.requestId)
    },
    async emitTransfer() {
      this.$emit("transfer")
      this.isActive = false
    },
    async emitRefresh() {
      this.$emit("refresh")
    }
  }
}
</script>

<style lang="sass" scoped>
.footer-actions
  margin-top: 1.5rem
  justify-content: flex-end
.profile
  margin: 0 1rem 0 0
</style>

<style lang="sass">
.tabs ul
  margin: 0
</style>