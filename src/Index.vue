<template>
  <section>
    <!-- Landing section-->
    <section class="hero is-large is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <!-- Intro -->
          <h2 class="subtitle">
            Amazing MAVE projects
          </h2>
          <h1 class="title is-uppercase">
            Registered Here
          </h1>
          <p>
            MAVE Registry is a database for activities on studying targets with Multiplexed Assays of Variant Effect (MAVE).
          </p>

          <!-- Action buttons -->
          <section>
            <div class="buttons">
              <b-button>Register Activity</b-button>
              <b-button>Team Progress</b-button>
            </div>
          </section>
        </div>
      </div>
      <div class="hero-footer">
        <!-- Tip to the next section -->
        <div class="tip has-text-centered">
          <p class="is-inline-flex has-vcentered">
            <b-icon
              size="is-medium"
              icon="mdil-chevron-double-down"
            />
            <span>How does it work?</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Onboarding section 1 -->
    <section class="hero is-medium is-bold">
      <div class="hero-body">
        <!-- Question -->
        <div class="container has-text-centered">
          <h1 class="title is-uppercase">
            How does it work?
          </h1>

          <div class="section">
            <!-- Steps -->
            <div class="step-line" />
            <div class="columns">
              <div class="column">
                <div class="step-number is-inline-flex has-vcentered has-text-centered has-background-white">
                  <p class="has-fullwidth has-text-primary">
                    1
                  </p>
                </div>
                <h2 class="subtitle is-capitalized">
                  Browse project
                </h2>
                <p>See which targets have been registered with activities.</p>
              </div>
              <div class="column">
                <div class="step-number is-inline-flex has-vcentered has-text-centered has-background-white">
                  <p class="has-fullwidth has-text-primary">
                    2
                  </p>
                </div>
                <h2 class="subtitle is-capitalized">
                  Register activity
                </h2>
                <p>Reguster activity on a target and see who is working on the same target.</p>
              </div>
              <div class="column">
                <div class="step-number is-inline-flex has-vcentered has-text-centered has-background-white">
                  <p class="has-fullwidth has-text-primary">
                    3
                  </p>
                </div>
                <h2 class="subtitle is-capitalized">
                  Keep updated
                </h2>
                <p>Follow team and get notified when they register new activities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-footer">
        <!-- Tip to the next section -->
        <div class="tip has-text-centered">
          <p class="is-inline-flex has-vcentered">
            <b-icon
              size="is-medium"
              icon="mdil-chevron-double-down"
            />
            <span>Why register your MAVE activity?</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Onboarding section 2 -->
    <section class="hero is-medium is-light is-bold">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-uppercase">
            Why register your MAVE activity?
          </h1>

          <div class="section">
            <b-tabs
              v-model="activeTab"
              size="is-small"
              position="is-centered"
              class="block"
            >
              <b-tab-item
                v-for="(tab, index) in tabs"
                :key="index"
              >
                <!-- Custom tab header -->
                <template slot="header">
                  <div class="content has-text-centered">
                    <div
                      class="step-number is-inline-flex has-vcentered"
                      :class="{ 'has-background-primary has-text-white': activeTab == index, 'has-text-primary': activeTab != index }"
                    >
                      <p
                        class="has-fullwidth"
                      >
                        <i
                          class="mdil"
                          :class="tab.icon"
                        />
                      </p>
                    </div>
                    <p
                      v-if="tab.title"
                      class="tab-title is-size-5 has-text-primary"
                    >
                      {{ tab.title }}
                    </p>
                  </div>
                </template>

                <!-- Tab content -->
                <div class="container has-text-left is-flex has-vcentered">
                  <div>
                    <img
                      :src="tab.image"
                      :alt="tab.image_alt_text"
                    >
                  </div>
                  <div class="tab-description">
                    <div class="card">
                      <div class="card-content">
                        <div class="content">
                          <h2 class="subtitle has-text-primary">
                            {{ tab.title }}
                          </h2>
                        </div>
                        <div class="columns">
                          <div class="column is-narrow">
                            <b-icon
                              icon="mdil-check"
                              custom-size="mdil-36px"
                              type="is-primary"
                            />
                          </div>
                          <div class="column">
                            <p>{{ tab.description }}</p>
                          </div>
                        </div>
                        <div>
                          <b-button
                            tag="router-link"
                            :to="tab.action_link"
                            size="is-medium"
                            class="is-capitalized"
                            type="is-primary"
                            expanded
                          >
                            {{ tab.action_text }}
                          </b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 0,
      tabs: [
        {
          icon: "mdil-bell",
          title: "Stay in the Loop",
          description: "Registered members can access other teams' and data (when available) on the targets you have followed.",
          image: "https://bulma.io/images/placeholders/640x360.png",
          image_alt_text: "Placeholder image",
          action_text: "Register activity",
          action_link: "#"
        },
        {
          icon: "mdil-vector-union",
          title: "Foster Collaboration",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula quam ipsum, ut iaculis mi molestie elementum.",
          image: "https://bulma.io/images/placeholders/640x360.png",
          action_text: "Register activity",
          action_link: "#"
        },
        {
          icon: "mdil-shuffle",
          title: "Resolve Conflict",
          description: "Morbi ut rhoncus augue. Sed nec dui a enim feugiat lacinia id et turpis. Mauris faucibus semper molestie.",
          image: "https://bulma.io/images/placeholders/640x360.png",
          action_text: "Register activity",
          action_link: "#"
        },
        {
          icon: "mdil-currency-usd",
          title: "Seek Funding",
          description: "In lobortis laoreet magna et sodales. Cras mi tellus, egestas ut pretium commodo,",
          image: "https://bulma.io/images/placeholders/640x360.png",
          action_text: "Register activity",
          action_link: "#"
        }
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/variables.sass"

.tip
  margin: 1rem 0
.tip span
  margin-left: 0.5rem
.step-line
  position: relative
  top: 2.5rem
  left: 15%
  width: 70%
  border: 0.5px solid $primary
  z-index: -1
.step-number
  height: 5rem
  width: 5rem
  font-size: 40px
  font-weight: lighter
  border-radius: 50%
  border: 1px solid $primary
.tab-title
  padding: 1rem
.tab-description
  width: 50%
  position: absolute
  right: 0px
</style>