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
                <p>Register activity on a target and see who is working on the same target.</p>
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
      class="hero is-medium has-background-white-bis"
    >
      <div class="hero-body">
        <div class="container has-text-centered">
          <p class="section-header is-uppercase">
            Why register?
          </p>
          
          <div class="columns">
            <div class="column is-4">
              <div class="tile is-ancestor">
                <div class="tile is-parent is-vertical">
                  <!-- First half of the tabs -->
                  <div
                    class="tile is-child panel selection"
                    :class="{ 'is-active' : activeTab === id }"
                    v-for="(tab, id) in tabs.slice(0, Math.ceil(tabs.length / 2))"
                    :key="id"
                    @click="activeTab = id"
                  >
                    <div class="content">
                      <b-icon
                        :icon="tab.icon"
                        custom-size="mdil-64px"
                      />
                      <p class="is-size-5">
                        {{ tab.title }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="tile is-parent is-vertical">
                  <!-- Second half of the tabs -->
                  <div
                    class="tile is-child panel selection"
                    :class="{ 'is-active' : activeTab === id + Math.ceil(tabs.length / 2)}"
                    v-for="(tab, id) in tabs.slice(Math.ceil(tabs.length / 2), tabs.length)"
                    :key="id + Math.ceil(tabs.length / 2)"
                    @click="activeTab = id + Math.ceil(tabs.length / 2)"
                  >
                    <div class="content">
                      <b-icon
                        :icon="tab.icon"
                        custom-size="mdil-64px"
                      />
                      <p class="is-size-5 sel-title">
                        {{ tab.title }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-offset-1">
              <b-carousel
                v-model="activeTab"
                :indicator="false"
                :autoplay="false"
                :arrow="false"
              >
                <b-carousel-item
                  v-for="(tab, id) in tabs"
                  :key="id"
                >
                  <div class="content has-text-left">
                    <lottie
                      class="animation"
                      :options="{ animationData: tab.animation }"
                      :height="500"
                      :width="500"
                    />
                    <div class="description">
                      <p class="is-size-5">
                        <span class="is-size-3">{{ tab.title }}</span><br>
                        <span>{{ tab.description }}</span>
                      </p>
                    </div>
                  </div>
                </b-carousel-item>
              </b-carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import Lottie from "vue-lottie"

export default {
  components: {
    Lottie
  },
  data () {
    return {
      activeTab: 0,
      tabs: [
        {
          icon: "mdil-bell",
          title: "Stay in the Loop",
          description: "Receive notifications for updates of projects and teams that you follow.",
          animation: require("@/assets/animation/stay-in-the-loop.json"),
          animation_alt_text: "Stay in the loop",
        },
        {
          icon: "mdil-vector-union",
          title: "Foster Collaborations",
          description: "Find teams with common interest and start a collaboration.",
          animation: require("@/assets/animation/foster-collabs.json"),
        },
        {
          icon: "mdil-shuffle",
          title: "Resolve Conflicts",
          description: "Identify and resolve potential project conflicts.",
          animation: require("@/assets/animation/resolve-conflicts.json"),
        },
        {
          icon: "mdil-currency-usd",
          title: "Seek Funding",
          description: "Make your projects visible to potential funders.",
          animation: require("@/assets/animation/seek-funding.json"),
        }
      ]
    }
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768
    }
  },
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
}
</script>


<style lang="sass">
.tabs
  overflow: visible
.carousel-items
  height: 100%
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
.section-header
  @media screen and (max-width: $break-mobile)
    font-size: 1.5rem
    padding-bottom: 2rem
  @media screen and (min-width: $break-mobile)
    font-size: 2.5rem
    padding-bottom: 3rem
.panel
  background-color: $white
  border-radius: 6px
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.15)
  color: $primary
  transition: all ease-in-out 200ms
  &.selection
    display: flex
    align-items: center
    justify-content: center
    padding: 1rem
    cursor: pointer
    &:hover, &.is-active
      background-image: linear-gradient(141deg, #280444 0%, #540d6e 71%, #7c0c89 100%)
      box-shadow: 0 1rem 3rem rgba(0,0,0,.175)
      color: $white
    .icon
      height: unset
      width: unset
.carousel
  height: 100%
  .content
    height: 100%
    background-position: center
    border-radius: 6px
  .animation
    margin: 0
    right: 0
    top: 0
    position: relative
  .description
    padding: 0 3rem
    color: $dark
    position: relative
    bottom: 3rem
</style>