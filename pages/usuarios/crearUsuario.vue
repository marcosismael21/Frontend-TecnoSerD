<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nuevo Usuario</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="nuevoUsuario.nombres" label="Nombres" placeholder="Ej. Jose Roberto Mejia"
              :rules="[rules.required, rules.text]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="nuevoUsuario.usuario" label="Nombre de usuario" placeholder="Ej. jorome"
              :rules="[rules.required]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="nuevoUsuario.pass" :append-icon="verContra ? 'mdi-eye' : 'mdi-eye-off'"
              :type="verContra ? 'text' : 'password'" label="Contraseña" :rules="[rules.required, rules.min]"
              @click:append="verContra = !verContra" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="nuevoUsuario.idrol" :items="roles" item-text="nombre" item-value="id" label="Roles"
              :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="nuevoUsuario.estado" :items="estadoOptions" item-text="text" item-value="value"
              label="Estado" :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="saveUsuario">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      verContra: false,
      valid: false,
      nuevoUsuario: {
        nombres: '',
        usuario: '',
        pass: '',
        idrol: '',
        estado: ''
      },
      roles: [],
      estadoOptions: [
        { text: 'Habilitado', value: true },
        { text: 'Deshabilitado', value: false },
      ],
      rules: {
        required: value => !!value || 'Requerido.',
        min: v => v.length >= 8 || 'Min 8 caracteres',
        text: value => /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value) || 'Solo letras, números y espacios.',
        estadoRequired: value => value !== null || 'Requerido.'
      }
    }
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    resetForm() {
      this.nuevoUsuario = {
        nombres: '',
        usuario: '',
        pass: '',
        idrol: '',
        estado: ''
      }
      this.$refs.form.resetValidation();
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
      this.resetForm();
      this.$emit('close');
    },
    saveUsuario() {
      if (this.$refs.form.validate()) {
        this.$axios.post('/usuario', this.nuevoUsuario)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch(error => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el colaborador';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    }
  }
};
</script>
