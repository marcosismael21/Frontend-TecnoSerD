<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nuevo Comercio</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="nuevoComercio.nombreComercio" label="Nombre del Comercio"
                  placeholder="Ej. Bodega Los 3 Hermanos" :rules="[rules.required, rules.text]" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="nuevoComercio.idTipoComercio" :items="tipoComercio" item-text="nombre"
                  item-value="id" label="Tipo Comercio" :rules="[rules.required]" required></v-select>
              </v-col>
              <v-col cols="12" v-if="showNumUsuario">
                <v-text-field v-model="nuevoComercio.numUsuario" label="N° Usuario" placeholder="Ej. 99901234"
                  :rules="[rules.required, rules.numU]" required></v-text-field>
              </v-col>
              <v-col cols="12" v-if="showNumTienda">
                <v-text-field v-model="nuevoComercio.numTienda" label="N° Tienda" placeholder="Ej. 12345"
                  :rules="[rules.required, rules.numT]" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="nuevoComercio.latitud" label="Latitud" :rules="[rules.required, rules.lat]"
                  placeholder="Ej. 15.462537" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="nuevoComercio.longitud" label="Longitud" placeholder="Ej. -86.766431"
                  :rules="[rules.required, rules.lon]" required></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="nuevoComercio.nombreContacto" label="Nombres del Contacto"
                  placeholder="Ej. Juan Ramon Padilla" :rules="[rules.required, rules.text]" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="nuevoComercio.rtn" label="RTN" :rules="[rules.required, rules.rtn]"
                  placeholder="Ej. 01012000123456" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="nuevoComercio.telefono" label="Telefono" placeholder="Ej. 12345678"
                  :rules="[rules.required, rules.phone]" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete v-model="nuevoComercio.idCiudad" :items="ciudad" item-text="nombre" item-value="id"
                  label="Ciudad" :rules="[rules.required]" required></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="nuevoComercio.direccion" label="Direccion"
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
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="saveComercio">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      nuevoComercio: {
        nombreComercio: '',
        rtn: '',
        direccion: '',
        numTienda: '',
        nombreContacto: '',
        telefono: '',
        numUsuario: '',
        idCiudad: '',
        longitud: '',
        latitud: '',
        idTipoComercio: ''
      },
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
    }
  },
  computed: {
    showNumUsuario() {
      return this.nuevoComercio.idTipoComercio === 2 || this.nuevoComercio.idTipoComercio === 3;
    },
    showNumTienda() {
      return this.nuevoComercio.idTipoComercio === 1 || this.nuevoComercio.idTipoComercio === 3;
    }
  },
  async mounted() {
    try {
      await Promise.all([this.fetchCiudad(), this.fetchTipoComercio()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    resetForm() {
      this.nuevoComercio = {
        nombreComercio: '',
        rtn: '',
        direccion: '',
        numTienda: '',
        nombreContacto: '',
        telefono: '',
        numUsuario: '',
        idCiudad: '',
        longitud: '',
        latitud: '',
        idTipoComercio: ''
      }
      this.$refs.form.resetValidation();
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
          console.error('Error fetching tipoComercio:', error);
        });
    },
    closeDialog() {
      this.resetForm();
      this.$emit('close');
    },
    saveComercio() {
      if (this.$refs.form.validate()) {
        // Ajustar valores antes de enviar
        if (this.nuevoComercio.idTipoComercio === 1) { // DILO
          this.nuevoComercio.numUsuario = '0';
        } else if (this.nuevoComercio.idTipoComercio === 2) { // ABA
          this.nuevoComercio.numTienda = '0';
        }
        this.$axios.post('/comercio', this.nuevoComercio)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch(error => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el comercio';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    }
  }
};
</script>
