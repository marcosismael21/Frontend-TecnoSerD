<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Asignaciones en Proceso
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center" justify="end">
              <v-col cols="3">
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" flat hide-details single-line>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-data-table :headers="headers" :items="proceso" :search="search">
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
              <v-btn icon @click="finalizarAsignacioPendiente(item.idUsuario, item.idComercio, item.idServicio, item.idEstado)">
                <v-icon>mdi-package-variant</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDetalleAsignacionPendiente" max-width="600px" persistent>
      <detalle-asignacion-proceso :idUsuario="asignacionSeleccionadaPendiente.idUsuario"
        :idComercio="asignacionSeleccionadaPendiente.idComercio" :idEstado="asignacionSeleccionadaPendiente.idEstado"
        :idServicio="asignacionSeleccionadaPendiente.idServicio" @close="dialogDetalleAsignacionPendiente = false">
      </detalle-asignacion-proceso>
    </v-dialog>

    <v-dialog v-model="dialogFinalizarAsignacion" max-width="600px" persistent>
      <finalizar-asignacion :idUsuario="asignacionSeleccionadaPendiente.idUsuario"
        :idComercio="asignacionSeleccionadaPendiente.idComercio" :idEstado="asignacionSeleccionadaPendiente.idEstado"
        :idServicio="asignacionSeleccionadaPendiente.idServicio" @close="dialogFinalizarAsignacion = false" @saved="onSuccess"
        @error="onError">
      </finalizar-asignacion>
    </v-dialog>

    <v-dialog v-model="dialogEmpezarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Aceptar Asignación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas aceptar esta asignación?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEmpezarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmar">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEmpezar" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h6">Aceptando asignación...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <span>Enviando la información a Asignaciones en Proceso espere favor, espere...</span>
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
import DetalleAsignacionProceso from '~/pages/tecnicoProceso/detalleProceso.vue'
import FinalizarAsignacion from '~/pages/tecnicoProceso/finalizarAsignacio.vue'

import Cookies from 'js-cookie';

export default {
  async asyncData({ $axios }) {
    const idTecnico = Cookies.get('id')
    try {
      const { data } = await $axios.get(`asignacionTecnico/lapr/${idTecnico}`)
      return { proceso: data }
    } catch (error) {
      console.error('Error fetching rol:', error)
      return { rol: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadAsig()
      }
    },
  },
  data() {
    return {
      tab: 0, // inicializamos el tab en 0
      search: '',
      proceso: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: "Técnico", value: "tecnico" },
        { text: "Comercio", value: "nomComercio" },
        { text: "Ciudad", value: "ciudad" },
        { text: "Tipo de Servicio", value: "servicio" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      //variables para activar los modales
      dialogDetalleAsignacionPendiente: false,
      dialogFinalizarAsignacion: false,
      asignacionSeleccionadaPendiente: false,
      dialogEmpezar: false,
      dialogEmpezarConfirm: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadAsig() {
      const idTecnico = Cookies.get('id')
      try {
        const { data } = await $axios.get(`asignacionTecnico/lapr/${idTecnico}`)
        this.proceso = data
      } catch (error) {
        console.error('Error fetching proceso:', error)
        this.proceso = []
      }
    },
    detallesAsignacionPendiente(idUsuario, idComercio, idServicio, idEstado) {
      this.asignacionSeleccionadaPendiente = this.proceso.find(
        (e) => e.idUsuario === idUsuario
          && e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogDetalleAsignacionPendiente = true
    },
    finalizarAsignacioPendiente(idUsuario, idComercio, idServicio, idEstado) {
      this.asignacionSeleccionadaPendiente = this.proceso.find(
        (e) => e.idUsuario === idUsuario
          && e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogFinalizarAsignacion = true
    },
    empezarProceso(idEstadoAnterior, listAsignacionId, listAsignacionTecnicoID) {
      this.asignacionSeleccionadaPendiente = this.proceso.find(
        (e) => e.idEstado === idEstadoAnterior
          && e.listAsignacionId === listAsignacionId
          && e.listAsignacionTecnicoIDs === listAsignacionTecnicoID
      ) || {}
      this.dialogEmpezarConfirm = true
      console.log(idEstadoAnterior + '\n' + listAsignacionId + '\n' + listAsignacionTecnicoID)
    },
    confirmar() {
      this.dialogEmpezarConfirm = false;
      this.dialogEmpezar = true;

      this.$axios
        .patch(`/asignacionTecnico/t`, {
          idEstado: 3,
          idEstadoAnterior: this.asignacionSeleccionadaPendiente.idEstado,
          listAsignacionId: this.asignacionSeleccionadaPendiente.listAsignacionId.split(',').map(id => parseInt(id.trim())),
          listAsignacionTecnicoID: this.asignacionSeleccionadaPendiente.listAsignacionTecnicoIDs.split(',').map(id => parseInt(id.trim()))
        })
        .then((response) => {

          // Filtrar el elemento eliminado de la lista de pendientes
          this.proceso = this.proceso.filter(
            (proceso) =>
              !(
                proceso.idEstado === this.asignacionSeleccionadaPendiente.idEstado &&
                proceso.listAsignacionId === this.asignacionSeleccionadaPendiente.listAsignacionId &&
                proceso.listAsignacionTecnicoID === this.asignacionSeleccionadaPendiente.listAsignacionTecnicoID
              )
          );

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error aceptando la asignación";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEmpezar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
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
      this.fetchAsig()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    fetchAsig() {
      const idTecnico = Cookies.get('id')
      this.$axios
        .get(`asignacionTecnico/lapr/${idTecnico}`)
        .then((response) => {
          this.proceso = response.data
        })
        .catch((error) => {
          console.error('Error fetching asignacion:', error)
        })
    },
  },
  components: {
    DetalleAsignacionProceso,
    FinalizarAsignacion,
  },
}
</script>
