<template>
  <v-card v-if="!isLoading && usuario">
    <v-card-title>
      <span class="headline">Actualizar Datos del Colaborador</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="usuario.nombres" label="Nombres" placeholder="Ej. Jose Roberto Mejia"
              :rules="[rules.required]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="usuario.usuario" label="Nombre de usuario" placeholder="Ej. jorome"
              :rules="[rules.required]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="usuario.pass" :append-icon="verContra ? 'mdi-eye' : 'mdi-eye-off'"
              :type="verContra ? 'text' : 'password'" label="Contraseña" :rules="[rules.required, rules.min]"
              @click:append="verContra = !verContra" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="usuario.idrol" :items="roles" item-text="nombre" item-value="id" label="Roles"
              required></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="usuario.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado"
              required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarUsuario">Guardar</v-btn>
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
      valid: false,
      estadoOptions: [
        { text: 'Habilitado', value: true },
        { text: 'Deshabilitado', value: false },
      ],
      rules: {
        required: value => !!value || 'Requerido.',
      }
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
    actualizarUsuario() {
      if (this.$refs.form.validate()) {
        this.$axios.put(`/usuario/${this.usuario.id}`, this.usuario)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando el colaborador';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
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
