<template>
  <v-card v-if="!isLoading && asignacion">
    <v-card-title>
      <span class="headline">Finalizar {{ asignacion.servicioCanal }}</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="asignacion.nombreComercio" label="Nombre del Comercio" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.rtn" label="RTN" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.nombreContacto" label="Nombre del Contacto" readonly></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="asignacion.ciudad" label="Ciudad" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-card-title>Lista de Equipos</v-card-title>
          <v-list dense>
            <v-list-item v-for="(equipo, index) in equiposProcesados" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ equipo.tipo }}</v-list-item-title>
                <v-list-item-subtitle>{{ equipo.detalles }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
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
  computed: {
    equiposProcesados() {
      if (!this.asignacion || !this.asignacion.listEquipos) {
        console.log("No hay datos de asignación o listEquipos");
        return [];
      }

      console.log("listEquipos original:", this.asignacion.listEquipos);

      const equipos = this.asignacion.listEquipos.split(', ').map(equipo => {
        console.log("Equipo siendo procesado:", equipo);
        const [tipo, detalles] = equipo.split(':').map(s => s.trim());
        console.log("Tipo:", tipo, "Detalles:", detalles);
        return {
          tipo: tipo,
          detalles: detalles || ''
        };
      });

      console.log("Equipos procesados:", equipos);
      return equipos;
    }
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

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item:last-child {
  border-bottom: none;
}
</style>
