<template>
  <v-card v-if="!isLoading && comercio">
    <v-card-title>
      <span class="headline">Actualizar Comercio</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="comercio.nombreComercio" label="Nombre del Comercio"
                  placeholder="Ej. Bodega Los 3 Hermanos" :rules="[rules.required, rules.text]" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="comercio.idTipoComercio" :items="tipoComercio" item-text="nombre" item-value="id"
                  label="Tipo Comercio" :rules="[rules.required]" required></v-select>
              </v-col>
              <v-col cols="12" v-if="showNumUsuario">
                <v-text-field v-model="comercio.numUsuario" label="N° Usuario" placeholder="Ej. 99901234"
                :rules="[rules.required, rules.numU]" required></v-text-field>
              </v-col>
              <v-col cols="12" v-if="showNumTienda">
                <v-text-field v-model="comercio.numTienda" label="N° Tienda" placeholder="Ej. 12345"
                :rules="[rules.required, rules.numT]" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.latitud" label="Latitud" :rules="[rules.required, rules.lat]"
                  placeholder="Ej. 15.462547" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.longitud" label="Longitud" placeholder="Ej. -85.462577"
                :rules="[rules.required, rules.lon]" required></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="comercio.nombreContacto" label="Nombres del Contacto"
                  placeholder="Ej. Juan Ramon Padilla" :rules="[rules.required, rules.text]" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.rtn" label="RTN" :rules="[rules.required, rules.rtn]"
                  placeholder="Ej. 01012000123456" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="comercio.telefono" label="Telefono" placeholder="Ej. 12345678"
                :rules="[rules.required, rules.phone]" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="comercio.idCiudad" :items="ciudad" item-text="nombre" item-value="id" label="Ciudad"
                :rules="[rules.required]" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="comercio.direccion" label="Direccion"
                  placeholder="Ej. Colonia El Sauce al lado de Little Caesars" :rules="[rules.required, rules.dire]"
                  required></v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarComercio">Guardar</v-btn>
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
        text: value => /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value) || 'Solo letras, números y espacios.',
        rtn: value => /^[A-Z0-9]{13,15}$/.test(value) || 'Debe tener entre 13 y 15 caracteres, solo letras mayúsculas y números',
        phone: value => /^[0-9]{8}$/.test(value) || 'El teléfono debe tener solo 8 dígitos numéricos',
        lat: value => /^-?([1-8]?[0-9](\.\d{1,15})?|90(\.0{1,15})?)$/.test(value) || 'Latitud debe estar entre -90 y 90, con hasta 14 decimales',
        lon: value => /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d{6,15})?|180(\.0{6,15})?)$/.test(value) || 'Longitud debe estar entre -180 y 180, con 6 a 14 decimales',
        numT: value => /^[0-9]{5}$/.test(value) || 'Debe ser un número de 5 dígitos sin espacios ni caracteres especiales',
        numU: value => /^[0-9]{8}$/.test(value) || 'Debe ser un número de 8 dígitos sin espacios ni caracteres especiales',
        dire: value => /^[A-Za-zÀ-ÿ0-9ñÑ.,\s-]{1,255}$/.test(value) || 'Máximo 255 caracteres, solo letras, números, espacios y los caracteres , . -',
      }
    };
  },
  computed: {
    showNumUsuario() {
      return this.comercio.idTipoComercio === 2 || this.comercio.idTipoComercio === 3;
    },
    showNumTienda() {
      return this.comercio.idTipoComercio === 1 || this.comercio.idTipoComercio === 3;
    }
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
    actualizarComercio() {
      if (this.$refs.form.validate()) {
        // Ajustar valores antes de enviar
        if (this.comercio.idTipoComercio === 1) { // DILO
          this.comercio.numUsuario = '0';
        } else if (this.comercio.idTipoComercio === 2) { // ABA
          this.comercio.numTienda = '0';
        }
        this.$axios.put(`/comercio/${this.comercio.id}`, this.comercio)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch(error => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando el comercio';
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
        this.fetchComercio().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
