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
        <!-- Botón de salir -->
        <v-list-item @click="openLogoutDialog">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- v-dialog de cierre de sesión -->
    <v-dialog v-model="logoutDialog" max-width="350">
      <v-card>
        <v-card-title class="headline">Confirmar cierre de sesión</v-card-title>
        <v-card-text>¿Estás seguro de que deseas cerrar sesión?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeLogoutDialog">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="logout">Cerrar sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <!-- Botones de cambio de tema -->
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
import Cookies from 'js-cookie';
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
      title: 'Vuetify.js',
      logoutDialog: false, // Controla la visibilidad del diálogo de logout
      items: [
        {
          icon: 'mdi-home',
          title: 'Tablero',
          to: '/',
        },
        {
          icon: 'mdi-store',
          title: 'Comercio',
          to: 'comercio',
        },
        {
          icon: 'mdi-package',
          title: 'Registro de Equipos',
          to: 'equipos',
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Colaboradores',
          to: 'usuarios',
        },
      ],
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.$vuetify.theme.dark = this.isDark;
    },
    // Método para abrir el diálogo de cierre de sesión
    openLogoutDialog() {
      this.logoutDialog = true;
    },
    // Método para cerrar el diálogo sin hacer logout
    closeLogoutDialog() {
      this.logoutDialog = false;
    },
    // Método para realizar el logout
    async logout() {
      try {
        const response = await this.$axios.post('/usuario/logout', {}, { withCredentials: true });
        if (response.data.ok) {
          // Elimina la cookie de token si la tienes configurada manualmente
          Cookies.remove('token');
          // Redirigir al login
          this.$router.push('/');
        } else {
          console.error('Error al cerrar sesión:', response.data.mensage);
        }
      } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
      } finally {
        this.closeLogoutDialog(); // Cierra el diálogo después del intento de logout
      }
    },
  },
}
</script>