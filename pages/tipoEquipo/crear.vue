<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nuevo Tipo de Equipo</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="nuevoTipoEquipo.nombre" label="Nombre del Tipo de Equipo" placeholder="Ej. D2Mini"
              :rules="[rules.required, rules.text]" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="nuevoTipoEquipo.idProveedor" :items="proveedores" item-text="nombre" item-value="id"
              label="Proveedor" :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="nuevoTipoEquipo.estado" :items="estadoOptions" item-text="text" item-value="value"
              label="Estado" :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="saveTipoEquipo">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      nuevoTipoEquipo: {
        nombre: '',
        idProveedor: '',
        estado: ''
      },
      proveedores: [],
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false }
      ],
      rules: {
        required: value => !!value || 'Requerido.',
        estadoRequired: value => value !== null || 'Requerido.',
        text: value => /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value) || 'Solo letras, números y espacios.',
      }
    }
  },
  async mounted() {
    await this.fetchProveedores();
  },
  methods: {
    resetForm() {
      this.nuevoTipoEquipo = {
        nombre: '',
        idProveedor: '',
        estado: ''
      }
      this.$refs.form.resetValidation();
    },
    closeDialog() {
      this.resetForm();
      this.$emit('close');
    },
    saveTipoEquipo() {
      if (this.$refs.form.validate()) {
        this.$axios.post('/tipoequipo', this.nuevoTipoEquipo)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch(error => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando la regalia';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    },
    async fetchProveedores() {
      try {
        const { data } = await this.$axios.get('/proveedor');
        this.proveedores = data;
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    }
  }
};
</script>
