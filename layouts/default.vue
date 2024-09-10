<template>
  <v-app :class="appBackgroundClass">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      :color="drawerColor"
    >
      <!-- botones del nav-->
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app :color="isDark ? 'primary' : 'secondary'">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn @click="toggleTheme" :color="isDark ? 'white' : 'black'" icon>
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app :color="isDark ? 'primary' : 'secondary'">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      isDark: this.$vuetify.theme.dark,
      clipped: true,
      drawer: true,
      fixed: true,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Usuarios',
          to: 'usuarios',
        },
        {
          icon: 'mdi-store',
          title: 'Comercios',
          to: 'comercio',
        },
      ],
    };
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.$vuetify.theme.dark = savedTheme === 'dark';
      this.isDark = savedTheme === 'dark';
    }
  },
  computed: {
    // Cambio de color del aside segun tema
    drawerColor() {
      return this.isDark ? 'grey darken-4' : 'indigo lighten-4';
    },
    // Cambio de color del background segun tema
    appBackgroundClass() {
      return this.isDark ? 'dark-background' : 'light-background';
    },
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },
  },
};
</script>

<style scoped>
.dark-background {
  background-color: #121212;
  color: #ffffff;
}

.light-background {
  background-color: #EEEEEE;
  color: #000000;
}
</style>

