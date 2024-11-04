<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Asignaciones
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="3">
                <v-text-field v-model="searchPendiente" density="compact" label="Buscar"
                  prepend-inner-icon="mdi-magnify" variant="outlined" flat hide-details single-line>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-data-table :headers="headersPendiente" :items="pendiente" :search="searchPendiente">
            <template v-slot:item.nro="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.tecnico="{ item }">
              {{ item.tecnico }}
            </template>
            <template v-slot:item.nomComercio="{ item }">
              {{ item.nomComercio }}
            </template>
            <template v-slot:item.ciudad="{ item }">
              {{ item.ciudad }}
            </template>
            <template v-slot:item.servicio="{ item }">
              {{ item.servicio }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ item.estado }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="getMapa(item.latitud, item.longitud)">
                <v-icon>mdi-map-marker</v-icon>
              </v-btn>
              <v-btn icon
                @click="detallesAsignacionPendiente(item.idUsuario, item.idComercio, item.idServicio, item.idEstado)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon
                @click="cancelarAsignacionPendiente(item.idUsuario, item.idComercio, item.idServicio, item.idEstado)">
                <v-icon>mdi-account-minus</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDetalleAsignacionPendiente" max-width="600px" persistent>
      <detalle-asignacion-pendiente :idUsuario="asignacionSeleccionadaPendiente.idUsuario"
        :idComercio="asignacionSeleccionadaPendiente.idComercio" :idEstado="asignacionSeleccionadaPendiente.idEstado"
        :idServicio="asignacionSeleccionadaPendiente.idServicio" @close="dialogDetalleAsignacionPendiente = false">
      </detalle-asignacion-pendiente>
    </v-dialog>

    <v-dialog v-model="dialogConfirmCancel" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Cancelación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas quitar este técnido de esta asignación?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogConfirmCancel = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarCancelacion">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCancel" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h6">Quitando técnido de la asignación...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <span>Por favor, espere...</span>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="primary" size="64" width="4" class="mr-4"></v-progress-circular>
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top>
      {{ snackbarMessage }}
    </v-snackbar>

  </v-container>
</template>

<script>
import DetalleAsignacionPendiente from '~/pages/asignacion/asigPendiente/detalleAsigPendiente.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const dataPentiente = await $axios.get('/asignacionTecnico/at')
      return { pendiente: dataPentiente.data }
    } catch (error) {
      console.error('Error fetching asignacion:', error)
      return { pendiente: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadAsignacionPendiente()
      }
    },
  },
  data() {
    return {
      searchPendiente: '',
      pendiente: [],
      headersPendiente: [
        { text: 'N°', value: 'nro' },
        { text: "Técnico", value: "tecnico" },
        { text: "Comercio", value: "nomComercio" },
        { text: "Ciudad", value: "ciudad" },
        { text: "Tipo de Servicio", value: "servicio" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      dialogDetalleAsignacionPendiente: false,
      asignacionSeleccionadaPendiente: false,
      dialogConfirmCancel: false,
      dialogCancel: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadAsignacionPendiente() {
      try {
        const { data } = await this.$axios.get('/asignacionTecnico/at')
        this.pendiente = data
      } catch (error) {
        console.error('Error fetching comodin:', error)
        this.comodin = []
      }
    },
    nuevaAsignacion() {
      this.dialogNuevaAsignacion = true
    },
    detallesAsignacionPendiente(idUsuario, idComercio, idServicio, idEstado) {
      this.asignacionSeleccionadaPendiente = this.pendiente.find(
        (e) => e.idUsuario === idUsuario
          && e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogDetalleAsignacionPendiente = true
    },
    cancelarAsignacionPendiente(idUsuario, idComercio, idServicio, idEstado) {
      this.asignacionSeleccionadaPendiente = this.pendiente.find(
        (e) => e.idUsuario === idUsuario
          && e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado
      ) || {};
      this.dialogConfirmCancel = true;  // Mostrar el modal de confirmación
    },
    confirmarCancelacion() {
      this.dialogConfirmCancel = false;
      this.dialogCancel = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/asignacionTecnico/cancel/tcse/${this.asignacionSeleccionadaPendiente.idUsuario}/${this.asignacionSeleccionadaPendiente.idComercio}/${this.asignacionSeleccionadaPendiente.idServicio}/${this.asignacionSeleccionadaPendiente.idEstado}`)
        .then((response) => {
          this.pendiente = this.pendiente.filter(
            (pendiente) => !(pendiente.idUsuario === this.asignacionSeleccionadaPendiente.idUsuario
              && pendiente.idComercio === this.asignacionSeleccionadaPendiente.idComercio
              && pendiente.idServicio === this.asignacionSeleccionadaPendiente.idServicio
              && pendiente.idEstado === this.asignacionSeleccionadaPendiente.idEstado)
          );

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error quitando el técnico";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogCancel = false;  // Cerrar el modal de carga después de 2 segundos
          }, 2000);
        });
    }
    ,
    fetchAsignacionPendiente() {
      this.$axios
        .get('/asignacionTecnico/at')
        .then((response) => {
          this.pendiente = response.data
        })
        .catch((error) => {
          console.error('Error fetching asignación:', error)
        })
    },
    getMapa(latitud, longitud) {
      this.$axios.get(`/comercio/maps/${latitud}/${longitud}`)
        .then((response) => {
          const { googleMapsUrl } = response.data
          window.open(googleMapsUrl, '_blank')
        })
        .catch((error) => {
          console.error("Error al obtener el mapa: ", error)
        })
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    onSuccess(message) {
      // Mostrar el snackbar con un mensaje de éxito
      this.showSnackbar(message, 'success');
      this.fetchAsignacionPendiente()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
  },
  components: {
    DetalleAsignacionPendiente,
  },
}
</script>
