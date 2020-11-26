<template>
  <div>
    <b-modal
      :active.sync="isActive"
      :can-cancel="['escape', 'outside']"
      :width="600"
      class="card-modal"
    >
      <div class="card">      
        <div class="card-content manage-team-join-request">
          <!-- Title -->
          <header class="level is-mobile">
            <div class="level-left">
              <p class="has-text-primary is-capitalized is-size-5">
                Invite People to {{ action }} {{ type }}
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

          <!-- Search and invite from external source -->
          <div class="container field-margin">
            <p class="field-margin">
              Enter the name of the user you'd like to invite. If they are not on the Registry, you can choose to invite them to create an account.
            </p>
            <b-field grouped>
              <b-taginput
                ref="taginput"
                placeholder="Search user by name"
                icon="mdil-magnify"
                expanded
                autocomplete
                v-model="selectedUsers"
                :data="users"
                :loading="isLoading.search"
                open-on-focus
                append-to-body
                @typing="searchUser"
                :allow-duplicates="false"
                @input="cleanUpSearch"
              >
                <!-- Autocomplete item -->
                <template slot-scope="props">
                  <div
                    class="is-flex has-vcentered"
                    style="margin: 0.25rem 0"
                    v-if="!isLoading.search"
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
                <template
                  slot="selected"
                  slot-scope="props"
                >
                  <b-tag
                    v-for="(tag, index) in props.tags"
                    :key="index"
                    rounded
                    :tabstop="false"
                    closable
                    @close="$refs.taginput.removeTag(index, $event)"
                  >
                    <div
                      v-if="!tag.email_invite"
                      class="is-flex has-vcentered"
                      style="margin-left: -0.35rem"
                    >
                      <figure class="image is-16x16 is-inline-flex">
                        <img
                          class="is-rounded"
                          :src="getProfileImageFromUser(tag)"
                          alt="Profile Image"
                        >
                      </figure>
                      <span
                        class="is-capitalized"
                        style="margin: 0 0.15rem 0rem 0.4rem"
                      >
                        {{ tag.first_name }}
                        {{ tag.last_name }}
                      </span>
                    </div>
                    <div v-else>
                      <b-tooltip
                        type="is-dark"
                        label="Send via Email"
                      >
                        <b-icon
                          icon="mdil-email"
                          type="is-primary"
                        />
                        <span
                          class="is-capitalized"
                          style="margin: 0 0.15rem 0rem -0.3rem"
                        >
                          {{ tag.first_name }}
                          {{ tag.last_name }}
                        </span>
                      </b-tooltip>
                    </div>
                  </b-tag>
                </template>
                <template slot="empty">
                  <div
                    class="is-flex has-hcentered"
                    v-if="!isLoading.search"
                  >
                    {{ isSearching ? "No results found" : "Search by typing the name" }}
                  </div>
                </template>
                <template slot="footer">
                  <b-skeleton v-if="!rateLimit || isLoading.invites" />
                  <a
                    @click="isInviteEmailModal = true"
                    v-else-if="rateLimit.left > 0"
                  >
                    <b-icon icon="mdil-email" />
                    Invite people via email
                  </a>
                  <b-tooltip
                    v-else
                    class="is-disabled"
                    type="is-danger"
                    multilined
                    append-to-body
                    :label="`You have reached sending limit${rateLimit.refresh_time ? ' which will reset at ' + rateLimit.refresh_time.toLocaleString() : '.'}`"
                  >
                    <b-icon icon="mdil-email" />
                    Invite people via email (disabled temoporarily)
                  </b-tooltip>
                </template>
              </b-taginput>
              <p class="control">
                <b-button
                  :loading="isLoading.send"
                  :disabled="selectedUsers.length < 1"
                  icon-left="mdil-redo-variant"
                  type="is-light"
                  @click="sendInvite"
                >
                  <span v-if="selectedUsers.length < 1">Send Invite</span>
                  <span v-else>Send {{ selectedUsers.length }} Invite{{ selectedUsers.length > 1 ? "s" : "" }}</span>
                </b-button>
              </p>
            </b-field>
            <b-field
              class="field-margin"
            >
              <b-input
                v-model.trim="message"
                placeholder="Enter an optional message along with each invitation (max. 200 characters)"
                expanded
                type="textarea"
                maxlength="200"
              />
            </b-field>
          </div>

          <hr>
          
          <!-- Invitation display -->
          <div
            v-if="invitations.length > 0 || isLoading.invites"
          >
            <!-- Header -->
            <div class="level is-mobile">
              <div class="level-left">
                <b-tag
                  type="is-primary-light"
                  size="is-medium"
                >
                  <b-icon icon="mdil-clipboard-text" />
                  Existing Invitation
                </b-tag>
              </div>
              <div
                class="level-right"
                v-if="!isLoading.invites"
              >
                <b-pagination
                  :total="pagination.total"
                  :per-page="pagination.limit"
                  :current.sync="pagination.current"
                  icon-pack="mdil"
                  icon-prev="chevron-left"
                  order="is-right"
                  simple
                  @change="fetchInvites"
                />
              </div>
            </div>
            
            <div
              class="media"
              v-for="(invitation, id) in invitations"
              :key="id"
            >
              <figure class="media-left">
                <p class="image is-48x48">
                  <img
                    v-if="invitation.type === 'internal'"
                    class="is-rounded"
                    :src="getProfileImageFromUser(invitation.user)"
                  >
                  <b-tooltip
                    v-else
                    label="Invited via Email"
                  >
                    <b-icon
                      class="circle-icon has-background-primary-light"
                      
                      icon="mdil-email"
                      size="is-large"
                      custom-size="mdil-24px"
                      type="is-primary"
                    />
                  </b-tooltip>
                </p>
              </figure>

              <div class="media-content">
                <div class="content">
                  <p>
                    <b class="is-capitalized">{{ invitation.user.first_name }} {{ invitation.user.last_name }} </b>
                    <span v-if="invitation.user.email">({{ invitation.user.email }})</span>
                    <br>
                    <span v-if="invitation.message">
                      <b-icon icon="mdil-message-text" />
                      <ShowMoreField
                        :value="invitation.message"
                        line-break
                        foreground-colour="#FFFFFF"
                      />
                    </span>
                    <span
                      v-else
                      class="has-text-grey"
                    >
                      <b-icon icon="mdil-message" />
                      <span>No message</span>
                    </span>
                  </p>
                </div>
              </div>

              <div class="media-right">
                <div
                  class="is-italic is-flex has-vcentered"
                  style="margin-bottom: 0.25rem"
                >
                  <div
                    v-if="!invitation.accepted_at"
                    class="has-text-grey"
                  >
                    <small>Awaiting reponse</small>
                    <b-icon icon="mdil-clock" />
                  </div>
                  <div
                    v-else
                    class="has-text-success"
                  >
                    <small>Accepted</small>
                    <b-icon icon="mdil-check" />
                  </div>

                  <!-- Date -->
                  <b-tooltip
                    :label="`Invited on ${invitation.create_date.toLocaleString()}`"
                    type="is-dark"
                    position="is-left"
                    class="has-text-grey"
                  >
                    <b-icon icon="mdil-calendar" />
                  </b-tooltip>
                </div>

                <div class="has-text-right action-buttons">
                  <!-- View Profile -->
                  <b-tooltip
                    v-if="invitation.type === 'internal'"
                    label="View Profile"
                    type="is-dark"
                    position="is-left"
                  >
                    <b-button
                      tag="router-link"
                      icon-right="mdil-eye mdil-18px"
                      type="is-info"
                      outlined
                      :to="{ name: 'User Profile View', params: { username: invitation.user.username } }"
                      target="_blank"
                    />
                  </b-tooltip>

                  <!-- Remove -->
                  <b-tooltip
                    v-if="!invitation.accepted_at"
                    label="Remove"
                    type="is-dark"
                    position="is-left"
                  >
                    <b-button
                      icon-right="mdil-delete mdil-18px"
                      type="is-danger"
                      outlined
                      @click="deleteId = invitation.id; isConfirmDeleteModalActive = true"
                      :loading="isLoading.send"
                    />
                  </b-tooltip>
                </div>
              </div>
            </div>

            <div
              v-if="invitations.length === 0"
              class="media"
            >
              <figure class="media-left">
                <b-skeleton
                  circle
                  width="48px"
                  height="48px"
                />
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <b-skeleton />
                    <b-skeleton />
                  </p>
                </div>
              </div>
              <div class="media-right">
                <b-skeleton width="30px" />
              </div>
            </div>
          </div>
          <div
            class="no-project has-vcentered"
            v-else
          >
            <div class="info-icon">
              <b-icon
                icon="mdil-content-paste"
                custom-size="mdil-48px"
                type="is-grey-light"
              />
            </div>
            <div class="info-content">
              <p class="has-text-grey">
                <span class="is-size-5 has-text-grey-dark">No Existing Invitations</span><br>
                <span>Invite someone by using the search function above.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="isInviteEmailModal"
      :can-cancel="['escape', 'outside']"
      :width="500"
      class="card-modal"
    >
      <div class="card">      
        <div class="card-content manage-team-join-request">
          <!-- Title -->
          <header class="level is-mobile">
            <div class="level-left">
              <p class="has-text-primary is-capitalized is-size-5">
                Invite By Email
              </p>
            </div>
            <div class="level-right">
              <button
                class="delete"
                aria-label="close"
                @click="closeEmailInvitationModal"
              />
            </div>
          </header>

          <ValidationObserver
            ref="observer"
            v-slot="{ passed }"
          >
            <div class="container">
              <p class="field-margin">
                Enter the name and email of the person you'd like to invite.
              </p>
              
              <PersonalInfoField
                :has-position="false"
                v-model="emailInvitation"
              />
            </div>

            <div class="buttons footer-actions">
              <b-button
                @click="closeEmailInvitationModal"
              >
                Cancel
              </b-button>
              <b-button
                :loading="isLoading.search"
                :disabled="!passed"
                type="is-primary"
                @click="createEmailInvitation"
                class="is-capitalized"
              >
                Create Email Invitation
              </b-button>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </b-modal>

    <!-- Confirm Delete User Modal -->
    <ConfirmDangerModal
      :active.sync="isConfirmDeleteModalActive"
      type="invitation"
      action="remove"
      :on-action="removeInvite"
    />
  </div>
</template>

<script>
import * as UserManage from "@/api/userManage.js"
import * as InviteManage from "@/api/inviteManage.js"
import { displayErrorToast } from "@/api/errorHandler.js"
import PersonalInfoField from '@/components/Field/PersonalInfoField.vue'
import { ValidationObserver } from 'vee-validate'
import ConfirmDangerModal from '@/components/Modal/ConfirmDangerModal.vue'
import ShowMoreField from '@/components/Field/ShowMoreField.vue'

export default {
  components: {
    PersonalInfoField,
    ValidationObserver,
    ConfirmDangerModal,
    ShowMoreField
  },
  props: {
    type: {
      type: String,
      required: true
    },
    typeId: {
      type: String,
      default: undefined 
    },
    action: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    members: {
      type: Array,
      default: () => []
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

      if (val) {
        // Clean up when modal is closed
        this.invitations = []
        this.users = []
        this.isSearching = false
        this.selectedUsers = []
        this.message = ""

        // Fetch invites
        this.fetchInvites()
      }
    }
  },
  data() {
    return {
      isActive: false,
      isLoading: {
        search: false,
        send: false,
        invites: true
      },
      isInviteEmailModal: false,
      isConfirmDeleteModalActive: false,
      isSearching: false,
      users: [],
      selectedUsers: [],
      message: "",
      emailInvitation: {
        first_name: "",
        last_name: "",
        email: ""
      },
      invitations: [], // Set three empty elements to allow loading skeleton animation
      pagination: {
        total: 0,
        limit: 5,
        current: 1
      },
      rateLimit: undefined,
      deleteId: ""
    }
  },
  methods: {
    async fetchInvites() {
      this.isLoading.invites = true

      try {
        // Fetch invitations
        const invitations = await InviteManage.fetchInvitations(this.type, this.typeId, this.pagination)
        this.invitations = invitations.results
        this.pagination.total = invitations.count

        // Fetch rate limit configuration
        this.rateLimit = await InviteManage.fetchRateLimitConfig("invite", "email")
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.invites = false
      }
    },
    async searchUser(keyword) {
      this.isLoading.search = true

      // Change searching flag
      this.isSearching = keyword !== ""

      // Fetch users
      try {
        if (keyword) {
          let users = await UserManage.queryUserByName(keyword, false)

          // Remove members and already invitated users
          this.users = users.filter((user) => {
            const isMember = this.members.some(member => member.member && member.member.id === user.id)
            const hasInvited = this.invitations.some(invitation => invitation.user && invitation.user.id === user.id)

            return !isMember && !hasInvited
          })
        } else {
          this.users = []
        }
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.search = false
      }
    },
    closeEmailInvitationModal() {
      this.emailInvitation = {
        first_name: "",
        last_name: "",
        email: ""
      }
      this.isInviteEmailModal = false
    },
    cleanUpSearch() {
      this.isSearching = false
      this.users = []
    },
    async createEmailInvitation() {
      this.isLoading.search = true

      // Check if this email is asscoiated with a user
      try {
        const assoUser = await UserManage.getUserByEmail(this.emailInvitation.email)

        if (assoUser) {
          // If sent to yourself, throw an error
          if (assoUser.id === this.currentUser.id) throw new Error("You cannot invite yourself.")
          this.selectedUsers.push(assoUser)

          this.$buefy.toast.open({
            duration: 5000,
            message: `${assoUser.email} is associated to a member on the Registry. Your invitation will be sent to their account.`,
            type: 'is-success',
            queue: false
          })
        } else {
          this.selectedUsers.push({
            first_name: this.emailInvitation.first_name,
            last_name: this.emailInvitation.last_name,
            email: this.emailInvitation.email,
            email_invite: true
          })
        }

        this.$refs.taginput.newTag = ""
        this.closeEmailInvitationModal()
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.search = false
      }
    },
    async sendInvite() {
      // Don't init if no users selected
      if (this.selectedUsers.length < 1) return
      
      this.isLoading.send = true

      // Save invites
      try {
        const invitesSent = await InviteManage.addInvitations(this.selectedUsers, this.type, this.typeId, this.message)

        // Prepare message
        let message = `${invitesSent.length} invite${invitesSent.length > 1 ? "s" : ""} sent.`
        const diff = this.selectedUsers.length - invitesSent.length
        if (diff > 0) message += ` ${diff} invites were skipped because they already exist.`

        this.$buefy.toast.open({
          duration: 5000,
          message: message,
          type: 'is-success',
          queue: false
        })
        this.selectedUsers = []

        // Refresh invitations
        this.fetchInvites()
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.send = false
      }
    },
    async removeInvite() {
      this.isLoading.send = true
      
      try {
        await InviteManage.removeInvite(this.deleteId)
        await this.fetchInvites()
      } catch (error) {
        await displayErrorToast(error)
      } finally {
        this.isLoading.send = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.footer-actions
  margin-top: 1.5rem
  justify-content: flex-end
.is-disabled
  opacity: 0.5
  cursor: not-allowed
</style>