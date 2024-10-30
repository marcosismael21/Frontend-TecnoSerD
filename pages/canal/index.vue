<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Canales
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="nuevoCanal">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Canal
                </v-btn>
              </v-col>

              <v-col cols="3">
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" hide-details single-line>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-data-table :headers="headers" :items="canal" :search="search">
            <template v-slot:item.nro="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.nombre="{ item }">
              {{ item.nombre }}
            </template>
            <template v-slot:item.idTipoComercio="{ item }">
              {{ item.idTipoComercio }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ getEstadoText(item.estado) }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="detalleCanal(item.id)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon @click="editarCanal(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarCanal(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialogos para crear Ciudad-->

    <v-dialog v-model="dialogNuevoCanal" max-width="600px" persistent>
      <nuevo-canal @close="dialogNuevoCanal = false" @saved="onSuccess" @error="onError"></nuevo-canal>
    </v-dialog>

    <v-dialog v-model="dialogEditarCanal" max-width="600px" persistent>
      <editar-canal :id="canalSeleccionada.id" @close="dialogEditarCanal = false" @saved="onSuccess"
        @error="onError"></editar-canal>
    </v-dialog>

    <v-dialog v-model="dialogDetalleCanal" max-width="600px" persistent>
      <detalle-canal :id="canalSeleccionada.id" @close="dialogDetalleCanal = false"></detalle-canal>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este canal?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando canal...</v-card-title>
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

import NuevoCanal from "~/pages/canal/crearCanal.vue"
import EditarCanal from "~/pages/canal/editarCanal.vue"
import DetalleCanal from "~/pages/canal/detalleCanal.vue"

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get("/canal")
      return { canal: data }
    } catch (error) {
      console.error("Error fetching canal:", error)
      return { canal: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadCanal();
      }
    },
  },
  data() {
    return {
      search: "",
      canal: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: "Nombre", value: "nombre" },
        { text: "Tipo de Comercio", value: "idTipoComercio" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      estadoOptions: [
        { text: "Activo", value: 1 },
        { text: "Inactivo", value: 0 },
      ],
      //variables para activar los modales
      dialogNuevoCanal: false,
      dialogEditarCanal: false,
      dialogDetalleCanal: false,
      canalSeleccionada: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    };
  },
  methods: {
    async loadCanal() {
      try {
        const { data } = await this.$axios.get("/canal");
        this.canal = data;
      } catch (error) {
        console.error("Error fetching canal:", error);
        this.canal = [];
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find((option) => option.value === estado)
      return estadoOption ? estadoOption.text : ""
    },
    nuevoCanal() {
      this.dialogNuevoCanal = true
    },
    editarCanal(id) {
      this.canalSeleccionada = this.canal.find((e) => e.id === id) || {}
      this.dialogEditarCanal = true
    },
    detalleCanal(id) {
      this.canalSeleccionada = this.canal.find((e) => e.id === id) || {}
      this.dialogDetalleCanal = true
    },
    eliminarCanal(id) {
      this.canalSeleccionada = this.canal.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/canal/${this.canalSeleccionada.id}`)
        .then((response) => {
          this.canal = this.canal.filter((canal) => canal.id !== this.canalSeleccionada.id);

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
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    onSuccess(message) {
      // Mostrar el snackbar con un mensaje de éxito
      this.showSnackbar(message, 'success');
      this.fetchCanal()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    fetchCanal() {
      this.$axios
        .get("/canal")
        .then((response) => {
          this.canal = response.data;
        })
        .catch((error) => {
          console.error("Error fetching canal:", error);
        });
    },
  },
  components: {
    NuevoCanal,
    EditarCanal,
    DetalleCanal
  },
};
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
