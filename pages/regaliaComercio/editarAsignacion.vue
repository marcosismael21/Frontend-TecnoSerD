<template>
  <v-card v-if="!isLoading && regalia">
    <v-card-title>
      <span class="headline">Actualizar Regalia Asignada</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-autocomplete v-model="regalia.idComercio" :items="comercios" item-text="nomComercio"
              item-value="idComercio" label="Comercio" :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-autocomplete v-model="regalia.idPublicidadRegalia" label="Regalía/Publicidad" :items="rega"
              item-text="nombrePublicidadRegalia" item-value="id" :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="regalia.cantidad" label="Cantidad" placeholder="Ej. 3"
              :rules="[rules.required, rules.cant]" required></v-text-field>
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
  <v-alert v-else-if="!isLoading && !regalia" type="error">No se pudo cargar la información de la regalia.</v-alert>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  props: {
    idre: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      regalia: null,
      isLoading: true, // Nuevo estado para controlar la carga
      comercios: [],
      rega: [],
      rules: {
        required: value => !!value || 'Requerido.',
        cant: value => /^[1-9][0-9]*$/.test(value) || 'Debe ser un número positivo entero mayor a 0, sin espacios ni caracteres especiales.',
      }
    };
  },
  async mounted() {
    try {
      await Promise.all([this.fetchRegaliaById(), this.fetchComercio(), this.fetchRega()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchRegaliaById() {
      try {
        const { data } = await this.$axios.get(`/pubcli/${this.idre}`)
        this.regalia = data;
      } catch (error) {
        console.error('Error fetching tipoComercio by ID:', error)
        this.regalia = null;
      }
    },
    fetchComercio() {
      const idTecnico = Cookies.get('id')
      this.$axios.get(`asignacionTecnico/lap/${idTecnico}`)
        .then((response) => {
          this.comercios = response.data
        })
        .catch((error) => {
          console.error('Error fetching comercios:', error)
        })
    },
    fetchRega() {
      this.$axios.get("/pubreg/publicidad")
        .then((response) => {
          this.rega = response.data
        })
        .catch((error) => {
          console.error('Error fetching regalias:', error)
        })
    },
    closeDialog() {
      this.$emit('close');
    },
    actualizarRegalia() {
      if (this.$refs.form.validate()) {
        this.$axios.put(`/pubcli/${this.regalia.id}`, this.regalia)
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
    idre(newId) {
      if (newId) {
        this.isLoading = true;
        this.fetchRegaliaById().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
