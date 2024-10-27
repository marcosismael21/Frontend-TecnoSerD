<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Regalias
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="nuevaRegalia">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Regalia
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

          <v-data-table :headers="headers" :items="regalia" :search="search">
            <template v-slot:item.nro="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.nombre="{ item }">
              {{ item.nombre }}
            </template>
            <template v-slot:item.idTipoComercio="{ item }">
              {{ item.idTipoComercio }}
            </template>
            <template v-slot:item.cantidad="{ item }">
              {{ item.cantidad }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ getEstadoText(item.estado) }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="detalleRegalia(item.id)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon @click="editarRegalia(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarRegalia(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialogos para crear Ciudad-->

    <v-dialog v-model="dialogNuevaRegalia" max-width="600px" persistent>
      <nueva-regalia @close="dialogNuevaRegalia = false" @saved="onSuccess" @error="onError">
      </nueva-regalia>
    </v-dialog>

    <v-dialog v-model="dialogEditarRegalia" max-width="600px" persistent>
      <editar-regalia :id="regaliaSeleccionada.id" @close="dialogEditarRegalia = false" @saved="onSuccess"
        @error="onError"></editar-regalia>
    </v-dialog>

    <v-dialog v-model="dialogDetalleRegalia" max-width="600px" persistent>
      <detalle-regalia :id="regaliaSeleccionada.id" @close="dialogDetalleRegalia = false"></detalle-regalia>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta regalia?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando regalia...</v-card-title>
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

import NuevaRegalia from "~/pages/regalia/crearRegalia.vue"
import EditarRegalia from "~/pages/regalia/editarRegalia.vue"
import DetalleRegalia from "~/pages/regalia/detalleRegalia.vue"

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get("/pubreg")
      return { regalia: data }
    } catch (error) {
      console.error("Error fetching regalia:", error)
      return { regalia: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadRegalia();
      }
    },
  },
  data() {
    return {
      search: "",
      regalia: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: "Nombre", value: "nombre" },
        { text: "Tipo de Comercio", value: "idTipoComercio" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      estadoOptions: [
        { text: "Activo", value: 1 },
        { text: "Inactivo", value: 0 },
      ],
      //variables para activar los modales
      dialogNuevaRegalia: false,
      dialogEditarRegalia: false,
      dialogDetalleRegalia: false,
      regaliaSeleccionada: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    };
  },
  methods: {
    async loadRegalia() {
      try {
        const { data } = await this.$axios.get("/pubreg");
        this.regalia = data;
      } catch (error) {
        console.error("Error fetching regalia:", error);
        this.regalia = [];
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find((option) => option.value === estado)
      return estadoOption ? estadoOption.text : ""
    },
    nuevaRegalia() {
      this.dialogNuevaRegalia = true
    },
    editarRegalia(id) {
      this.regaliaSeleccionada = this.regalia.find((e) => e.id === id) || {}
      this.dialogEditarRegalia = true
    },
    detalleRegalia(id) {
      this.regaliaSeleccionada = this.regalia.find((e) => e.id === id) || {}
      this.dialogDetalleRegalia = true
    },
    eliminarRegalia(id) {
      this.regaliaSeleccionada = this.regalia.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/pubreg/${this.regaliaSeleccionada.id}`)
        .then((response) => {
          // Filtrar las regalías eliminadas
          this.regalia = this.regalia.filter((regalias) => regalias.id !== this.regaliaSeleccionada.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando la regalia";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 2 segundos
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
      this.fetchRegalias(); // Recargar las regalías
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    fetchRegalias() {
      this.$axios
        .get("/pubreg")
        .then((response) => {
          this.regalia = response.data;
        })
        .catch((error) => {
          console.error("Error fetching regalia:", error);
        });
    },
  },
  components: {
    NuevaRegalia,
    EditarRegalia,
    DetalleRegalia
  },
};
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
