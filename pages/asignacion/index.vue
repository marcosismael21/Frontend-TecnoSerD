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
              <v-col cols="9">
                <v-btn color="primary" @click="nuevaAsignacion">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Asignación
                </v-btn>
                <v-btn color="primary" @click="importarArchivo">
                  <v-icon left>mdi-file-import</v-icon>
                  Importar Archivo
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" flat hide-details single-line>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-tabs v-model="tab" align-tabs="center" class="justify-center" color="deep-purple-accent-4">
            <v-tab :key="1">Asignaciones en Espera</v-tab>
            <v-tab :key="2">Asignaciones Pendientes</v-tab>
            <v-tab :key="3">Asignaciones en Proceso</v-tab>
            <v-tab :key="4">Asignaciones Finalizadas</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item :key="1">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headers" :items="espera" :search="search" item-key="idComercio">
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-toolbar-title>Lista de Asignaciones</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="asignarTecnicoMultiple(selectedItems)">
                            <v-icon left>mdi-account-multiple</v-icon>
                            Asignación Múltiple
                          </v-btn>
                        </v-toolbar>
                      </template>
                      <!-- Checkbox para seleccionar filas -->
                      <template v-slot:item.checkbox="{ item }">
                        <v-checkbox :input-value="isSelected(item)" @click="toggleSelection(item)"></v-checkbox>
                      </template>
                      <template v-slot:item.nro="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-slot:item.nomComerio="{ item }">
                        {{ item.nomComerio }}
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
                        <v-btn icon @click="detallesAsignacion(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="editarAsignacion(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="asignarTecnico(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-cube-send</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item :key="2">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headersPendiente" :items="pendiente" :search="search">
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
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>

    <!-- en espera -->

    <v-dialog v-model="dialogNuevaAsignacion" max-width="600px" persistent>
      <crear-asignacion @close="dialogNuevaAsignacion = false" @saved="onSuccess" @error="onError"></crear-asignacion>
    </v-dialog>

    <v-dialog v-model="dialogDetalleAsignacion" max-width="600px" persistent>
      <detalle-asignacion :idComercio="asignacionSeleccionada.idComercio" :idEstado="asignacionSeleccionada.idEstado"
        :idServicio="asignacionSeleccionada.idServicio" @close="dialogDetalleAsignacion = false">
      </detalle-asignacion>
    </v-dialog>

    <v-dialog v-model="dialogEditarAsignacion" max-width="600px" persistent>
      <editar-asignacion :idComercio="asignacionSeleccionada.idComercio" :idEstado="asignacionSeleccionada.idEstado"
        :idServicio="asignacionSeleccionada.idServicio" @close="dialogEditarAsignacion = false" @saved="onSuccess"
        @error="onError"></editar-asignacion>
    </v-dialog>

    <v-dialog v-model="dialogasignarTecnico" max-width="600px" persistent>
      <asignacion-tecnico :idComercio="asignacionSeleccionada.idComercio" :idEstado="asignacionSeleccionada.idEstado"
        :idServicio="asignacionSeleccionada.idServicio" @close="dialogasignarTecnico = false" @saved="onSuccess"
        @error="onError"></asignacion-tecnico>
    </v-dialog>

    <v-dialog v-model="dialogMultipleAsignacion" max-width="600px" persistent>
      <asignacion-multiple-tecnico :asignaciones="selectedItems" @close="dialogMultipleAsignacion = false"
        @saved="onSuccess" @error="onError"></asignacion-multiple-tecnico>
    </v-dialog>

    <!-- Pendientes -->

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
import CrearAsignacion from '~/pages/asignacion/asigEspera/crearAsignacion.vue'
import DetalleAsignacion from '~/pages/asignacion/asigEspera/detalleAsignacion.vue'
import EditarAsignacion from '~/pages/asignacion/asigEspera/editarAsignacion.vue'
import AsignacionTecnico from '~/pages/asignacion/asigEspera/crearAsignacionTecnico.vue'
import AsignacionMultipleTecnico from '~/pages/asignacion/asigEspera/crearMultiplesAsignaciones.vue'
import DetalleAsignacionPendiente from '~/pages/asignacion/asigPendiente/detalleAsigPendiente.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const dataEspera = await $axios.get('/asignacion/s/1')
      const dataPentiente = await $axios.get('/asignacionTecnico/at')
      return {
        espera: dataEspera.data,
        pendiente: dataPentiente.data
      }
    } catch (error) {
      console.error('Error fetching asignacion:', error)
      return { espera: [], pendiente: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadAsignacion()
      }
    },
  },
  data() {
    return {
      tab: 0, // inicializamos el tab en 0
      search: '',
      espera: [],
      selectedItems: [],
      searchPendiente: '',
      pendiente: [],
      headers: [
        { text: '', value: 'checkbox', sortable: false },
        { text: 'N°', value: 'nro' },
        { text: "Comercio", value: "nomComerio" },
        { text: "Ciudad", value: "ciudad" },
        { text: "Tipo de Servicio", value: "servicio" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      headersPendiente: [
        { text: 'N°', value: 'nro' },
        { text: "Técnico", value: "tecnico" },
        { text: "Comercio", value: "nomComercio" },
        { text: "Ciudad", value: "ciudad" },
        { text: "Tipo de Servicio", value: "servicio" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      dialogNuevaAsignacion: false,
      dialogEditarAsignacion: false,
      dialogDetalleAsignacion: false,
      asignacionSeleccionada: false,
      dialogasignarTecnico: false,
      dialogMultipleAsignacion: false,
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
    async loadAsignacion() {
      try {
        const dataEspera = await this.$axios.get('/asignacion/s/1')
        const dataPendiente = await this.$axios.get('/asignacionTecnico/at')
        this.espera = dataEspera
        this.pendiente = dataPendiente
      } catch (error) {
        console.error('Error fetching comodin:', error)
        this.comodin = []
      }
    },
    isSelected(item) {
      return this.selectedItems.some(
        (selected) =>
          selected.idComercio === item.idComercio &&
          selected.idServicio === item.idServicio &&
          selected.idEstado === item.idEstado
      )
    },
    toggleSelection(item) {
      const index = this.selectedItems.findIndex(
        (selected) =>
          selected.idComercio === item.idComercio &&
          selected.idServicio === item.idServicio &&
          selected.idEstado === item.idEstado
      )
      if (index === -1) {
        this.selectedItems.push({
          idComercio: item.idComercio,
          idServicio: item.idServicio,
          idEstado: item.idEstado,
        })
      } else {
        this.selectedItems.splice(index, 1)
      }
    },
    nuevaAsignacion() {
      this.dialogNuevaAsignacion = true
    },
    editarAsignacion(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.espera.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogEditarAsignacion = true
    },
    detallesAsignacion(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.espera.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogDetalleAsignacion = true
    },
    asignarTecnico(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.espera.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogasignarTecnico = true
    },
    asignarTecnicoMultiple(selectedItems) {
      if (selectedItems.length === 0) {
        this.showSnackbar('Por favor, selecciona al menos una asignación.', 'error');
        return;
      }
      this.dialogMultipleAsignacion = true;
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
    },
    fetchAsignacion() {
      this.$axios
        .get('/asignacion/as/1')
        .then((response) => {
          this.espera = response.data
        })
        .catch((error) => {
          console.error('Error fetching asignación:', error)
        })
    },
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
    importarArchivo() {
      this.$router.push('excel')
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    onSuccess(message) {
      // Mostrar el snackbar con un mensaje de éxito
      this.showSnackbar(message, 'success');
      this.fetchAsignacion()
      this.fetchAsignacionPendiente()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
  },
  components: {
    CrearAsignacion,
    DetalleAsignacion,
    EditarAsignacion,
    AsignacionTecnico,
    AsignacionMultipleTecnico,
    DetalleAsignacionPendiente
  },
}
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
