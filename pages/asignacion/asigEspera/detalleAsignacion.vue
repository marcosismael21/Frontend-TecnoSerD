<template>
  <v-card v-if="!isLoading && asignacion">
    <v-card-title>
      <span class="headline">Detalles de la Asignación</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="asignacion.nomComercio" label="Nombre del Comercio" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="asignacion.servicio" label="Servicio" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.tipoProblema" label="Tipo de Problema" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.interpretacion" label="Interpretación" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="asignacion.listEquipos" label="Equipos" auto-grow readonly></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !asignacion" type="error">No se pudo cargar la información de la
    asignación.</v-alert>
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
      asignacion: null,
      isLoading: true, // Nuevo estado para controlar la carga
    }
  },
  async mounted() {
    //await this.fetchAsignacion()
    try {
      await Promise.all([this.fetchAsignacion()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.isLoading = false; // Fin de la carga
    }
  },
  methods: {
    async fetchAsignacion() {
      try {
        const { data } = await this.$axios.get(
          `/asignacion/ces/${this.idComercio}/${this.idEstado}/${this.idServicio}`
        );
        this.asignacion = data[0]
      } catch (error) {
        console.error('Error fetching asignacion:', error)
        this.asignacion = null
      }
    },
    closeDialog() {
      this.$emit('close')
    },
  },
  watch: {
    idComercio(newIdComercio) {
      if (newIdComercio) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    },
    idEstado(newIdEstado) {
      if (newIdEstado) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    },
    idServicio(newIdServicio) {
      if (newIdServicio) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }

};
</script>
