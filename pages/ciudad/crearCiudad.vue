<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nueva Ciudad</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="nuevoCiudad.nombre" label="Ciudad" placeholder="Ej. Olanchito"
              :rules="[rules.required, rules.text]" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="nuevoCiudad.estado" :items="estadoOptions" item-text="text" item-value="value"
              label="Estado" :rules="[rules.estadoRequired]" required></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="green darken-1" text @click="saveCiudad">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      nuevoCiudad: {
        nombre: '',
        estado: ''
      },
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      rules: {
        required: value => !!value || 'Requerido.',
        text: value => /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value) || 'Solo letras, números y espacios.',
        estadoRequired: value => value !== null || 'Requerido.',
      }
    }
  },
  methods: {
    resetForm() {
      this.nuevoCiudad = {
        nombre: '',
        estado: ''
      }
      this.$refs.form.resetValidation();
    },
    closeDialog() {
      this.resetForm();
      this.$emit('close');
    },
    saveCiudad() {
      if (this.$refs.form.validate()) {
        this.$axios.post('/ciudad', this.nuevoCiudad)
          .then((response) => {
            this.$emit('saved', response.data.message);
            this.closeDialog();
          })
          .catch(error => {
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error creando la ciudad';
            // Emitimos un evento para informar al padre que ocurrió un error
            this.$emit('error', errorMessage);
          });
      }
    }
  }
};
</script>
