<template>
  <v-card v-if="!isLoading && proveedor">
    <v-card-title>
      <span class="headline">Actualizar Proveedor</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="proveedor.nombre" label="Nombre del Proveedor" placeholder="Ej. ABA"
              :rules="[rules.required]" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="proveedor.estado" :items="estadoOptions" item-text="text" item-value="value"
              label="Estado" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarProveedor">Guardar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !proveedor" type="error">No se pudo cargar la información del proveedor.</v-alert>
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
      proveedor: null,
      isLoading: true, // Nuevo estado para controlar la carga
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false }
      ],
      rules: {
        required: value => !!value || 'Requerido.'
      }
    };
  },
  async mounted() {
    try {
      await this.fetchProveedor();
    } catch (error) {
      console.error('Error fetching proveedor:', error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchProveedor() {
      try {
        const { data } = await this.$axios.get(`/proveedor/${this.id}`);
        this.proveedor = data;
      } catch (error) {
        console.error('Error fetching proveedor by ID:', error);
        this.proveedor = null;
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    actualizarProveedor() {
      if (this.$refs.form.validate()) {
        this.$axios.put(`/proveedor/${this.proveedor.id}`, this.proveedor)
          .then(response => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando al proveedor';
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
        this.fetchProveedor().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
