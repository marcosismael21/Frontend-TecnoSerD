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

    <v-dialog v-model="dialogNuevoRol" max-width="600px">
      <nuevo-rol
        @close="dialogNuevoRol = false"
        @saved="fetchRoles"
      ></nuevo-rol>
    </v-dialog>

    
    
    <v-dialog v-model="dialogEditarRol" max-width="600px">
      <editar-rol
        :id="rolSeleccionada.id"
        @close="dialogEditarRol = false"
        @saved="fetchRoles"
      ></editar-rol>
    </v-dialog>
    
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
      rolSeleccionada: false,
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
      if (confirm('¿Estás seguro de que quieres eliminar este Rol?')) {
        this.$axios
          .delete(`/rol/${id}`)
          .then(() => {
            this.rol = this.rol.filter((roles) => roles.id !== id)
          })
          .catch((error) => {
            console.error('Error eliminando Rol:', error)
          })
      }
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
