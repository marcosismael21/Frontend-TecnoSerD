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
                          <v-spacer></v-spacer>
                          <v-col cols="12" align="right">
                            <v-btn color="primary" @click="generarReporte">
                              <v-icon left>mdi-file-outline</v-icon>
                              Generar Reporte
                            </v-btn>
                            <v-btn color="primary" @click="asignarTecnicoMultiple(selectedItems)">
                              <v-icon left>mdi-account-multiple</v-icon>
                              Asignación Múltiple
                            </v-btn>
                          </v-col>
                        </v-toolbar>
                      </template>
                      <!-- Checkbox para seleccionar filas -->
                      <template v-slot:item.checkbox="{ item }">
                        <v-checkbox :input-value="isSelected(item)" @click="toggleSelection(item)"></v-checkbox>
                      </template>
                      <template v-slot:item.nro="{ index }">
                        {{ index + 1 }}
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
                        <v-btn icon @click="detallesAsignacion(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="editarAsignacion(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="asignarTecnico(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-cube-send</v-icon>
                        </v-btn>
                        <v-btn icon @click="eliminarAsignacion(item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-delete</v-icon>
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
            <v-tab-item :key="3">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headersProceso" :items="proceso" :search="search">
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
                          @click="detallesAsignacionProceso(item.idUsuario, item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item :key="4">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headersFinalizado" :items="finalizado" :search="search">
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
                          @click="detallesAsignacionFinalizada(item.idUsuario, item.idComercio, item.idServicio, item.idEstado)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="imprimirFormato(item.idServicio)">
                          <v-icon>mdi-printer</v-icon>
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

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta asignación?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando asignación...</v-card-title>
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

    <!-- En proceso -->

    <v-dialog v-model="dialogDetalleAsignacionProceso" max-width="600px" persistent>
      <detalle-asignacion-proceso :idUsuario="asignacionSeleccionadaProceso.idUsuario"
        :idComercio="asignacionSeleccionadaProceso.idComercio" :idEstado="asignacionSeleccionadaProceso.idEstado"
        :idServicio="asignacionSeleccionadaProceso.idServicio" @close="dialogDetalleAsignacionProceso = false">
      </detalle-asignacion-proceso>
    </v-dialog>

    <!-- Finalizada -->

    <v-dialog v-model="dialogDetalleAsignacionFinalizada" max-width="600px" persistent>
      <detalle-asignacion-finalizada :idUsuario="asignacionSeleccionadaFinalizada.idUsuario"
        :idComercio="asignacionSeleccionadaFinalizada.idComercio" :idEstado="asignacionSeleccionadaFinalizada.idEstado"
        :idServicio="asignacionSeleccionadaFinalizada.idServicio" @close="dialogDetalleAsignacionFinalizada = false">
      </detalle-asignacion-finalizada>
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
import DetalleAsignacionProceso from '~/pages/asignacion/asigProceso/detalleAsigProceso.vue'
import DetalleAsignacionFinalizada from '~/pages/asignacion/asigFinalizada/detalleAsigFinalizada.vue'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  async asyncData({ $axios }) {
    try {
      const dataEspera = await $axios.get('/asignacion/s/1')
      const dataPentiente = await $axios.get('/asignacionTecnico/at/2')
      const dataProceso = await $axios.get('/asignacionTecnico/at/3')
      const dataFinalizada = await $axios.get('/asignacionTecnico/at/4')
      return {
        espera: dataEspera.data,
        pendiente: dataPentiente.data,
        proceso: dataProceso.data,
        finalizado: dataFinalizada.data,
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
      pendiente: [],
      proceso: [],
      finalizado: [],
      selectedItems: [],
      searchPendiente: '',
      headers: [
        { text: '', value: 'checkbox', sortable: false },
        { text: 'N°', value: 'nro' },
        { text: "Comercio", value: "nomComercio" },
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
      headersProceso: [
        { text: 'N°', value: 'nro' },
        { text: "Técnico", value: "tecnico" },
        { text: "Comercio", value: "nomComercio" },
        { text: "Ciudad", value: "ciudad" },
        { text: "Tipo de Servicio", value: "servicio" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      headersFinalizado: [
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
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      dialogDetalleAsignacionProceso: false,
      asignacionSeleccionadaProceso: false,
      dialogDetalleAsignacionFinalizada: false,
      asignacionSeleccionadaFinalizada: false,
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
        const dataPendiente = await this.$axios.get('/asignacionTecnico/at/2')
        const dataProceso = await $axios.get('/asignacionTecnico/at/3')
        const dataFinalizada = await this.$axios.get('/asignacionTecnico/at/4')
        this.espera = dataEspera
        this.pendiente = dataPendiente
        this.proceso = dataProceso
        this.finalizado = dataFinalizada
      } catch (error) {
        console.error('Error fetching asignacion:', error)
        this.espera = []
        this.pendiente = []
        this.proceso = []
        this.finalizado = []
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

          // Filtrar el elemento eliminado de la lista de pendientes
          this.pendiente = this.pendiente.filter(
            (pendiente) =>
              !(
                pendiente.idUsuario === this.asignacionSeleccionadaPendiente.idUsuario &&
                pendiente.idComercio === this.asignacionSeleccionadaPendiente.idComercio &&
                pendiente.idServicio === this.asignacionSeleccionadaPendiente.idServicio &&
                pendiente.idEstado === this.asignacionSeleccionadaPendiente.idEstado
              )
          );

          // Crear una copia del objeto y cambiar el idEstado a 1
          const asignacionEnEspera = { ...this.asignacionSeleccionadaPendiente, idEstado: 1 };

          // Añadir el elemento eliminado a la lista de espera
          this.espera.push(asignacionEnEspera);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar mensaje de error del backend o mensaje genérico
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
    eliminarAsignacion(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.espera.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/asignacion/cse/${this.asignacionSeleccionada.idComercio}/${this.asignacionSeleccionada.idServicio}/${this.asignacionSeleccionada.idEstado}`)
        .then((response) => {

          // Filtrar el elemento eliminado de la lista de pendientes
          this.espera = this.espera.filter(
            (espera) =>
              !(
                espera.idComercio === this.asignacionSeleccionada.idComercio &&
                espera.idServicio === this.asignacionSeleccionada.idServicio &&
                espera.idEstado === this.asignacionSeleccionada.idEstado
              )
          );

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando el canal";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    detallesAsignacionProceso(idUsuario, idComercio, idServicio, idEstado) {
      this.asignacionSeleccionadaProceso = this.proceso.find(
        (e) => e.idUsuario === idUsuario
          && e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogDetalleAsignacionProceso = true
    },
    detallesAsignacionFinalizada(idUsuario, idComercio, idServicio, idEstado) {
      this.asignacionSeleccionadaFinalizada = this.finalizado.find(
        (e) => e.idUsuario === idUsuario
          && e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogDetalleAsignacionFinalizada = true
    },
    imprimirFormato(idServicio) {
      this.showSnackbar("Hola mundo <3", "success");
    },
    async generarReporte() {
      try {
        const { data } = await this.$axios.get('/reporte/asig-espera')

        // Agrupar los datos por servicio
        const reportesPorServicio = data.reduce((acc, item, index) => {
          const equipos = item.listEquipos.split(', ')
          const series = item.listNoSerie.split(', ')
          const imeis = item.listNoIMEI.split(', ')
          const puks = item.listPUK.split(', ')
          const pins = item.listPIN.split(', ')

          const comercioRow = {
            nro: index + 1,
            servicio: item.servicio,
            tipoComercio: item.tipoComercio,
            nomComercio: item.nomComercio,
            nombreContacto: item.nombreContacto,
            numTienda: item.numTienda,
            numUsuario: item.numUsuario,
            direccion: item.direccion,
            ciudad: item.ciudad,
            tipoProblema: item.tipoProblema,
            interpretacion: item.interpretacion,
          }

          const equipoRows = equipos.map((equipo, i) => ({
            equipo,
            serie: series[i] || 'N/A',
            imei: imeis[i] || 'N/A',
            pin: pins[i] || 'N/A',
            puk: puks[i] || 'N/A',
          }))

          if (!acc[item.servicio]) {
            acc[item.servicio] = []
          }

          acc[item.servicio].push({ comercioRow, equipoRows })
          return acc
        }, {})


        const doc = new jsPDF({ orientation: 'landscape' })

        // Añadir el logo en tamaño grande
        const logo = new Image()
        logo.src = '/Logo.jpg'
        const logoWidth = 100 // Ancho ajustado del logo
        const logoHeight = 40 // Alto ajustado del logo
        const logoX = 14 // Posición X del logo
        const logoY = 10 // Posición Y del logo
        doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight)

        // Posicionar la información de la empresa a la derecha del logo
        const textStartX = logoX + logoWidth + 20 // Posición X de los textos después del logo
        const textStartY = logoY + 12 // Posición Y inicial de los textos

        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text('TECNOLOGÍA Y SERVICIOS DIVERSOS - TECNOSERD', textStartX, textStartY)

        doc.setFontSize(12) // Fuente más pequeña para los demás textos
        doc.text('Oficina: ', textStartX, textStartY + 6)
        doc.setFont('helvetica', 'normal')
        doc.text('OFICINA PRINCIPAL', textStartX + 18, textStartY + 6)

        doc.setFont('helvetica', 'bold')
        doc.text('Teléfono: ', textStartX, textStartY + 12)
        doc.setFont('helvetica', 'normal') // Cambiado a 'normal' antes del número de teléfono
        doc.text('+504 9976-3205', textStartX + 18, textStartY + 12)

        doc.setFont('helvetica', 'bold')
        doc.text('Email: ', textStartX, textStartY + 18) // Cambiado el valor de textStartY
        doc.setFont('helvetica', 'normal')
        doc.text('jorcer27@gmail.com', textStartX + 18, textStartY + 18) // Cambiado el valor de textStartY y textStartX

        doc.setFont('helvetica', 'bold')
        doc.text('Dirección: ', textStartX, textStartY + 24) // Ajustado para que esté debajo del email
        doc.setFont('helvetica', 'normal')
        doc.text('COL. PALMIRA 3RA AVE ENTRE 4TA Y 5TA CALLE CASA #415', textStartX + 18, textStartY + 24) // Ajustado para que esté debajo del email

        // Añadir el título del reporte debajo del logo y la información
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Reporte sobre Asignaciones en Espera', 14, textStartY + 38)

        // Encabezados para la información del comercio y equipos
        const comercioHeaders = [
          'N°', 'Tipo de Comercio', 'Nombre de Comercio', 'Nombre de Contacto', 'N° de Tienda',
          'N° de Usuario', 'Dirección del Comercio', 'Ciudad del Comercio', 'Tipo de Problema', 'Interpretación'
        ]

        const equipoHeaders = ['Equipo', 'N° de Serie', 'N° de IMEI', 'N° de PIN', 'N° de PUK']

        let startY = textStartY + 50 

        // Iterar sobre cada grupo de servicio
        Object.keys(reportesPorServicio).forEach(servicio => {
          // Añadir el título del servicio
          doc.setFontSize(12)
          doc.setFont('helvetica', 'bold')
          doc.text(servicio, 14, startY)
          startY += 10

          // Añadir las tablas para cada comercio y sus equipos
          reportesPorServicio[servicio].forEach(({ comercioRow, equipoRows }) => {
            // Tabla de información del comercio
            doc.autoTable({
              head: [comercioHeaders],
              body: [[
                comercioRow.nro, comercioRow.tipoComercio, comercioRow.nomComercio, comercioRow.nombreContacto,
                comercioRow.numTienda, comercioRow.numUsuario, comercioRow.direccion, comercioRow.ciudad,
                comercioRow.tipoProblema, comercioRow.interpretacion
              ]],
              startY,
              styles: {
                halign: 'center',
                valign: 'middle',
                fontSize: 9,
                cellPadding: 1,
              },
              headStyles: {
                fillColor: [240, 240, 240],
                fontSize: 10,
              },
              theme: 'plain',
            })

            startY = doc.autoTable.previous.finalY + 2

            // Tabla de equipos con sus detalles
            doc.autoTable({
              head: [equipoHeaders],
              body: equipoRows.map(equipo => [
                equipo.equipo, equipo.serie, equipo.imei, equipo.pin, equipo.puk
              ]),
              startY,
              styles: {
                halign: 'center',
                valign: 'middle',
                fontSize: 9,
                cellPadding: 1,
              },
              headStyles: {
                fillColor: [220, 220, 220],
                fontSize: 10,
              },
              theme: 'plain',
            })

            startY = doc.autoTable.previous.finalY + 10 // Espacio entre bloques de comercio
          })
        })


        // Obtener la fecha y hora actuales en el formato deseado
        const fechaActual = new Date().toLocaleDateString().replace(/\//g, '-')

        // Convertir la hora al formato de 12 horas con AM/PM y separador de punto sin espacio
        const now = new Date()
        let horas = now.getHours()
        const minutos = now.getMinutes().toString().padStart(2, '0')
        const ampm = horas >= 12 ? 'PM' : 'AM'
        horas = horas % 12 || 12 // Convertir a formato de 12 horas, donde 0 se convierte en 12

        // Formatear la hora sin espacio antes de AM/PM
        const horaActual = `${horas}.${minutos}${ampm}`

        // Guardar el PDF con el nombre personalizado usando - para fecha y punto para la hora
        doc.save(`reporte_asignaciones_espera-${fechaActual}-${horaActual}.pdf`)

      } catch (error) {
        console.error('Error generating report:', error)
        this.showSnackbar('Error generando el reporte', 'error')
      }
    },
    fetchAsignacion() {
      this.$axios
        .get('/asignacion/s/1')
        .then((response) => {
          this.espera = response.data
        })
        .catch((error) => {
          console.error('Error fetching asignación:', error)
        })
    },
    fetchAsignacionPendiente() {
      this.$axios
        .get('/asignacionTecnico/at/2')
        .then((response) => {
          this.pendiente = response.data
        })
        .catch((error) => {
          console.error('Error fetching asignación:', error)
        })
    },
    fetchAsignacionProceso() {
      this.$axios
        .get('/asignacionTecnico/at/3')
        .then((response) => {
          this.proceso = response.data
        })
        .catch((error) => {
          console.error('Error fetching asignación:', error)
        })
    },
    fetchAsignacionFinalizada() {
      this.$axios
        .get('/asignacionTecnico/at/4')
        .then((response) => {
          this.finalizado = response.data
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
      this.selectedItems = []; // Limpiar selectedItems después de una operación exitosa
      this.fetchAsignacion()
      this.fetchAsignacionPendiente()
      this.fetchAsignacionFinalizada()
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
    DetalleAsignacionPendiente,
    DetalleAsignacionProceso,
    DetalleAsignacionFinalizada,
  },
}
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
