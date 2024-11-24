<template>
  <v-card v-if="!isLoading && canal">
    <v-card-title>
      <span class="headline">Actualizar Canal</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="canal.nombre" label="Canal" placeholder="Ej. ABA"
              :rules="[rules.required, rules.text]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="canal.idTipoComercio" :items="tipoComercio" item-text="nombre" item-value="id"
              label="Tipo Comercio" :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="canal.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado"
              :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarCanal">Guardar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !canal" type="error">No se pudo cargar la información del canal.</v-alert>
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
      canal: null,
      isLoading: true, // Nuevo estado para controlar la carga
      tipoComercio: [],
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      rules: {
        required: value => !!value || 'Requerido.',
        text: value => /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value) || 'Solo letras, números y espacios.',
        estadoRequired: value => value !== null || 'Requerido.',
      }
    };
  },
  async mounted() {
    try {
      await Promise.all([this.fetchCanal(), this.fetchTipoComercio()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchCanal() {
      try {
        const { data } = await this.$axios.get(`/canal/${this.id}`)
        this.canal = data;
      } catch (error) {
        console.error('Error fetching tipoComercio by ID:', error)
        this.canal = null;
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
    actualizarCanal() {
      if (this.$refs.form.validate()) {
        this.$axios.put(`/canal/${this.canal.id}`, this.canal)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando el canal';
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
        this.fetchCanal().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
