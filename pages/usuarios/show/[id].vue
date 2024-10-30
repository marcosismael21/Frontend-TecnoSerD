<template>
  <v-card v-if="!isLoading && usuario">
    <v-card-title>
      <span class="headline">Detalles del Usuario</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="usuario.nombres" label="Nombres" readonly></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="usuario.usuario" label="Nombre de usuario" readonly></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="usuario.pass" :append-icon="verContra ? 'mdi-eye' : 'mdi-eye-off'"
              :type="verContra ? 'text' : 'password'" label="Contraseña" @click:append="verContra = !verContra"
              readonly></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="usuario.idrol" :items="roles" item-text="nombre" item-value="id" label="Roles"
              readonly></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="usuario.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado"
              readonly></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !usuario" type="error">No se pudo cargar la información del usuario.</v-alert>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      usuario: null,
      isLoading: true, // Nuevo estado para controlar la carga
      verContra: false,
      roles: [],
      estadoOptions: [
        { text: 'Habilitado', value: true },
        { text: 'Deshabilitado', value: false },
      ],
    };
  },
  async mounted() {
    try {
      await Promise.all([this.fetchUsuario(), this.fetchRoles()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchUsuario() {
      try {
        const { data } = await this.$axios.get(`/usuario/${this.id}`);
        this.usuario = data;
      } catch (error) {
        console.error('Error fetching usuario by ID:', error);
        this.usuario = null;
      }
    },
    fetchRoles() {
      this.$axios.get('/rol')
        .then(response => {
          this.roles = response.data;
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    },
    closeDialog() {
      this.$emit('close');
    },
  },
  watch: {
    id(newId) {
      if (newId) {
        this.isLoading = true;
        this.fetchUsuario().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
