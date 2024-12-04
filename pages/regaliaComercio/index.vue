<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Regalías Asignadas
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="nuevaAsignacion">
                  <v-icon left>mdi-plus</v-icon>
                  Asignar Regalía
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
            <template v-slot:item.nombrePublicidadRegalia="{ item }">
              {{ item.nombrePublicidadRegalia }}
            </template>
            <template v-slot:item.nombreComercio="{ item }">
              {{ item.nombreComercio }}
            </template>
            <template v-slot:item.cantidad="{ item }">
              {{ item.cantidad }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ getEstadoText(item.estado) }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="editarAsignacion(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarAsignacion(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon @click="cambiarEstado(item.id)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogNuevaAsignacion" max-width="600px" persistent>
      <nueva-asignacion @close="dialogNuevaAsignacion = false" @saved="onSuccess" @error="onError"></nueva-asignacion>
    </v-dialog>

    <v-dialog v-model="dialogEditarRegalia" max-width="600px" persistent>
      <editar-regalia :idre="regaliaSeleccionada.id" @close="dialogEditarRegalia = false" @saved="onSuccess"
        @error="onError"></editar-regalia>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este asignacion de una publidad/regalía?</v-card-text>
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

    <v-dialog v-model="dialogCambioConfirm" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Entrega de Publicidad/Regalía</v-card-title>
        <v-card-text>¿Estás seguro de entregar esta asignacion de una publidad/regalía?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogCambioConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarCambio">Entregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCambio" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Finalizando entrega...</v-card-title>
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
import NuevaAsignacion from "~/pages/regaliaComercio/crearAsignacion.vue"
import EditarRegalia from "~/pages/regaliaComercio/editarAsignacion.vue"

import Cookies from 'js-cookie';

export default {
  async asyncData({ $axios }) {
    const idTecnico = Cookies.get('id')
    try {

      const { data } = await $axios.get(`/pubcli/publi/${idTecnico}`)
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
        { text: "Regalía", value: "nombrePublicidadRegalia" },
        { text: "Comercio", value: "nombreComercio" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Estado", value: "estado" },
        { text: "Acciones", value: "acciones" },
      ],
      estadoOptions: [
        { text: "Entregado", value: 1 },
        { text: "Sin Entregar", value: 0 },
      ],
      //variables para activar los modales
      dialogNuevaAsignacion: false,
      dialogEditarRegalia: false,
      regaliaSeleccionada: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      dialogCambioConfirm: false,
      dialogCambio: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    };
  },
  methods: {
    async loadRegalia() {
      const idTecnico = Cookies.get('id')
      try {
        const { data } = await this.$axios.get(`/pubcli/publi/${idTecnico}`);
        this.regalia = data;
      } catch (error) {
        console.error("Error fetching canal:", error);
        this.regalia = [];
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find((option) => option.value === estado)
      return estadoOption ? estadoOption.text : ""
    },
    nuevaAsignacion() {
      this.dialogNuevaAsignacion = true
    },
    editarAsignacion(id) {
      console.log('Asignación seleccionada:', id)
      this.regaliaSeleccionada = this.regalia.find((e) => e.id === id) || {}
      this.dialogEditarRegalia = true
    },
    cambiarEstado(id) {
      this.asignacionSeleccionada = this.regalia.find((e) => e.id === id) || {};
      this.dialogCambioConfirm = true;  // Mostrar el modal de confirmación
    },
    eliminarAsignacion(id) {
      this.asignacionSeleccionada = this.regalia.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/pubcli/${this.asignacionSeleccionada.id}`)
        .then((response) => {
          this.regalia = this.regalia.filter((regalia) => regalia.id !== this.asignacionSeleccionada.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando esta publicidad/regalía";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    confirmarCambio() {
      this.dialogCambioConfirm = false
      this.dialogCambio = true

      this.$axios
        .patch(`/pubcli/finalizar/${this.asignacionSeleccionada.id}`, { estado: true })
        .then((response) => {
          this.regalia = this.regalia.filter((regalia) => regalia.id !== this.asignacionSeleccionada.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error entragando esta publicidad/regalía";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogCambio = false;  // Cerrar el modal de carga después de 3 segundos
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
      this.fetchRegalias()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    fetchRegalias() {
      const idTecnico = Cookies.get('id')
      this.$axios
        .get(`/pubcli/publi/${idTecnico}`)
        .then((response) => {
          this.regalia = response.data;
        })
        .catch((error) => {
          console.error("Error fetching regalia:", error);
        });
    },
  },
  components: {
    NuevaAsignacion,
    EditarRegalia,
  },
};
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
