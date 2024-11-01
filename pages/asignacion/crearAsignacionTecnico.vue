<template>
  <v-card>
    <v-card-title>
      Crear Asignacion
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="12">
            <v-autocomplete v-model="nuevaAsignacionTecnico.idUsuario" :items="tecnicos" item-text="nombres"
              item-value="id" label="Tecnicos" :rules="[rules.required]" required>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="saveAsignacionTecnic">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    idComercio: {
      type: Number,
      required: true
    },
    idEstado: {
      type: Number,
      required: true
    },
    idServicio: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      nuevaAsignacionTecnico: {
        idUsuario: '',
        idComercio: this.idComercio,
        idEstado: this.idEstado,
        idServicio: this.idServicio,
      },
      tecnicos: [],
      rules: {
        required: value => !!value || 'Requerido.',
      }
    }
  },
  mounted() {
    this.fetchTecnicos()
  },
  methods: {
    resetForm() {
      this.nuevaAsignacionTecnico = {
        idUsuario: '',
        idComercio: this.idComercio,
        idEstado: this.idEstado,
        idServicio: this.idServicio,
      },
        this.$refs.form.resetValidation();
    },
    fetchTecnicos() {
      this.$axios.get('/usuario/t')
        .then(response => {
          this.tecnicos = response.data
        })
        .catch(error => {
          console.error('error:', error)
        })
    },
    closeDialog() {
      this.resetForm()
      this.$emit('close')
    },
    async saveAsignacionTecnic() {
      if (this.$refs.form.validate()) {
        this.$axios
          .post("/asignacionTecnico/at", this.nuevaAsignacionTecnico)
          .then((response) => {
            this.$emit('saved', response.data.message)
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el canal';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage); F
          });
      }
    }
  },
  watch: {
    idComercio(newVal) {
      this.nuevaAsignacionTecnico.idComercio = newVal;
    },
    idEstado(newVal) {
      this.nuevaAsignacionTecnico.idEstado = newVal;
    },
    idServicio(newVal) {
      this.nuevaAsignacionTecnico.idServicio = newVal;
    }
  }
}
</script>
