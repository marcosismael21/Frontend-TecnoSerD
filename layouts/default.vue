<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
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
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <!-- Botones de cambio de tema -->
      <v-spacer />
      <v-btn @click="toggleTheme":color="isDark ? 'white' : 'black'" icon>
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      isDark:this.$vuetify.theme.dark,
      clipped: true,
      drawer: true,
      fixed: true,
      items: [ 
    {
        icon: 'mdi-home',
        title: 'Welcome',
        to: '/',
    },
    {
        icon: 'mdi-lightbulb',
        title: 'Inspire',
        to: '/inspire',
    },
    {
        icon: 'mdi-account-multiple',
        title: 'Usuarios',
        to: 'usuarios',
    },
    {
        icon: 'mdi-map-marker',
        title: 'Ciudades',
        to: 'ciudad',
    },
    {
        icon: 'mdi-truck',
        title: 'Proveedores',
        to: 'proveedores',
    },  
    {
        icon: 'mdi-laptop',
        title: 'Tipos de Equipo',
        to: 'tipoEquipo',
    }, 
    /*{
        icon: 'mdi-clipboard-check',
        title: 'Asignación de Equipo',
        to: 'asignacion-equipo',
    },
    {
        icon: 'mdi-wrench',
        title: 'Asignación de Técnico',
        to: 'asignacion-tecnico',
    },
    {
        icon: 'mdi-store',
        title: 'Comercio',
        to: 'comercio',
    }, 
    {
        icon: 'mdi-billboard',
        title: 'Publicidad',
        to: 'publicidad',
    },
    {
        icon: 'mdi-crown',
        title: 'Regalías',
        to: 'regalias',
    },
    {
        icon: 'mdi-wrench-outline',
        title: 'Servicios',
        to: 'servicios',
    },
    {
        icon: 'mdi-cast',
        title: 'Canal',
        to: 'canal',
    },*/
],
miniVariant: false,
right: true,
rightDrawer: false,
title: 'Vuetify.js',   
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.$vuetify.theme.dark = this.isDark;
    }
  },
}
</script>