<template>
  <v-card v-if="!isLoading && comercio">
    <v-card-title>
      <span class="headline">Detalles del Comercio</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="comercio.nombreComercio" label="Nombre del Comercio" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.numUsuario" label="N° Usuario" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.numTienda" label="N° Tienda" readonly></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="comercio.direccion" label="Direccion" readonly></v-textarea>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="comercio.nombreContacto" label="Nombres del Contacto" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.rtn" label="RTN" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.telefono" label="Telefono" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-autocomplete v-model="comercio.idCiudad" :items="ciudad" item-text="nombre" item-value="id"
                  label="Ciudad" readonly></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-select v-model="comercio.idTipoComercio" :items="tipoComercio" item-text="nombre" item-value="id"
                  label="Tipo Comercio" readonly></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.latitud" label="Latitud" readonly></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.longitud" label="Longitud" readonly></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !comercio" type="error">No se pudo cargar la información del comercio.</v-alert>
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
      comercio: null,
      isLoading: true, // Nuevo estado para controlar la carga
      ciudad: [],
      tipoComercio: [],
      rules: {
        required: value => !!value || 'Requerido.',
      }
    };
  },
  async mounted() {
    try {
      await Promise.all([this.fetchCiudad(), this.fetchTipoComercio(), this.fetchComercio()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchComercio() {
      try {
        const { data } = await this.$axios.get(`/comercio/${this.id}`);
        this.comercio = data;
      } catch (error) {
        console.error('Error fetching comercio by ID:', error);
        this.comercio = null;
      }
    },
    fetchCiudad() {
      this.$axios.get('/ciudad')
        .then(response => {
          this.ciudad = response.data;
        })
        .catch(error => {
          console.error('Error fetching ciudad:', error);
        });
    },
    fetchTipoComercio() {
      this.$axios.get('/tipcom')
        .then(response => {
          this.tipoComercio = response.data;
        })
        .catch(error => {
          console.error('Error fetching Tipo Comercio:', error);
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
        this.fetchComercio().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
