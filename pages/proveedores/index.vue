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
              <v-col cols="3">
                <v-btn color="primary" @click="nuevoProveedor">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Proveedor
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  density="compact"
                  label="Buscar"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  flat
                  hide-details
                  single-line
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-data-table :headers="headers" :items="proveedores" :search="search">
            <template v-slot:item.id="{ item }">
              {{ item.id }}
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
      <nuevo-proveedor
        @close="dialogNuevoProveedor = false"
        @saved="fetchProveedores"
      ></nuevo-proveedor>
    </v-dialog>

    <v-dialog v-model="dialogEditarProveedor" max-width="600px">
      <editar-proveedor
        :id="proveedorSeleccionado.id"
        @close="dialogEditarProveedor = false"
        @saved="fetchProveedores"
      ></editar-proveedor>
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
        { text: 'ID', value: 'id' },
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
      if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
        this.$axios
          .delete(`/proveedor/${id}`)
          .then(() => {
            this.proveedores = this.proveedores.filter((proveedor) => proveedor.id !== id)
          })
          .catch((error) => {
            console.error('Error eliminando al proveedor:', error)
          })
      }
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
