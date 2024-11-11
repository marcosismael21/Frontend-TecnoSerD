<template>
  <v-app :class="appBackgroundClass">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app :color="drawerColor">
      <!-- botones del nav-->
      <v-list>
        <v-list-item v-for="(item, i) in permittedItems" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Botón desplegable de Parámetros -->
        <template v-if="userRole !== 2 && userRole !== 3"> <!-- Oculta para técnico y gestor logístico -->
  <v-list-group prepend-icon="mdi-cog" no-action>
    <template v-slot:activator>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Parámetros</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- Botones anidados en Parámetros -->
    <v-list-item v-for="(submenu, i) in permittedParametrosItems" :key="i" :to="submenu.to" router exact>
      <v-list-item-action>
        <v-icon>{{ submenu.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ submenu.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
  </template>
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
    <v-app-bar :clipped-left="clipped" fixed app :color="isDark ? 'primary' : 'secondary'">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant" :color="buttonColor">
        <v-icon>{{ `mdi-chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
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
import Cookies from 'js-cookie';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      userRole: parseInt(Cookies.get('rol')), // Ahora obtiene el rol de la cookie 'rol'
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
        { icon: 'mdi-chart-bar', title: 'Métricas', to: 'tablero', roles: [1]},
        { icon: 'mdi-clipboard-outline', title: 'Asignaciones', to: 'asignacion', roles: [1,3] },
        { icon: 'mdi-clipboard-outline', title: 'Pendientes', to: 'tecnico', roles: [2] }, // Solo Técnico
        { icon: 'mdi-store', title: 'Comercio', to: 'comercio', roles: [1,3] },
        { icon: 'mdi-package', title: 'Equipos', to: 'equipos', roles: [1,3]},
        { icon: 'mdi-archive', title: 'Comodin', to: 'comodin', roles: [1,3] },
        { icon: 'mdi-account-multiple', title: 'Colaboradores', to: 'usuarios', roles: [1] },
      ],
      parametrosItems: [
        { icon: 'mdi-city', title: 'Ciudades', to: 'ciudad', roles: [1] },
        { icon: 'mdi-satellite-uplink', title: 'Canal', to: 'canal', roles: [1] },
        { icon: 'mdi-truck', title: 'Proveedor', to: 'proveedores', roles: [1] },
        { icon: 'mdi-crown', title: 'Regalía', to: 'regalia', roles: [1] },
      ],
    };
  },
  computed: {
    // Filtra los módulos según el rol del usuario
    permittedItems() {
      return this.items.filter(this.canAccessModule);
      //return this.items.filter((item) => this.canAccessModule(item.title));
    },
    permittedParametrosItems() {
      return this.parametrosItems.filter(this.canAccessModule);
      //return this.parametrosItems.filter((item) => this.canAccessModule(item.title));
    },
    drawerColor() {
      return this.isDark ? 'grey darken-4' : 'indigo lighten-4';
    },
    appBackgroundClass() {
      return this.isDark ? 'dark-background' : 'light-background';
    },
    buttonColor() {
      return this.isDark ? 'white' : 'black';
    },
  },
  methods: {
    // Filtra los permisos de acuerdo al rol del usuario
    canAccessModule(item) {
      /*const permissions = {
        1: ['metricas', 'asignacion', 'comercio', 'equipos', 'comodin', 'colaboradores'],
        2: ['tecnico'],
        3: ['asignacion', 'comercio', 'equipos', 'comodin'],
      };
      return permissions[this.userRole]?.includes(moduleTitle);*/
      return item.roles.includes(this.userRole);
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.$vuetify.theme.dark = this.isDark;
      Cookies.set('theme', this.isDark ? 'dark' : 'light');
    },
    openLogoutDialog() {
      this.logoutDialog = true;
    },
    closeLogoutDialog() {
      this.logoutDialog = false;
    },
    async logout() {
      try {
        const response = await this.$axios.post('/usuario/logout', {}, { withCredentials: true });
        if (response.data.ok) {
          this.$router.push('/');
        } else {
          console.error('Error al cerrar sesión:', response.data.mensage);
        }
      } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
      } finally {
        this.closeLogoutDialog();
      }
    },
  },
  mounted() {
    const savedTheme = Cookies.get('theme');
    if (savedTheme) {
      this.$vuetify.theme.dark = savedTheme === 'dark';
      this.isDark = savedTheme === 'dark';
    }
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

