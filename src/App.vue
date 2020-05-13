<template>
  <div id="app">
    <b-navbar
      :fixed-top="true"
      :spaced="true"
      :shadow="true"
    >
      <!-- Logo -->
      <template slot="brand">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/' }"
        >
          MAVE Registry
        </b-navbar-item>
      </template>

      <!-- Left side: main functions -->
      <template slot="start">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/projects' }"
        >
          MAVE Projects
        </b-navbar-item>
        <b-navbar-item href="#">
          Team Progress
        </b-navbar-item>
        <b-navbar-item href="#">
          Nomination
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
          <b-navbar-item href="#">
            About
          </b-navbar-item>
          <b-navbar-item href="#">
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <!-- Right side: user functions -->
      <template slot="end">
        <b-navbar-item tag="div">
          <b-button>Log in</b-button>
        </b-navbar-item>
      </template>
    </b-navbar>

    <!-- Component injection -->
    <router-view />

    <footer class="footer has-background-dark has-text-light">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <p>Copyright © 2020 MAVE Registry. All rights reserved.</p>
          </div>
          <div class="level-right">
            <p>About | Contact Us | Terms | Privacy</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="sass" scoped>
.footer
  padding: 3rem 1.5rem
</style>