<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Ciudades
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row>
              <v-col cols="9">
                <v-btn color="primary" @click="nuevoCiudad">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Ciudad
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

          <v-data-table :headers="headers" :items="ciudad" :search="search">
            <template v-slot:item.nro="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.nombre="{ item }">
              {{ item.nombre }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ getEstadoText(item.estado) }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="editarCiudad(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarCiudad(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialogos para crear Ciudad-->

    <v-dialog v-model="dialogNuevoCiudad" max-width="600px" persistent>
      <nuevo-ciudad @close="dialogNuevoCiudad = false" @saved="onSuccess" @error="onError"></nuevo-ciudad>
    </v-dialog>

    <v-dialog v-model="dialogEditarCiudad" max-width="600px" persistent>
      <editar-ciudad :id="ciudadSeleccionada.id" @close="dialogEditarCiudad = false" @saved="onSuccess"
        @error="onError"></editar-ciudad>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta ciudad?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando ciudad...</v-card-title>
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
import NuevoCiudad from '~/pages/ciudad/crearCiudad.vue'
import EditarCiudad from '~/pages/ciudad/editarCiudad.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/ciudad')
      return { ciudad: data }
    } catch (error) {
      console.error('Error fetching ciudad:', error)
      return { ciudad: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadCiudad()
      }
    },
  },
  data() {
    return {
      search: '',
      ciudad: [],
      headers: [
        { text: 'N°', value: 'nro' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acciones', value: 'acciones' },
      ],
      estadoOptions: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      //variables para activar los modales
      dialogNuevoCiudad: false,
      dialogEditarCiudad: false,
      ciudadSeleccionada: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadCiudad() {
      try {
        const { data } = await this.$axios.get('/ciudad')
        this.ciudad = data
      } catch (error) {
        console.error('Error fetching ciudad:', error)
        this.ciudad = []
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find(
        (option) => option.value === estado
      )
      return estadoOption ? estadoOption.text : ''
    },
    nuevoCiudad() {
      this.dialogNuevoCiudad = true
    },
    editarCiudad(id) {
      this.ciudadSeleccionada = this.ciudad.find((e) => e.id === id) || {}
      this.dialogEditarCiudad = true
    },
    eliminarCiudad(id) {
      this.ciudadSeleccionada = this.ciudad.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/ciudad/${this.ciudadSeleccionada.id}`)
        .then((response) => {
          this.ciudad = this.ciudad.filter((ciudad) => ciudad.id !== this.ciudadSeleccionada.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando la ciudad";
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
      this.fetchCiudads()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    fetchCiudads() {
      this.$axios
        .get('/ciudad')
        .then((response) => {
          this.ciudad = response.data
        })
        .catch((error) => {
          console.error('Error fetching ciudades:', error)
        })
    },
  },
  components: {
    NuevoCiudad,
    EditarCiudad,
  },
}
</script>
