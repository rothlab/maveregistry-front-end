<template>
  <b-navbar
    :fixed-top="true"
    :spaced="true"
    :shadow="true"
  >
    <!-- Logo -->
    <template slot="brand">
      <b-navbar-item href="#">
        MAVE Registry
      </b-navbar-item>
    </template>

    <!-- Left side: main functions -->
    <template slot="start">
      <b-navbar-item href="#">
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
</template>