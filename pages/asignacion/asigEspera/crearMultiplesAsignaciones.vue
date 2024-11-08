<template>
  <v-card>
    <v-card-title>
      Crear Asignación
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="12">
            <v-autocomplete v-model="nuevaAsignacionTecnico.idUsuario" :items="tecnicos" item-text="nombres"
              item-value="id" label="Técnicos" :rules="[rules.required]" required>
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
    asignaciones: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      nuevaAsignacionTecnico: {
        idUsuario: '',
        asignaciones: this.asignaciones
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
        asignaciones: this.asignaciones
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
        const asignacionesConUsuario = this.asignaciones.map(asignacion => ({
          ...asignacion,
          idUsuario: this.nuevaAsignacionTecnico.idUsuario
        }));
        this.$axios
          .post("/asignacionTecnico/mat", asignacionesConUsuario)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el canal';
            this.$emit('error', errorMessage);
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
