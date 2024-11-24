<template>
  <v-card v-if="!isLoading && equipo">
    <v-card-title>
      <span class="headline">Editar Equipo</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="equipo.nombre" label="Nombre del Equipo" placeholder="Ej. D2Mini"
              :rules="[rules.required, rules.text]" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="equipo.idProveedor" :items="proveedores" item-text="nombre" item-value="id"
              label="Proveedor" :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="equipo.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado"
              :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="updateEquipo">Guardar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !equipo" type="error">No se pudo cargar la información del equipo.</v-alert>
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
      equipo: null,
      isLoading: true, // Nuevo estado para controlar la carga
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
    try {
      await Promise.all([this.fetchEquipo(), this.fetchProveedores()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchEquipo() {
      try {
        const { data } = await this.$axios.get(`/tipoequipo/${this.id}`);
        this.equipo = data;
      } catch (error) {
        console.error('Error fetching equipo by ID:', error);
        this.equipo = null;
      }
    },
    async fetchProveedores() {
      try {
        const { data } = await this.$axios.get('/proveedor');
        this.proveedores = data;
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    updateEquipo() {
      if (this.$refs.form.validate()) {
        this.$axios.put(`/tipoequipo/${this.equipo.id}`, this.equipo)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch(error => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando la regalia';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    }
  },
  watch: {
    id(newId) {
      if (newId) {
        this.isLoading = true;
        this.fetchEquipo().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
