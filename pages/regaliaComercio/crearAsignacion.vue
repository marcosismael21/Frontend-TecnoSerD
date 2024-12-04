<template>
  <v-card>
    <v-card-title>
      Registro de Equipo
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-autocomplete v-model="nuevoRegistro.idComercio" :items="comercios" item-text="nomComercio"
              item-value="idComercio" label="Comercio" :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-autocomplete v-model="nuevoRegistro.idPublicidadRegalia" label="Regalía/Publicidad" :items="regalias"
              item-text="nombrePublicidadRegalia" item-value="id" :rules="[rules.required]" required></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="nuevoRegistro.cantidad" label="Cantidad" placeholder="Ej. 3"
              :rules="[rules.required, rules.cant]" required></v-text-field>
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
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      valid: false,
      nuevoRegistro: {
        idComercio: '',
        idPublicidadRegalia: '',
        cantidad: '',
        estado: 0,
      },
      comercios: [],
      regalias:[],
      rules: {
        required: value => !!value || 'Requerido.',
        cant: value => /^[1-9][0-9]*$/.test(value) || 'Debe ser un número positivo entero mayor a 0, sin espacios ni caracteres especiales.',
      }
    }
  },
  async mounted() {
    try {
      await Promise.all([this.fetchComercio(), this.fetchRegalia()])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },
  methods: {
    resetForm() {
      this.nuevoRegistro = {
        idComercio: '',
        idPublicidadRegalia: '',
        cantidad: '',
        estado: 0,
      }
      this.$refs.form.resetValidation();
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
    fetchRegalia() {
      this.$axios.get("/pubreg/publicidad")
        .then((response) => {
          this.regalias = response.data
        })
        .catch((error) => {
          console.error('Error fetching regalias:', error)
        })
    },
    closeDialog() {
      this.resetForm();
      this.$emit('close');
    },
    guardarRegistro() {

      if (this.$refs.form.validate()) {

        this.$axios.post('/pubcli', this.nuevoRegistro)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el equipo';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    }
  }
};
</script>
