<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Equipos Comodín
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="nuevoComodin">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Comodín
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
          <v-data-table :headers="headers" :items="comodin" :search="search">
            <template v-slot:item.nro="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.idTipoEquipo="{ item }">
              {{ item.idTipoEquipo }}
            </template>
            <template v-slot:item.noserie="{ item }">
              {{ item.noserie }}
            </template>
            <template v-slot:item.fechaLlegada="{ item }">
              {{ formatDate(item.fechaLlegada) }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ getEstadoText(item.estado) }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="detalleComodin(item.id)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon @click="editarComodin(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarComodin(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="dialogNuevoComodin" max-width="600px" persistent>
      <crear-comodin @close="dialogNuevoComodin = false" @saved="onSuccess" @error="onError"></crear-comodin>
    </v-dialog>

    <v-dialog v-model="dialogEditarComodin" max-width="600px" persistent>
      <editar-comodines :id="comodinSeleccionado.id" @close="dialogEditarComodin = false" @saved="onSuccess"
        @error="onError"></editar-comodines>
    </v-dialog>

    <v-dialog v-model="dialogDetalleComodin" max-width="600px" persistent>
      <ver-detalles-comodin :id="comodinSeleccionado.id" @close="dialogDetalleComodin = false"></ver-detalles-comodin>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este equipo comodín?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando comodín...</v-card-title>
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
import CrearComodin from '~/pages/comodin/crearComodin.vue'
import EditarComodines from '~/pages/comodin/editarComodin.vue'
import VerDetallesComodin from '~/pages/comodin/detalleComodin.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/equipo/comodin/1')
      return { comodin: data }
    } catch (error) {
      console.error('Error fetching comodin:', error)
      return { comodin: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadComodin()
      }
    },
  },
  data() {
    return {
      search: '',
      comodin: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: "Nombre", value: "idTipoEquipo" },
        { text: "N° SERIE", value: "noserie" },
        { text: "Fecha de Ingreso", value: "fechaLlegada" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      estadoOptions: [
        { text: 'Activo', value: 1 },
        { text: 'Inactivo', value: 0 },
      ],
      //variables para activar los modales
      dialogNuevoComodin: false,
      dialogEditarComodin: false,
      dialogDetalleComodin: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      comodinSeleccionado: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadComodin() {
      try {
        const { data } = await this.$axios.get('/equipo/comodin/1')
        this.comodin = data
      } catch (error) {
        console.error('Error fetching comodin:', error)
        this.comodin = []
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find(
        (option) => option.value === estado
      )
      return estadoOption ? estadoOption.text : ''
    },
    nuevoComodin() {
      this.dialogNuevoComodin = true
    },
    editarComodin(id) {
      this.comodinSeleccionado = this.comodin.find((e) => e.id === id) || {}
      this.dialogEditarComodin = true
    },
    detalleComodin(id) {
      this.comodinSeleccionado = this.comodin.find((e) => e.id === id) || {}
      this.dialogDetalleComodin = true
    },
    eliminarComodin(id) {
      this.comodinSeleccionado = this.comodin.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/equipo/${this.comodinSeleccionado.id}`)
        .then((response) => {
          this.comodin = this.comodin.filter((comodines) => comodines.id !== this.comodinSeleccionado.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando el comodín";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    onSuccess(message) {
      // Mostrar el snackbar con un mensaje de éxito
      this.showSnackbar(message, 'success');
      this.fetchComodin()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    formatDate(fechaLlegada) {
      return fechaLlegada ? new Date(fechaLlegada).toISOString().slice(0, 10) : '';
    },
    fetchComodin() {
      this.$axios
        .get('/equipo/comodin/1')
        .then((response) => {
          this.comodin = response.data
        })
        .catch((error) => {
          console.error('Error fetching comodin:', error)
        })
    },
  },
  components: {
    CrearComodin,
    EditarComodines,
    VerDetallesComodin
  },
}
</script>
