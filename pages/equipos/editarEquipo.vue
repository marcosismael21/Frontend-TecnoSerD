<template>
  <v-card v-if="!isLoading && equipo">
    <v-card-title>
      Actualizar Registro
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-autocomplete v-model="equipo.idTipoEquipo" :items="Tipoequipo" item-text="displayName" item-value="id"
              label="Equipos" :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col cols="6" v-if="showNoSerie">
            <v-text-field v-model="equipo.noserie" label="N° de SERIE" placeholder="Ej. 12345678"
            :rules="[rules.required, rules.serie]" required></v-text-field>
          </v-col>
          <v-col cols="6" v-if="showNoImei">
            <v-text-field v-model="equipo.noimei" label="N° de IMEI" placeholder="Ej. 12345678"
            :rules="[rules.required, rules.imei]" required></v-text-field>
          </v-col>
          <v-col cols="6" v-if="showPin">
            <v-text-field v-model="equipo.pin" label="N° de PIN" placeholder="Ej. 18919159"
            :rules="[rules.required, rules.pin]" required></v-text-field>
          </v-col>
          <v-col cols="6" v-if="showPuk">
            <v-text-field v-model="equipo.puk" label="N° de PUK" placeholder="Ej. 1234" :rules="[rules.required, rules.puk]"
              required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="equipo.comodin" :items="comodinOptions" item-text="text" item-value="value"
              label="Comodín" :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
          <v-col cols="6">
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="equipo.fechaLlegada" label="Fecha de Llegada" prepend-icon="mdi-calendar"
                  readonly v-bind="attrs" v-on="on" :rules="[rules.required]"></v-text-field>
              </template>
              <v-date-picker v-model="equipo.fechaLlegada" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
      <v-btn color="green darken-1" text @click="actualizarEquipo">Guardar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !equipo" type="error">No se pudo cargar la información del Equipo.</v-alert>
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
      menu: false,
      isLoading: true, // Nuevo estado para controlar la carga
      Tipoequipo: [],
      valid: false,
      comodinOptions: [
        { text: "Sí", value: true },
        { text: "No", value: false },
      ],
      rules: {
        required: value => !!value || 'Requerido.',
        estadoRequired: value => value !== null || 'Requerido.',
        serie: value => /^[A-Za-z0-9]{1,20}$/.test(value) || 'Máximo 20 caracteres, solo letras y números, sin espacios ni caracteres especiales.',
        imei: value => /^[0-9]{15}$/.test(value) || 'Debe tener 15 dígitos numéricos, sin espacios ni caracteres especiales.',
        pin: value => /^[0-9]{4}$/.test(value) || 'Debe tener 4 dígitos numéricos, sin espacios ni caracteres especiales.',
        puk: value => /^[0-9]{8}$/.test(value) || 'Debe tener 8 dígitos numéricos, sin espacios ni caracteres especiales.',
      }
    };
  },
  computed: {
    showNoSerie() {
      return this.equipo.idTipoEquipo !== 9 && this.equipo.idTipoEquipo !== 10;
    },
    showNoImei() {
      return this.equipo.idTipoEquipo === 3 || this.equipo.idTipoEquipo === 4;
    },
    showPin() {
      return this.equipo.idTipoEquipo === 9 || this.equipo.idTipoEquipo === 10;
    },
    showPuk() {
      return this.equipo.idTipoEquipo === 9 || this.equipo.idTipoEquipo === 10;
    }
  },
  async mounted() {
    try {
      await Promise.all([this.fetchEquipo(), this.fetchTipoequipo()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchEquipo() {
      try {
        const { data } = await this.$axios.get(`/equipo/${this.id}`);
        this.equipo = {
          ...data,
          fechaLlegada: data.fechaLlegada ? new Date(data.fechaLlegada).toISOString().slice(0, 10) : '',
        }
      } catch (error) {
        console.error('Error fetching equipo by ID:', error);
        this.equipo = null;
      }
    },
    fetchTipoequipo() {
      this.$axios.get('/tipoequipo')
        .then((response) => {
          this.Tipoequipo = response.data.map(item => ({
            ...item,
            displayName: `${item.nombre} - ${item.idProveedor}`  // Concatenamos nombre y proveedor
          }));
        })
        .catch(error => {
          console.error('Error fetching Tipoequipo:', error);
        });
    },
    closeDialog() {
      this.$emit('close');
    },
    actualizarEquipo() {
      if (this.$refs.form.validate()) {

        // Ajustar valores antes de enviar
        if (this.equipo.idTipoEquipo === 9 || this.equipo.idTipoEquipo === 10) { // Chip Tigo o Chip Claro
          this.equipo.noserie = '0';
          this.equipo.noimei = '0';
        } else if (this.equipo.idTipoEquipo === 3 || this.equipo.idTipoEquipo === 4) { // D2 MINI
          this.equipo.pin = '0';
          this.equipo.puk = '0';
        } else { // Otros equipos
          this.equipo.noimei = '0';
          this.equipo.pin = '0';
          this.equipo.puk = '0';
        }

        this.$axios.put(`/equipo/${this.equipo.id}`, this.equipo)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error editando el equipo';
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
        this.fetchEquipo().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
};
</script>
