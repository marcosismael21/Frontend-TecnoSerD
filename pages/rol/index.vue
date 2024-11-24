<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Roles
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="regresar">
                  <v-icon left>mdi-arrow-collapse-left</v-icon>
                  Regresar
                </v-btn>
                <v-btn color="primary" @click="nuevoRol">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Rol
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

          <v-data-table :headers="headers" :items="rol" :search="search">
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
              <v-btn icon @click="editarRol(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarRol(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialogos para crear Ciudad-->

    <v-dialog v-model="dialogNuevoRol" max-width="600px" persistent>
      <nuevo-rol @close="dialogNuevoRol = false" @saved="onSuccess" @error="onError"></nuevo-rol>
    </v-dialog>

    <v-dialog v-model="dialogEditarRol" max-width="600px" persistent>
      <editar-rol :id="rolSeleccionada.id" @close="dialogEditarRol = false" @saved="onSuccess"
        @error="onError"></editar-rol>
    </v-dialog>

    <!--Dialos de eliminar-->

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este rol?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando rol...</v-card-title>
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
import NuevoRol from '~/pages/rol/crearRol.vue'
import EditarRol from '~/pages/rol/editarRol.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/rol')
      return { rol: data }
    } catch (error) {
      console.error('Error fetching rol:', error)
      return { rol: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadRol()
      }
    },
  },
  data() {
    return {
      tab: 0, // inicializamos el tab en 0
      search: '',
      rol: [],
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
      dialogNuevoRol: false,
      dialogEditarRol: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      rolSeleccionada: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadRol() {
      try {
        const { data } = await this.$axios.get('/rol')
        this.rol = data
      } catch (error) {
        console.error('Error fetching rol:', error)
        this.rol = []
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find(
        (option) => option.value === estado
      )
      return estadoOption ? estadoOption.text : ''
    },
    nuevoRol() {
      this.dialogNuevoRol = true
    },
    editarRol(id) {
      this.rolSeleccionada = this.rol.find((e) => e.id === id) || {}
      this.dialogEditarRol = true
    },
    eliminarRol(id) {
      this.rolSeleccionada = this.rol.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/rol/${this.rolSeleccionada.id}`)
        .then((response) => {
          this.rol = this.rol.filter((roles) => roles.id !== this.rolSeleccionada.id);

          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando el rol";
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
      this.fetchRoles()
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    fetchRoles() {
      this.$axios
        .get('/rol')
        .then((response) => {
          this.rol = response.data
        })
        .catch((error) => {
          console.error('Error fetching rol:', error)
        })
    },
    regresar() {
      this.$router.push('usuarios')
    },
  },
  components: {
    NuevoRol,
    EditarRol,
  },
}
</script>
