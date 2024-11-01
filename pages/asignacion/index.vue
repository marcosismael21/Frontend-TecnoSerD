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
          <v-data-table :headers="headers" v-model="se" :items="asignacion" :search="search" show-select>
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
        </v-card>
      </v-col>
    </v-row>


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

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top>
      {{ snackbarMessage }}
    </v-snackbar>

  </v-container>
</template>

<script>
import CrearAsignacion from '~/pages/asignacion/crearAsignacion.vue'
import DetalleAsignacion from '~/pages/asignacion/detalleAsignacion.vue'
import EditarAsignacion from '~/pages/asignacion/editarAsignacion.vue'
import AsignacionTecnico from '~/pages/asignacion/crearAsignacionTecnico.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/asignacion')
      return { asignacion: data }
    } catch (error) {
      console.error('Error fetching asignacion:', error)
      return { asignacion: [] }
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
      se: [],
      search: '',
      asignacion: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: "Comercio", value: "nomComerio" },
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
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadAsignacion() {
      try {
        const { data } = await this.$axios.get('/asignacion')
        this.asignacion = data
      } catch (error) {
        console.error('Error fetching comodin:', error)
        this.comodin = []
      }
    },
    nuevaAsignacion() {
      this.dialogNuevaAsignacion = true
    },
    editarAsignacion(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.asignacion.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogEditarAsignacion = true
    },
    detallesAsignacion(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.asignacion.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogDetalleAsignacion = true
    },
    asignarTecnico(idComercio, idServicio, idEstado) {
      this.asignacionSeleccionada = this.asignacion.find(
        (e) => e.idComercio === idComercio
          && e.idServicio === idServicio
          && e.idEstado === idEstado) || {}
      this.dialogasignarTecnico = true
    },
    fetchAsignacion() {
      this.$axios
        .get('/asignacion')
        .then((response) => {
          this.asignacion = response.data
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
    AsignacionTecnico
  },
}
</script>
