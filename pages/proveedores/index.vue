<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Proveedores
            <v-spacer></v-spacer>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row>
              <v-col cols="9">
                <v-btn color="primary" @click="nuevoProveedor">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Proveedor
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

          <v-data-table :headers="headers" :items="proveedores" :search="search">
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
              <v-btn icon @click="editarProveedor(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarProveedor(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Diálogos para crear Proveedor -->

    <v-dialog v-model="dialogNuevoProveedor" max-width="600px">
      <nuevo-proveedor @close="dialogNuevoProveedor = false" @saved="fetchProveedores"></nuevo-proveedor>
    </v-dialog>

    <v-dialog v-model="dialogEditarProveedor" max-width="600px">
      <editar-proveedor :id="proveedorSeleccionado.id" @close="dialogEditarProveedor = false"
        @saved="fetchProveedores"></editar-proveedor>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este proovedor?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando proovedor...</v-card-title>
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

  </v-container>
</template>

<script>
import NuevoProveedor from '~/pages/proveedores/crearProveedor.vue'
import EditarProveedor from '~/pages/proveedores/editarProveedor.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/proveedor')
      return { proveedores: data }
    } catch (error) {
      console.error('Error fetching proveedores:', error)
      return { proveedores: [] }
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadProveedores()
      }
    },
  },
  data() {
    return {
      search: '',
      proveedores: [],
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
      // Variables para activar los modales
      dialogNuevoProveedor: false,
      dialogEditarProveedor: false,
      proveedorSeleccionado: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
    }
  },
  methods: {
    async loadProveedores() {
      try {
        const { data } = await this.$axios.get('/proveedor')
        this.proveedores = data
      } catch (error) {
        console.error('Error fetching proveedores:', error)
        this.proveedores = []
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find(
        (option) => option.value === estado
      )
      return estadoOption ? estadoOption.text : ''
    },
    nuevoProveedor() {
      this.dialogNuevoProveedor = true
    },
    editarProveedor(id) {
      this.proveedorSeleccionado = this.proveedores.find((e) => e.id === id) || {}
      this.dialogEditarProveedor = true
    },
    eliminarProveedor(id) {
      this.proveedorSeleccionado = this.proveedores.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/proveedor/${this.proveedorSeleccionado.id}`)
        .then(() => {
          this.proveedores = this.proveedores.filter((proveedor) => proveedor.id !== this.proveedorSeleccionado.id);
        })
        .catch((error) => {
          console.error("Error eliminando el proveedor:", error);
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    fetchProveedores() {
      this.$axios
        .get('/proveedor')
        .then((response) => {
          this.proveedores = response.data
        })
        .catch((error) => {
          console.error('Error fetching proveedores:', error)
        })
    },
  },
  components: {
    NuevoProveedor,
    EditarProveedor,
  },
}
</script>
