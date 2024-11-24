<template>
  <v-card v-if="!isLoading && asignacion">
    <v-card-title>
      <span class="headline">Detalles de la Asignación Pendiente</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="asignacion.nombres" label="Técnico" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.servicioCanal" label="Servicio" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.nombreComercio" label="Nombre del Comercio" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.nombreContacto" label="Nombre del Contacto" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.telefono" label="Teléfono" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.ciudad" label="Ciudad" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.tipoProblema" label="Tipo de Problema" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.interpretacion" label="Interpretación" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="asignacion.listEquipos" label="Lista de Equipos" auto-grow readonly></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="closeDialog">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
  <v-alert v-else-if="!isLoading && !asignacion" type="error">No se pudo cargar la información de la
    asignación.</v-alert>
</template>

<script>
export default {
  props: {
    idUsuario: {
      type: Number,
      required: true
    },
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
          `/asignacionTecnico/detalle/tces/${this.idUsuario}/${this.idComercio}/${this.idEstado}/${this.idServicio}`
        )

        if (data.length > 0) {
          // Modificar el valor de listEquipos para que tenga saltos de línea
          data[0].listEquipos = data[0].listEquipos.replace(/, /g, ',\n')
        }

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
    idUsuario(newIdUsuadio) {
      if (newIdUsuadio) {
        this.isLoading = true;
        this.fetchAsignacion().finally(() => {
          this.isLoading = false;
        });
      }
    },
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
