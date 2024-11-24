<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nuevo Canal</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="nuevoCanal.nombre" label="Canal" placeholder="Ej. ABA"
              :rules="[rules.required, rules.text]" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="nuevoCanal.idTipoComercio" :items="tipoComercio" item-text="nombre" item-value="id"
              label="Tipo Comercio" :rules="[rules.required]" required></v-select>
          </v-col>
          <v-col cols="12">
            <v-select v-model="nuevoCanal.estado" :items="estadoOptions" item-text="text" item-value="value"
              label="Estado" :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="saveCanal">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      nuevoCanal: {
        nombre: "",
        idTipoComercio: "",
        estado: "",
      },
      tipoComercio: [],
      estadoOptions: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false },
      ],
      rules: {
        required: (value) => !!value || "Requerido.",
        text: value => /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value) || 'Solo letras, números y espacios.',
        estadoRequired: value => value !== null || 'Requerido.',
      },
    };
  },
  mounted() {
    this.fetchTipoComercio()
  },
  methods: {
    resetForm() {
      this.nuevoCanal = {
        nombre: "",
        idTipoComercio: "",
        estado: "",
      },
        this.$refs.form.resetValidation();
    },
    fetchTipoComercio() {
      this.$axios
        .get("/tipcom")
        .then((response) => {
          this.tipoComercio = response.data;
        })
        .catch((error) => {
          console.error("Error fetching tipo comercio:", error);
        });
    },
    closeDialog() {
      this.resetForm();
      this.$emit("close");
    },
    saveCanal() {
      if (this.$refs.form.validate()) {
        this.$axios
          .post("/canal", this.nuevoCanal)
          .then((response) => {
            this.$emit('saved', response.data.message)
            this.closeDialog()
          })
          .catch((error) => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando el canal';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    },
  },
};
</script>
