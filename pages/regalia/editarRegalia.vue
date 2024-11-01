<template>
  <v-card v-if="!isLoading && regalia">
    <v-card-title>
      <span class="headline">Actualizar Regalia</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="regalia.nombre" label="Nombre" placeholder="Ej. Sombrilla" :rules="[rules.required]"
              required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="regalia.idTipoComercio" :items="tipoComercio" item-text="nombre" item-value="id"
              label="Tipo Comercio" :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="regalia.cantidad" label="Cantidad" placeholder="Ej. 1"
              :rules="[rules.required, rules.numeric]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="regalia.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado"
              :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarRegalia">Guardar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !regalia" type="error">No se pudo cargar la información del regalia.</v-alert>
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
      regalia: null,
      isLoading: true, // Nuevo estado para controlar la carga
      tipoComercio: [],
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      rules: {
        required: value => !!value || 'Requerido.',
        numeric: (value) => /^[0-9]+$/.test(value) || "Solo números permitidos.",
        estadoRequired: value => value !== null || 'Requerido.'
      }
    };
  },
  async mounted() {
    try {
      await Promise.all([this.fetchRegalia(), this.fetchTipoComercio()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchRegalia() {
      try {
        const { data } = await this.$axios.get(`/pubreg/${this.id}`)
        this.regalia = data;
      } catch (error) {
        console.error('Error fetching tipoComercio by ID:', error)
        this.regalia = null;
      }
    },
    fetchTipoComercio() {
      this.$axios.get('/tipcom')
        .then(response => {
          this.tipoComercio = response.data;
        })
        .catch(error => {
          console.error('Error fetching tipoComercio:', error)
        });
    },
    closeDialog() {
      this.$emit('close');
    },
    actualizarRegalia() {
      if (this.$refs.form.validate()) {
        this.$axios.put(`/pubreg/${this.regalia.id}`, this.regalia)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando la regalia';
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
        this.fetchRegalia().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
