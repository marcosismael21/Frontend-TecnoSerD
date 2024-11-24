<template>
  <v-dialog v-model="dialogVisible" persistent max-width="400">
    <v-card>
      <v-card-title class="headline text-center">
        <v-icon large color="error" class="mr-2">
          mdi-alert-circle
        </v-icon>
        Sesión Expirada
      </v-card-title>

      <v-card-text class="text-center pt-4">
        Su sesión ha expirado por inactividad.
        <br>
        Por favor, inicie sesión nuevamente para continuar.
      </v-card-text>

      <v-card-actions class="justify-center pb-4">
        <v-btn color="primary" @click="handleExpiredSession" min-width="120">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Cookies from 'js-cookie';

export default {
  name: 'SessionExpiredDialog',
  computed: {
    ...mapState('sessionDialog', ['isVisible']),
    dialogVisible: {
      get() {
        return this.isVisible;
      },
      set(value) {
        if (!value) {
          this.$store.commit('sessionDialog/hideDialog');
        }
      }
    }
  },
  methods: {
    handleExpiredSession() {
      // Limpiar cookies
      Cookies.remove('token');
      Cookies.remove('rol');
      Cookies.remove('id');
      Cookies.remove('theme');

      // Cerrar diálogo
      this.$store.commit('sessionDialog/hideDialog');

      // Redirigir al login
      this.$router.push('login2');
    }
  }
}
</script>
