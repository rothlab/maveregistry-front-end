<template>
  <div class="content">
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
  </div>
</template>

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
  background-color: white
</style>