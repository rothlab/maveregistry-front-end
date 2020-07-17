<template>
  <section>
    <!-- Section indicator -->
    <scrollactive
      class="section-indicator"
      active-class="is-active"
      highlight-first-item
      :modify-url="false"
      :offset="400"
      :scroll-offset="84"
    >
      <a
        href="#main"
        class="scrollactive-item"
      />
      <a
        href="#landing-1"
        class="scrollactive-item"
      />
      <a
        href="#landing-2"
        class="scrollactive-item"
      />
    </scrollactive>
    <!-- Landing section-->
    <section
      id="main"
      class="hero is-primary is-bold full-height"
    >
      <div class="hero-body landing">
        <div class="container is-fluid">
          <div class="columns is-vcentered">
            <div
              class="column is-7"
              style="z-index: 1"
            >
              <div class="landing-left">
                <!-- Intro -->
                <div
                  class="delay-500ms"
                  v-animate="'fadeIn'"
                >
                  <h2 class="subtitle is-size-4">
                    Amazing MAVE projects
                  </h2>
                  <h1 class="title is-uppercase is-size-2">
                    Registered Here
                  </h1>
                  <p class="is-size-5">
                    MAVE Registry is a database for activities on studying targets with Multiplexed Assays of Variant Effect (MAVE).
                  </p>
                </div>

                <!-- Action buttons -->
                <div class="landing-action-buttons">
                  <div class="level">
                    <div class="level-left">
                      <b-button
                        size="is-medium"
                        type="is-warning"
                        tag="router-link"
                        to="/projects"
                        class="med-shadow delay-1s"
                        v-animate="'fadeIn'"
                      >
                        Register Project
                      </b-button>
                    </div>
                    <div class="level-right">
                      <b-button
                        size="is-medium"
                        tag="router-link"
                        to="/nominations"
                        class="med-shadow delay-1500ms"
                        v-animate="'fadeIn'"
                      >
                        Nominate Targets
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-10 is-hidden-mobile">
              <div class="demo-display" />
            </div>
          </div>
        </div>
      </div>
      <div class="hero-footer">
        <!-- Tip to the next section -->
        <div class="tip has-text-centered">
          <p
            class="is-inline-flex has-vcentered delay-2s"
            v-animate.repeat="'fadeIn'"
          >
            <b-icon
              custom-size="mdil-24px"
              class="dalay-2s updown"
              icon="mdil-chevron-double-down"
            />
            <span>How does it work?</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Onboarding section 1 -->
    <section 
      id="landing-1" 
      class="hero is-medium"
    >
      <div class="hero-body">
        <!-- Question -->
        <div class="container has-text-centered">
          <p class="section-header is-uppercase">
            How does it work?
          </p>

          <div>
            <!-- Steps -->
            <div
              class="step-line is-hidden-mobile delay-1s"
              v-animate="'showInX'"
            />
            <div class="columns">
              <div
                class="column step-content"
                v-animate="'flipInX'"
              >
                <div class="step-number is-inline-flex has-vcentered has-text-centered is-primary is-bold large-shadow">
                  <p class="has-fullwidth has-text-light">
                    1
                  </p>
                </div>
                <h2 class="subtitle is-capitalized has-text-primary">
                  Browse project
                </h2>
                <p>See which targets have been registered with activities.</p>
              </div>
              <div
                class="column step-content delay-500ms"
                v-animate="'flipInX'"
              >
                <div class="step-number is-inline-flex has-vcentered has-text-centered is-primary is-bold large-shadow">
                  <p class="has-fullwidth has-text-light">
                    2
                  </p>
                </div>
                <h2 class="subtitle is-capitalized has-text-primary">
                  Register activity
                </h2>
                <p>Reguster activity on a target and see who is working on the same target.</p>
              </div>
              <div
                class="column step-content delay-1s"
                v-animate="'flipInX'"
              >
                <div class="step-number is-inline-flex has-vcentered has-text-centered is-primary is-bold large-shadow">
                  <p class="has-fullwidth has-text-light">
                    3
                  </p>
                </div>
                <h2 class="subtitle is-capitalized has-text-primary">
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
          <p 
            class="is-inline-flex has-vcentered delay-2s"
            v-animate.repeat="'fadeIn'"
          >
            <b-icon
              class="updown"
              custom-size="mdil-24px"
              icon="mdil-chevron-double-down"
            />
            <span>Why register?</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Onboarding section 2 -->
    <section
      id="landing-2"
      class="hero is-medium is-light"
    >
      <div class="hero-body">
        <div class="container has-text-centered">
          <p class="section-header is-uppercase">
            Why register?
          </p>

          <div>
            <b-tabs
              v-model="activeTab"
              size="is-small"
              position="is-centered"
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
                      :class="{ 'is-primary is-bold has-text-white large-shadow': activeTab == index, 'has-text-primary': activeTab != index }"
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
                      class="tab-title is-size-5 has-text-primary is-hidden-touch"
                    >
                      {{ tab.title }}
                    </p>
                  </div>
                </template>

                <!-- Tab content -->
                <div class="container has-text-left is-flex has-vcentered">
                  <div class="is-hidden-mobile">
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
                          <div class="column is-narrow is-hidden-mobile">
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
          action_link: "/projects"
        },
        {
          icon: "mdil-vector-union",
          title: "Foster Collaboration",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula quam ipsum, ut iaculis mi molestie elementum.",
          image: "https://bulma.io/images/placeholders/640x360.png",
          action_text: "Register activity",
          action_link: "/projects"
        },
        {
          icon: "mdil-shuffle",
          title: "Resolve Conflict",
          description: "Morbi ut rhoncus augue. Sed nec dui a enim feugiat lacinia id et turpis. Mauris faucibus semper molestie.",
          image: "https://bulma.io/images/placeholders/640x360.png",
          action_text: "Register activity",
          action_link: "/projects"
        },
        {
          icon: "mdil-currency-usd",
          title: "Seek Funding",
          description: "In lobortis laoreet magna et sodales. Cras mi tellus, egestas ut pretium commodo,",
          image: "https://bulma.io/images/placeholders/640x360.png",
          action_text: "Register activity",
          action_link: "/projects"
        }
      ]
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768
    }
  }
}
</script>


<style lang="sass">
.tabs
  overflow: visible
</style>

<style lang="sass" scoped>
@import "../assets/style/variables.sass"

// Animation
.animate
  animation-duration: 1s
  animation-fill-mode: both
.delay-500ms
  animation-delay: 500ms
.delay-1s
  animation-delay: 1s
.delay-1500ms
  animation-delay: 1500ms
.delay-2s
  animation-delay: 2s

@keyframes flipInX
  0%
    transform: perspective(400px) rotateX(90deg)
    opacity: 0
  40%
    transform: perspective(400px) rotateX(-10deg)
  70%
    transform: perspective(400px) rotateX(10deg)
  100%
    transform: perspective(400px) rotateX(0deg)
    opacity: 1
.flipInX.animate-active
  animation-name: flipInX

@keyframes showInX
  0%
    width: 0%
  100%
    width: 70%
.showInX.animate-active
  animation-name: showInX

@keyframes upDown
  0% 
    transform: translateY(0%)
  33%
    transform: translateY(30%)
  66%
    transform: translateY(-30%)
  100%
    transform: translateY(0%)
.updown
  animation: upDown 1s ease-in-out infinite

@keyframes fadeIn
  0%
    opacity: 0
    transform: translate3d(0, -20%, 0)
  100%
    opacity: 1
    transform: translate3d(0, 0, 0)
.fadeIn.animate-active
  animation-name: fadeIn

.section-indicator
  position: fixed
  top: 50vh
  right: 1rem
  z-index: 50
  a
    display: block
    height: 0.5rem
    width: 0.5rem
    background-color: transparent
    border: 1px solid $grey-light
    border-radius: 0.5rem
    transition: ease-in-out 200ms
    &:hover
      background-color: $grey-light
    &:not(:first-child)
      margin-top: 0.5rem
    &.is-active
      background-color: $warning
@media screen and (min-width: $break-desktop)
  .full-height
    height: calc( 100vh - 5rem )
  .landing
    padding-right: 0
    margin-right: 0
  .landing-left
    position: relative
    left: 25%
    max-width: 35rem
@media screen and (max-width: $break-desktop)
  .full-height
    height: calc( 100vh - 10rem )
@media screen and (max-width: $break-mobile)
  .landing
    text-align: center
    display: flex
    align-items: center
  .landing-left
    display: inline-block
    max-width: 80vw
.landing-action-buttons
  margin-top: 2rem
  .button
    padding: 0rem 1.5rem
    @media screen and (max-width: $break-mobile)
      width: 80%
.demo-display
  position: relative
  right: 22rem
  min-height: 20rem
  height: 70vh
  background-image: url("../assets/image/background.png")
  background-size: cover
  overflow-x: show
  @media screen and (max-width: $break-desktop)
    right: 15rem
.tip
  margin: 1rem 0
.tip span
  margin-left: 0.5rem
.step-line
  position: relative
  top: 2.5rem
  @media screen and (max-width: $break-desktop)
    top: 1.6rem
  left: 15%
  width: 70%
  height: 1px
  background: $primary
  z-index: -1
.step-number
  height: 5rem
  width: 5rem
  font-size: 40px
  @media screen and (max-width: $break-desktop)
    height: 3rem
    width: 3rem
    font-size: 30px
  font-weight: lighter
  border-radius: 50%
  border: 1px solid $primary
  margin-bottom: 0.5rem
.step-content
  opacity: 0
  h2
    @media screen and (min-width: $break-mobile)
      padding: 1rem
    @media screen and (max-width: $break-mobile)
      padding: 0.25rem
  p
    &:not(.has-fullwidth)
      padding: 0 2rem
.tab-title
  padding: 1rem
@media screen and (min-width: $break-mobile)
  .tab-description
    width: 50%
    position: absolute
    right: 0px
.section-header
  @media screen and (max-width: $break-mobile)
    font-size: 1.5rem
    padding-bottom: 2rem
  @media screen and (min-width: $break-mobile)
    font-size: 2.5rem
    padding-bottom: 3rem
.is-transparent
  animation-direction: reverse
</style>