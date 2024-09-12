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
              <v-col cols="3">
                <v-btn color="primary" @click="nuevoCiudad">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Ciudad
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" flat hide-details single-line>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-data-table :headers="headers" :items="ciudad" :search="search">
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

    <v-dialog v-model="dialogNuevoCiudad" max-width="600px">
      <nuevo-ciudad @close="dialogNuevoCiudad = false" @saved="fetchCiudads"></nuevo-ciudad>
    </v-dialog>

    <v-dialog v-model="dialogEditarCiudad" max-width="600px">
      <editar-ciudad :id="ciudadSeleccionada.id" @close="dialogEditarCiudad = false"
        @saved="fetchCiudads"></editar-ciudad>
    </v-dialog>
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
        { text: 'ID', value: 'id' },
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
      if (confirm('¿Estás seguro de que quieres eliminar este Ciudad?')) {
        this.$axios
          .delete(`/ciudad/${id}`)
          .then(() => {
            this.ciudad = this.ciudad.filter((ciudads) => ciudads.id !== id)
          })
          .catch((error) => {
            console.error('Error eliminando al Ciudad:', error)
          })
      }
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