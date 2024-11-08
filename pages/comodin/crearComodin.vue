<template>
  <v-card>
    <v-card-title>
      Registro de Equipo
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-autocomplete v-model="nuevoRegistro.idTipoEquipo" :items="tipoEquipo" item-text="displayName"
              item-value="id" label="Equipos" :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col cols="12" v-if="showNoSerie">
            <v-text-field v-model="nuevoRegistro.noserie" label="N° de SERIE" placeholder="Ej. DM03221342332"
              :rules="[rules.required, rules.serie]" required></v-text-field>
          </v-col>
          <v-col cols="12" v-if="showNoImei">
            <v-text-field v-model="nuevoRegistro.noimei" label="N° de IMEI" placeholder="Ej. 12345678"
              :rules="[rules.required, rules.imei]" required></v-text-field>
          </v-col>
          <v-col cols="6" v-if="showPin">
            <v-text-field v-model="nuevoRegistro.pin" label="N° de PIN" placeholder="Ej. 18919159"
              :rules="[rules.required, rules.pin]" required></v-text-field>
          </v-col>
          <v-col cols="6" v-if="showPuk">
            <v-text-field v-model="nuevoRegistro.puk" label="N° de PUK" placeholder="Ej. 1234"
              :rules="[rules.required, rules.puk]" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="nuevoRegistro.fechaLlegada" label="Fecha de Llegada" prepend-icon="mdi-calendar"
                  readonly v-bind="attrs" v-on="on" :rules="[rules.required]"></v-text-field>
              </template>
              <v-date-picker v-model="nuevoRegistro.fechaLlegada" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="guardarRegistro">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      menu: false,
      tipoEquipo: [],
      nuevoRegistro: {
        idTipoEquipo: '',
        noserie: '',
        noimei: '',
        pin: '',
        puk: '',
        fechaLlegada: '',
        comodin: true,
        estado: true,
      },
      rules: {
        required: value => !!value || 'Requerido.',
        serie: value => /^[A-Za-z0-9]{1,20}$/.test(value) || 'Máximo 20 caracteres, solo letras y números, sin espacios ni caracteres especiales.',
        imei: value => /^[0-9]{15}$/.test(value) || 'Debe tener 15 dígitos numéricos, sin espacios ni caracteres especiales.',
        pin: value => /^[0-9]{4}$/.test(value) || 'Debe tener 4 dígitos numéricos, sin espacios ni caracteres especiales.',
        puk: value => /^[0-9]{8}$/.test(value) || 'Debe tener 8 dígitos numéricos, sin espacios ni caracteres especiales.',
      }
    }
  },
  computed: {
    showNoSerie() {
      return this.nuevoRegistro.idTipoEquipo !== 9 && this.nuevoRegistro.idTipoEquipo !== 10;
    },
    showNoImei() {
      return this.nuevoRegistro.idTipoEquipo === 3 || this.nuevoRegistro.idTipoEquipo === 4;
    },
    showPin() {
      return this.nuevoRegistro.idTipoEquipo === 9 || this.nuevoRegistro.idTipoEquipo === 10;
    },
    showPuk() {
      return this.nuevoRegistro.idTipoEquipo === 9 || this.nuevoRegistro.idTipoEquipo === 10;
    }
  },
  mounted() {
    this.fetchTipoEquipo();
  },
  methods: {
    resetForm() {
      this.nuevoRegistro = {
        idTipoEquipo: '',
        noserie: '',
        noimei: '',
        pin: '',
        puk: '',
        fechaLlegada: '',
        comodin: true,
        estado: true,
      }
      this.$refs.form.resetValidation();
    },
    fetchTipoEquipo() {
      this.$axios.get('/tipoequipo')
        .then((response) => {
          this.tipoEquipo = response.data.map(item => ({
            ...item,
            displayName: `${item.nombre} - ${item.idProveedor}`  // Concatenamos nombre y proveedor
          }));
        })
        .catch(error => {
          console.error('Error fetching Tipo Equipo:', error);
        });
    },
    closeDialog() {
      this.resetForm();
      this.$emit('close');
    },
    guardarRegistro() {
      if (this.$refs.form.validate()) {

        // Ajustar valores antes de enviar
        if (this.nuevoRegistro.idTipoEquipo === 9 || this.nuevoRegistro.idTipoEquipo === 10) { // Chip Tigo o Chip Claro
          this.nuevoRegistro.noserie = '0';
          this.nuevoRegistro.noimei = '0';
        } else if (this.nuevoRegistro.idTipoEquipo === 3 || this.nuevoRegistro.idTipoEquipo === 4) { // D2 MINI
          this.nuevoRegistro.pin = '0';
          this.nuevoRegistro.puk = '0';
        } else { // Otros equipos
          this.nuevoRegistro.noimei = '0';
          this.nuevoRegistro.pin = '0';
          this.nuevoRegistro.puk = '0';
        }

        this.$axios.post('/equipo', this.nuevoRegistro)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el comodín';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    }
  }
};
</script>
