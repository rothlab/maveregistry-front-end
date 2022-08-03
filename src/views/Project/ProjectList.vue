<template>
  <div class="page-card">
    <!-- Header -->
    <div class="hero is-light">
      <div class="hero-body has-page-header-padding">
        <div class="container">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="content">
                <p class="is-size-3 has-text-weight-medium">Projects</p>
              </div>
            </div>
            <div class="level-right">
              <div class="buttons">
                <!-- Register new project -->
                <!-- Non-mobile style -->
                <b-button
                  icon-left="mdil-plus"
                  type="is-warning"
                  size="is-medium"
                  class="is-hidden-mobile small-shadow"
                  @click="handleNewTargetModal()"
                >
                  New Project
                </b-button>
                <!-- Mobile style -->
                <b-button
                  icon-left="mdil-plus"
                  type="is-warning"
                  size="is-medium"
                  class="is-hidden-tablet small-shadow"
                  @click="handleNewTargetModal()"
                >
                  New
                </b-button>

                <!-- Invite -->
                <b-button
                  icon-left="mdil-email-open"
                  type="is-warning"
                  size="is-medium"
                  class="small-shadow"
                  @click="handleInvite()"
                >
                  Invite
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="
        container
        has-fullheight has-top-padding has-touch-container-padding
      "
    >
      <Error :message="errorMessage" v-if="errorMessage !== ''" />

      <!-- Project table -->
      <div v-else>
        <!-- Tip -->
        <!-- Make sure you added the tip to the preferenceModule store -->
        <TipAction tip="why_follow">
          <p
            class="has-text-weight-bold field-margin"
            style="padding-right: 1rem"
          >
            What do I get by
            <span class="has-text-info">following a project</span>
            ?
          </p>
          Once your request to follow a project is approved by the project
          owner, you will be able to:
          <p style="margin: 0.5rem 0 0.75rem 0">
            <b-icon
              icon="mdil-check"
              class="circle-icon has-background-success has-text-white"
            />
            Access project details such as activities
          </p>
          <p>
            <b-icon
              icon="mdil-check"
              class="circle-icon has-background-success has-text-white"
            />
            Receive on-site and email notifications of project update
          </p>
          <p
            class="has-text-weight-bold field-margin"
            style="padding-right: 1rem"
          >
            Need some help?
          </p>
          <p style="margin: 0.5rem 0 0.75rem 0">
            <b-icon
              icon="mdil-play"
              class="circle-icon has-background-info"
              type="is-light"
            />
            Watch
            <a @click.stop.prevent="isTutorialModalActive = true"
              >this video tutorial</a
            >
            to get started!
          </p>
        </TipAction>

        <!-- Filter -->
        <!-- These filters will be on the same line -->
        <div class="filter-same-line">
          <!-- Filter by type -->
          <b-dropdown
            :triggers="['hover', 'click']"
            v-model="filter.type"
            :mobile-modal="false"
            @input="fetchTargets()"
            class="filter-item"
          >
            <b-button
              slot="trigger"
              slot-scope="{ active }"
              :type="filter.type ? 'is-info' : 'is-light'"
            >
              <FilterOutline class="filter-icon icon-18px" />
              <span style="margin-left: 0.25rem">Type</span>
              <b-icon
                :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'"
              />
            </b-button>

            <b-dropdown-item
              v-if="filter.type !== ''"
              value=""
              class="has-text-info"
            >
              Clear Filter
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(type, id) in types"
              :key="id"
              :value="type"
            >
              {{ type }}
            </b-dropdown-item>
          </b-dropdown>

          <!-- Filter by organism -->
          <b-dropdown
            :triggers="['hover', 'click']"
            v-model="filter.organism"
            :mobile-modal="false"
            position="is-bottom-left"
            @input="fetchTargets()"
            class="filter-item"
          >
            <b-button
              slot="trigger"
              slot-scope="{ active }"
              :type="filter.organism ? 'is-info' : 'is-light'"
            >
              <FilterOutline class="filter-icon icon-18px" />
              <span style="margin-left: 0.25rem">Organism</span>
              <b-icon
                :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'"
              />
            </b-button>

            <b-dropdown-item
              v-if="filter.organism !== ''"
              value=""
              class="has-text-info"
            >
              Clear Filter
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(organism, id) in organisms"
              :key="id"
              :value="organism"
            >
              <i>{{ organism }}</i>
            </b-dropdown-item>
          </b-dropdown>

          <!-- Filter by condition -->
          <b-dropdown
            v-if="hasLoggedIn"
            :triggers="['hover', 'click']"
            v-model="filter.conditions"
            multiple
            :mobile-modal="false"
            @input="fetchTargets()"
            class="filter-item"
          >
            <b-button
              slot="trigger"
              slot-scope="{ active }"
              :type="filter.conditions.length > 0 ? 'is-info' : 'is-light'"
            >
              <FilterOutline class="filter-icon icon-18px" />
              <span style="margin-left: 0.25rem">Condition</span>
              <b-icon
                :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'"
              />
            </b-button>

            <b-dropdown-item
              v-if="filter.conditions.length > 0"
              value="clear"
              class="has-text-info"
            >
              Clear Filter
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(key, id) in Object.keys(conditions)"
              :key="id"
              :value="key"
            >
              <b-icon
                :class="`circle-icon ${conditions[key].icon_class}`"
                :icon="conditions[key].icon"
              />
              {{ conditions[key].name }}
            </b-dropdown-item>
          </b-dropdown>

          <!-- Filter by creation date -->
          <b-datepicker
            v-model="filter.created_after"
            placeholder="Created Since"
            icon="mdil-calendar"
            icon-prev="mdil-chevron-left"
            icon-next="mdil-chevron-right"
            :class="{ 'highlight-filter': filter.created_after }"
            :mobile-native="false"
            :max-date="new Date()"
            @input="fetchTargets()"
            class="filter-item"
          >
            <template #trigger>
              <b-tooltip
                label="Project created on or after this date"
                type="is-dark"
              >
                <b-button :type="filter.created_after ? 'is-info' : 'is-light'">
                  <FilterOutline class="filter-icon icon-18px" />
                  <span>
                    {{
                      filter.created_after
                        ? filter.created_after.toLocaleDateString()
                        : "Date"
                    }}
                  </span>
                </b-button>
              </b-tooltip>
            </template>
            <b-button
              type="is-info"
              outlined
              @click="
                filter.created_after = undefined;
                fetchTargets();
              "
              expanded
              v-if="filter.created_after"
            >
              Clear Filter
            </b-button>
          </b-datepicker>

          <!-- Filter by progress -->
          <b-dropdown
            :triggers="['hover', 'click']"
            v-model="filter.progress"
            :mobile-modal="false"
            position="is-bottom-left"
            @input="fetchTargets()"
            class="filter-item"
          >
            <b-button
              slot="trigger"
              slot-scope="{ active }"
              :type="filter.progress ? 'is-info' : 'is-light'"
            >
              <FilterOutline class="filter-icon icon-18px" />
              <span style="margin-left: 0.25rem">Progress</span>
              <b-icon
                :icon="active ? 'mdil-chevron-up' : 'mdil-chevron-down'"
              />
            </b-button>

            <b-dropdown-item
              v-if="filter.progress !== ''"
              value=""
              class="has-text-info"
            >
              Clear Filter
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(progress, id) in progresses"
              :key="id"
              :value="progress"
            >
              {{ progress }}
            </b-dropdown-item>
          </b-dropdown>

          <!-- Filter by name -->
          <b-field class="filter-item" style="width: 9rem">
            <b-input
              v-model="filter.name"
              placeholder="Target"
              icon="mdil-magnify"
              :icon-right="filter.name ? 'mdil-delete' : ''"
              icon-right-clickable
              @icon-right-click="
                filter.name = '';
                fetchTargets();
              "
              :class="{ 'highlight-filter': filter.name }"
              @input="debouncedFetchTargets()"
            />
          </b-field>
        </div>

        <b-table
          :key="JSON.stringify(currentUser)"
          :data="targets"
          :loading="isLoading.fetch_targets"
          hoverable
          paginated
          pagination-position="bottom"
          backend-pagination
          icon-pack="mdil"
          :per-page="pagination.limit"
          :total="pagination.count"
          :current-page="pagination.current"
          @page-change="
            (change) => {
              pagination.current = change;
              fetchTargets();
            }
          "
        >
          <!-- No results -->
          <template slot="empty">
            <div
              class="no-project has-vcentered"
              v-if="!isLoading.fetch_targets"
            >
              <div class="info-icon">
                <b-icon
                  icon="mdil-clipboard"
                  custom-size="mdil-48px"
                  type="is-grey-light"
                />
              </div>
              <div class="info-content">
                <p class="has-text-grey">
                  <span class="is-size-5"
                    >Sorry, we couldn't find any results.</span
                  >
                </p>
              </div>
            </div>
          </template>

          <!-- Download all results -->
          <template slot="bottom-left">
            <b-button
              icon-left="mdil-download"
              type="is-light"
              expanded
              @click="downloadAll"
              v-if="pagination.count > 0"
              :loading="isLoading.prepare_download"
              :disabled="isLoading.fetch_targets"
            >
              Download All {{hasProjectFilter ? "Filtered" : ""}} Projects
            </b-button>
          </template>

          <!-- Target name-->
          <b-table-column
            field="target_name"
            label="Target"
            cell-class="is-uppercase vertical-center target-name"
            v-slot="props"
          >
            <span :title="props.row.name.toUpperCase()">{{
              props.row.name
            }}</span>
          </b-table-column>

          <!-- Target type -->
          <b-table-column
            field="target_type"
            label="Type"
            cell-class="is-capitalized vertical-center"
            v-slot="props"
          >
            <span v-if="props.row.type === 'Gene'">Gene</span>
            <span v-else>Other</span>
          </b-table-column>

          <!-- Target species -->
          <b-table-column
            field="target_organism"
            label="Organism"
            v-slot="props"
            cell-class="vertical-center"
          >
            <i>{{ props.row.organism }}</i>
          </b-table-column>

          <!-- Active teams -->
          <b-table-column
            field="team"
            label="Team"
            v-slot="props"
            cell-class="vertical-center"
          >
            <div v-if="!hasLoggedIn">
              <b-icon icon="mdil-lock" class="team-icon" />
              Login for details
            </div>
            <div v-else>
              <div v-for="(team, index) in props.row.teams" :key="index">
                <router-link
                  :to="{ path: `/team/${team.id}` }"
                  target="_blank"
                  class="is-capitalized"
                >
                  <b-icon icon="mdil-account" class="team-icon" />
                  {{ team.name }}
                </router-link>
              </div>
            </div>
          </b-table-column>

          <!-- Progress -->
          <b-table-column
            field="projects"
            label="Project"
            width="600px"
            v-slot="props"
          >
            <div class="has-text-left">
              <!-- If not member, show this panel to indicate that nothing is available -->
              <div
                v-if="props.row.projects.length < 1 && hasLoggedIn"
                class="card project-card has-background-light"
              >
                <div class="card-header">
                  <p class="card-header-title">
                    <b-icon icon="mdil-play" style="margin-right: 0.25rem" />
                    Under Investigation
                  </p>
                </div>
              </div>

              <div
                v-if="props.row.projects.length < 1 && !hasLoggedIn"
                class="card project-card has-background-light"
              >
                <div class="card-header">
                  <p class="card-header-title">
                    <b-icon icon="mdil-lock" style="margin-right: 0.25rem" />
                    Login for details
                  </p>
                </div>
              </div>

              <b-collapse
                v-else
                class="card project-card has-background-light"
                animation="slide"
                v-for="(project, index) in props.row.projects"
                :key="`${index}-${pagination.current}`"
                :open="false"
              >
                <div
                  slot="trigger"
                  slot-scope="innerProps"
                  class="card-header"
                  role="button"
                >
                  <p v-if="project.type" class="card-header-title">
                    <b-icon
                      :icon="progressIcons[project.type]"
                      style="margin-right: 0.25rem"
                    />
                    <span class="is-capitalized description">{{
                      project.type
                    }}</span>
                    <span
                      class="
                        is-size-7
                        has-text-info
                        is-hidden-touch is-hidden-desktop-only
                      "
                      style="margin-left: 0.5rem"
                      >({{ innerProps.open ? "Collapse" : "Expand" }})</span
                    >
                  </p>
                  <p v-else class="card-header-title">
                    <b-icon icon="mdil-play" style="margin-right: 0.25rem" />
                    <span class="is-capitalized description"
                      >Under Investigation</span
                    >
                    <span
                      class="
                        is-size-7
                        has-text-info
                        is-hidden-touch is-hidden-desktop-only
                      "
                      style="margin-left: 0.5rem"
                      >({{ innerProps.open ? "Collapse" : "Expand" }})</span
                    >
                  </p>
                  <div class="card-header-icon">
                    <!-- Open for funding -->
                    <b-tooltip
                      label="Open for funding"
                      v-if="isFunder && project.open_for_funding"
                      type="is-warning"
                    >
                      <b-icon
                        class="circle-icon has-background-warning has-text-dark"
                        icon="mdil-currency-usd"
                      />
                    </b-tooltip>

                    <!-- Owner -->
                    <b-tooltip
                      label="Project you created"
                      v-if="
                        hasLoggedIn &&
                        project.creator.username === currentUser.username
                      "
                      type="is-success"
                    >
                      <b-icon
                        icon="mdil-account"
                        class="
                          circle-icon
                          has-background-success has-text-light
                        "
                      />
                    </b-tooltip>

                    <!-- Follow -->
                    <b-tooltip
                      label="Following the project"
                      v-if="
                        project.follow_status &&
                        project.follow_status.status === 'yes'
                      "
                      type="is-info"
                    >
                      <b-icon
                        icon="mdil-bell"
                        class="circle-icon has-background-info has-text-light"
                      />
                    </b-tooltip>

                    <!-- Expand -->
                    <b-icon
                      :icon="
                        innerProps.open
                          ? 'mdil-chevron-up'
                          : 'mdil-chevron-down'
                      "
                    />
                  </div>
                </div>
                <div class="card-content">
                  <div class="content">
                    <div class="is-size-6">
                      <span
                        class="has-text-primary"
                        v-if="project.features && project.features.length > 0"
                      >
                        Feature{{ project.features.length > 1 ? "s:" : ":" }}
                        {{ project.features.join(", ") }}
                        <br />
                      </span>

                      <ShowMoreField
                        v-if="project.description"
                        :value="project.description"
                      />
                      <div v-else-if="project.follow_status && currentUser">
                        <p
                          v-if="
                            !project.follow_status.id &&
                            project.creator.username !== currentUser.username &&
                            !isModerator
                          "
                          class="has-text-danger font-14px"
                        >
                          Click "Follow Project" to request access to project
                          details and receive update alerts.
                        </p>
                        <p
                          v-else-if="project.follow_status.status === 'pending'"
                          class="has-text-danger font-14px"
                        >
                          Your follow request is pending approval. Once
                          approved, you will gain access to project details and
                          receive update alerts.
                        </p>
                        <p
                          v-else-if="
                            project.follow_status.status === 'yes' ||
                            project.creator.username === currentUser.username ||
                            isModerator
                          "
                          class="has-text-danger font-14px"
                        >
                          No details available for this project.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="card-footer-item has-background-white-bis">
                    <router-link
                      :to="{ path: `/project/${project.id}` }"
                      target="_blank"
                    >
                      <b-icon icon="mdil-magnify" />
                      Details
                    </router-link>
                  </div>
                  <div
                    v-if="
                      project.follow_status &&
                      currentUser &&
                      project.creator.username !== currentUser.username &&
                      project.follow_status
                    "
                    class="card-footer-item"
                    :class="{
                      'has-background-white-bis': !project.follow_status.id,
                      'has-background-warning':
                        project.follow_status.status === 'pending',
                      'has-background-info':
                        project.follow_status.status === 'yes',
                    }"
                  >
                    <!-- If not followed, show follow icon -->
                    <div v-if="!project.follow_status.id">
                      <a
                        @click="
                          confirmFollow(project.id, 'project', project.creator)
                        "
                      >
                        <b-icon icon="mdil-bell" />
                        Follow
                        <span class="is-hidden-mobile">Project</span>
                      </a>
                    </div>
                    <!-- If pending, show pending status and unfollow-->
                    <b-tooltip
                      :label="
                        project.follow_status.status === 'pending'
                          ? 'Pending Approval. Click to cancel request.'
                          : 'Unfollow Project'
                      "
                      type="is-dark"
                      v-else
                    >
                      <a
                        @click="
                          confirmUnfollow(project.follow_status.id, 'project')
                        "
                        :class="{
                          'has-text-info': !project.follow_status.id,
                          'has-text-dark':
                            project.follow_status.status === 'pending',
                          'has-text-light':
                            project.follow_status.status === 'yes',
                        }"
                      >
                        <span v-if="project.follow_status.status === 'pending'">
                          <b-icon icon="mdil-clock" />
                          Pending
                        </span>
                        <span
                          v-else-if="project.follow_status.status === 'yes'"
                        >
                          <b-icon icon="mdil-bell" />
                          Following
                        </span>
                      </a>
                    </b-tooltip>
                  </div>
                </div>
              </b-collapse>
            </div>
          </b-table-column>

          <!-- Action -->
          <b-table-column
            field="action"
            label="Action"
            width="5vw"
            v-slot="props"
          >
            <b-field>
              <!-- Follw target -->
              <p class="control action-button" style="flex-grow: 1">
                <b-tooltip
                  :label="
                    props.row.follow_status &&
                    props.row.follow_status.status === 'yes'
                      ? 'Unfollow target'
                      : 'Follow target'
                  "
                  type="is-dark"
                  class="has-fullwidth"
                >
                  <!-- Confirm follow -->
                  <b-button
                    v-if="
                      !props.row.follow_status ||
                      props.row.follow_status.status === 'no'
                    "
                    icon-left="mdil-bell"
                    @click="confirmFollow(props.row.id, 'target')"
                    type="is-light"
                    style="justify-content: flex-start"
                    expanded
                  >
                    Follow
                  </b-button>
                  <b-button
                    v-else-if="
                      props.row.follow_status &&
                      props.row.follow_status.status === 'yes'
                    "
                    icon-left="mdil-bell"
                    @click="
                      confirmUnfollow(props.row.follow_status.id, 'target')
                    "
                    type="is-info"
                    style="justify-content: flex-start"
                    expanded
                  >
                    Following
                  </b-button>
                </b-tooltip>
              </p>

              <!-- Add project -->
              <p class="control action-button">
                <b-tooltip label="Add new project" type="is-dark">
                  <b-button
                    icon-right="mdil-plus"
                    @click="handleNewTargetModal(props.row)"
                    type="is-light"
                  />
                </b-tooltip>
              </p>
              <p class="control action-button">
                <!-- Show MaveQuest for human genes -->
                <b-tooltip
                  v-if="
                    props.row.type == 'Gene' &&
                    props.row.organism == 'H. sapiens'
                  "
                  label="Expore at MaveQuest"
                  type="is-dark"
                >
                  <b-button
                    tag="a"
                    :href="
                      'https://mavequest.varianteffect.org/query?gene=' +
                      props.row.name
                    "
                    target="_blank"
                    type="is-light"
                    class="mavequest-button"
                  >
                    <img src="@/assets/image/mavequest_logo_grey.png" />
                  </b-button>
                </b-tooltip>
                <!-- Show Google search for others -->
                <b-tooltip v-else label="Look up" type="is-info">
                  <b-button
                    tag="a"
                    :href="'https://www.google.com/search?q=' + props.row.name"
                    rel="noopener noreferrer"
                    target="_blank"
                    icon-right="mdil-magnify"
                    type="is-light"
                    style="width: 44px"
                  />
                </b-tooltip>
              </p>
            </b-field>
          </b-table-column>
        </b-table>
      </div>

      <!-- Follow up modal -->
      <FollowModal
        :active.sync="isFollowModelActive"
        :source="followProp.source"
        :creator="followProp.creator"
        :type="followProp.type"
        @change="fetchTargets()"
      />

      <!-- Unfollow modal -->
      <UnfollowModal
        :active.sync="isUnfollowModelActive"
        :follow="followProp.follow"
        :type="followProp.type"
        @change="fetchTargets()"
      />

      <!-- Follow target modal -->
      <ConfirmInfoModal
        :active.sync="isFollowTargetModalActive"
        action="follow"
        type="target"
        :is-irreversible="false"
        :on-action="followTarget"
      >
        <p style="margin-top: 1rem">
          You will be notified when new projects or nominations concerning this
          target are added to the Registry.
        </p>
      </ConfirmInfoModal>

      <!-- New project modal -->
      <NewTargetModal
        :active.sync="isNewTargetModalActive"
        title="Add a New Project"
        :submit="addProject"
        submit-text="Add Project"
        :target="preFilledProject"
        has-feature
      />

      <!-- Tutorial modal -->
      <VideoTutorialPlayerModal
        :active.sync="isTutorialModalActive"
        :selected="1"
      />

      <!-- Invite modal -->
      <InviteModal
        type="project"
        action="create"
        :active.sync="isInviteModalActive"
      />
    </div>
  </div>
</template>

<script>
import * as ProjectManage from "@/api/projectManage.js";
import * as FollowManage from "@/api/followManage.js";
import { handleError } from "@/api/errorHandler.js";
import Error from "@/components/Error.vue";
import FollowModal from "@/components/Modal/FollowModal.vue";
import UnfollowModal from "@/components/Modal/UnfollowModal.vue";
import NewTargetModal from "@/components/Modal/NewTargetModal.vue";
import ConfirmInfoModal from "@/components/Modal/ConfirmInfoModal.vue";
import VideoTutorialPlayerModal from "@/components/Modal/VideoTutorialPlayerModal.vue";
import InviteModal from "@/components/Modal/InviteModal.vue";
import ShowMoreField from "@/components/Field/ShowMoreField.vue";
import TipAction from "@/components/Action/TipAction.vue";
import FilterOutline from "vue-material-design-icons/FilterOutline.vue";
import debounce from "lodash/debounce";
import pick from "lodash/pick";
import { displayErrorToast } from "../../api/errorHandler";
import { unparse } from "papaparse";
import { saveAs } from "file-saver";

const variables = require("@/assets/script/variables.json");

export default {
  title: "Projects",
  components: {
    Error,
    FollowModal,
    UnfollowModal,
    NewTargetModal,
    ConfirmInfoModal,
    VideoTutorialPlayerModal,
    InviteModal,
    ShowMoreField,
    TipAction,
    FilterOutline,
  },
  watch: {
    async currentUser(newVal, oldVal) {
      // Only fetch if user status has changed
      // If logged in or logged out, refresh
      if ((!newVal && oldVal) || (newVal && !oldVal)) {
        if (this.hasInitLoad) await this.fetchTargets();
      }

      // If both logged in status, compare id
      // and only refresh when user has changed
      if (newVal && oldVal && newVal.id !== oldVal.id) {
        if (this.hasInitLoad) await this.fetchTargets();
      }
    },
    isFunder(val) {
      if (val) {
        this.conditions = variables.conditions;
      }
    },
  },
  computed: {
    hasProjectFilter() {
      return !!this.filter.type || !!this.filter.name || !!this.filter.organism
        || !!this.filter.created_after || (!Array.isArray(this.filter.conditions) || this.filter.conditions.length > 0) || !!this.filter.progress
    },
  },
  data() {
    return {
      targets: [],
      pagination: {
        count: 0,
        limit: 10,
        current: 1,
      },
      progressIcons: variables.progress_type_icons,
      types: variables.target_types,
      organisms: variables.target_organisms,
      progresses: variables.progress_type,
      conditions: variables.conditions,
      // Filter
      filter: {
        type: "",
        organism: "",
        name: "",
        created_after: undefined,
        conditions: [],
        progress: "",
      },
      // Follow/unfollow target related parameters
      isFollowModelActive: false,
      isFollowTargetModalActive: false,
      followProp: {
        source: "",
        creator: {},
        follow: "",
        type: "",
      },
      preFilledProject: undefined,
      isUnfollowModelActive: false,
      // Register new activity related parameters
      isNewTargetModalActive: false,
      // Show video tutorial
      isTutorialModalActive: false,
      // Invite people modal
      isInviteModalActive: false,
      isLoading: {
        new_project: false,
        follow_unfollow: false,
        fetch_targets: false,
        prepare_download: false,
      },
      errorMessage: "",
      hasInitLoad: false,
    };
  },
  async mounted() {
    // If filter queries are supplied, process them
    if (this.$route.query) {
      if (this.$route.query.type) this.filter.type = this.$route.query.type;
      if (this.$route.query.name) this.filter.name = this.$route.query.name;
      if (this.$route.query.organism)
        this.filter.organism = this.$route.query.organism;
      if (this.$route.query.created_after) {
        const convertedDate = new Date(this.$route.query.created_after);
        if (
          Object.prototype.toString.call(convertedDate) === "[object Date]" &&
          isFinite(convertedDate)
        ) {
          this.filter.created_after = convertedDate;
        }
      }
    }

    // Hide display elements based on role
    if (!this.isFunder) {
      const conditionKeys = Object.keys(this.conditions).filter(
        (e) => !this.conditions[e].role || this.conditions[e].role !== "funder"
      );
      this.conditions = pick(this.conditions, conditionKeys);
    }

    // Handle funding needs as a filter in the link
    if (this.hasDeepLink("#with-funding-needs")) {
      try {
        this.isLoading.fetch_targets = true;
        // Waiting roles to refresh
        await this.$store.dispatch("getRoles");
        if (this.isFunder) this.filter.conditions.push("funding");
      } catch (error) {
        this.isLoading.fetch_targets = false;
        await displayErrorToast(error);
      }
    }

    await this.fetchTargets();

    // Handle other deep links
    if (this.hasDeepLink("#create")) this.handleNewTargetModal();

    this.hasInitLoad = true;
  },
  methods: {
    confirmFollow(id, type, creator) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login");
        return;
      }

      this.followProp.source = id;
      this.followProp.type = type;

      // If follow target, do not need approval
      if (type === "target") {
        this.isFollowTargetModalActive = true;
      } else {
        this.followProp.creator = creator;
        this.isFollowModelActive = true;
      }
    },
    confirmUnfollow(id, type) {
      this.followProp.follow = id;
      this.followProp.type = type;
      this.isUnfollowModelActive = true;
    },
    async fetchTargets() {
      // Loading
      this.isLoading.fetch_targets = true;

      // Calculate skip
      const skip = (this.pagination.current - 1) * this.pagination.limit;

      // Reset filter if clear is set
      if (
        this.filter.conditions.length > 0 &&
        this.filter.conditions.includes("clear")
      )
        this.filter.conditions = [];

      // Update targets
      try {
        const targets = await ProjectManage.fetchTargets(
          this.pagination.limit,
          skip,
          this.filter
        );
        this.targets = targets.results;

        // Update pagination
        this.pagination.count = targets.count;
      } catch (error) {
        this.errorMessage = await handleError(error);
      } finally {
        this.isLoading.fetch_targets = false;
      }
    },
    debouncedFetchTargets: debounce(async function () {
      return await this.fetchTargets();
    }, 500),
    handleNewTargetModal(prefill = undefined) {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        console.log("show login")
        this.$emit("login");
        return;
      }

      if (prefill) {
        this.preFilledProject = {
          type: prefill.type,
          name: prefill.name,
          organism: prefill.organism,
        };
      } else {
        this.preFilledProject = undefined;
      }

      this.isNewTargetModalActive = true;
    },
    async addProject(attrs) {
      const projectId = await ProjectManage.addProject(attrs);

      // Jump to new project registration page
      this.$router.push({
        name: "Project Edit",
        params: { id: projectId, action: "new" },
      });
    },
    async followTarget() {
      await FollowManage.follow(this.followProp.source, this.followProp.type);
      await this.fetchTargets();
    },
    handleInvite() {
      // If not logged in, show the login panel instead
      if (!this.hasLoggedIn) {
        this.$emit("login");
        return;
      }

      this.isInviteModalActive = true;
    },
    async downloadAll() {
      // Loading
      this.isLoading.prepare_download = true;

      // Fetch all targets
      try {
        const targets = await ProjectManage.fetchTargets(
          this.pagination.count,
          0,
          this.filter
        );
        const downloadData = targets.results;
        console.log(downloadData)

        // Format projects
        let formattedProjects = []
        for (const target of downloadData) {
          console.log(target)
          const projects = target.projects.map(project => {
            return {
              project_id: project.id,
              project_type: project.type ? project.type : "Under Investigation",
              target: target.name,
              target_type: target.type,
              organism: target.organism,
              features: project.features
            }
          });
          formattedProjects.push(...projects)
        }

        // Trigger download csv
        // Code inspired by the vue-json-csv package
        // https://github.com/Belphemur/vue-json-csv
        let csv = unparse(formattedProjects)
        csv = "\ufeff" + csv; // Set UTF-8 encoding
        let blob = new Blob([csv], {
          type: "application/csvcharset=" + this.encoding
        });
        saveAs(blob, "all_projects.csv");
      } catch (error) {
        this.errorMessage = await handleError(error);
      } finally {
        this.isLoading.prepare_download = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import "@/assets/style/variables.sass"

@media screen and (max-width: $break-mobile)
  .team-control
    justify-content: flex-end
    .control:first-child
      margin-right: 0 !important
    .control:not(:first-child)
      margin-left: 0.75rem
.team-control
  height: 3.25rem
  .tags
    border-radius: 4px
    flex-wrap: nowrap
    .tag
      margin: 0
      height: 2.5rem
      box-shadow: 0 0 0 0 rgba(10, 10, 10, 0.1) inset, 0 -1px 0 0 rgba(10, 10, 10, 0.1) inset
      &:first-child
        border-top-right-radius: 0
        border-bottom-right-radius: 0
        flex-grow: 1
        justify-content: flex-start
      &:only-child
        border-top-right-radius: 4px
        border-bottom-right-radius: 4px
        flex-grow: 1
        justify-content: flex-start

.card-header-icon
  .b-tooltip
    &:not(:last-child), &:only-child
      margin-right: 0.25rem
</style>

<style lang="sass">
@media screen and (min-width: 769px)
  .target-name
    max-width: 180px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
</style>