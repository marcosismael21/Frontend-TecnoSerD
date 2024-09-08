<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center pe-2">
              <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Comercios
              <v-spacer></v-spacer>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-divider></v-divider>
            <v-card-subtitle>
              <v-row>
                <v-col cols="9">
                  <v-btn color="primary" @click="nuevoComercio">
                    <v-icon left>mdi-plus</v-icon>
                    Añadir Comercio
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
  
            <v-data-table :headers="headers" :items="comercio" :search="search">
              <template v-slot:item.nro="{ index }">
                {{ index + 1 }}
              </template>
              <template v-slot:item.nombreComercio="{ item }">
                {{ item.nombreComercio }}
              </template>
              <template v-slot:item.nombreContacto="{ item }">
                {{ item.nombreContacto }}
              </template>
              <template v-slot:item.idCiudad="{ item }">
                {{ item.idCiudad }}
              </template>
              <template v-slot:item.idTipoComercio="{ item }">
                {{ item.idTipoComercio }}
              </template>
              <template v-slot:item.acciones="{ item }">
                <v-btn icon @click="detalleComercio(item.id)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon @click="editarComercio(item.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="eliminarComercio(item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <!-- Dialogos para crear Ciudad-->
  
      <v-dialog v-model="dialogNuevoComercio" max-width="600px">
        <nuevo-comercio
          @close="dialogNuevoComercio = false"
          @saved="fetchComercios"
        ></nuevo-comercio>
      </v-dialog>
  
      <v-dialog v-model="dialogEditarComercio" max-width="600px">
        <editar-comercio
          :id="comercioSeleccionada.id"
          @close="dialogEditarComercio = false"
          @saved="fetchComercios"
        ></editar-comercio>
      </v-dialog>

      <v-dialog v-model="dialogDetalleComercio" max-width="600px">
        <detalle-comercio
          :id="comercioSeleccionada.id"
          @close="dialogDetalleComercio = false"
        ></detalle-comercio>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import NuevoComercio from '~/pages/comercio/crearComercio.vue'
  import EditarComercio from '~/pages/comercio/editarComercio.vue'
  import DetalleComercio from '~/pages/comercio/detalleComercio.vue'
  
  export default {
    async asyncData({ $axios }) {
      try {
        const { data } = await $axios.get('/comercio')
        return { comercio: data }
      } catch (error) {
        console.error('Error fetching comercio:', error)
        return { comercio: [] }
      }
    },
    watch: {
      $route(to, from) {
        if (to.fullPath !== from.fullPath) {
          this.loadComercio()
        }
      },
    },
    data() {
      return {
        tab: 0, // inicializamos el tab en 0
        search: '',
        comercio: [],
        headers: [
          { text: 'N°', value: 'nro' },
          { text: 'Comercio', value: 'nombreComercio' },
          { text: 'Contacto', value: 'nombreContacto' },
          { text: 'Ciudad', value: 'idCiudad' },
          { text: 'Tipo Comercio', value: 'idTipoComercio' },
          { text: 'Acciones', value: 'acciones' },
        ],
        //variables para activar los modales
        dialogNuevoComercio: false,
        dialogEditarComercio: false,
        dialogDetalleComercio: false, 
        comercioSeleccionada: false,
      }
    },
    methods: {
      async loadComercio() {
        try {
          const { data } = await this.$axios.get('/comercio')
          this.comercio = data
        } catch (error) {
          console.error('Error fetching comercio:', error)
          this.comercio = []
        }
      },
      nuevoComercio() {
        this.dialogNuevoComercio = true
      },
      editarComercio(id) {
        this.comercioSeleccionada = this.comercio.find((e) => e.id === id) || {}
        this.dialogEditarComercio = true
      },
      detalleComercio(id) {
        this.comercioSeleccionada = this.comercio.find((e) => e.id === id) || {}
        this.dialogDetalleComercio = true
      },
      eliminarComercio(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este Comercio?')) {
          this.$axios
            .delete(`/comercio/${id}`)
            .then(() => {
              this.comercio = this.comercio.filter((comercios) => comercios.id !== id)
            })
            .catch((error) => {
              console.error('Error eliminando el Comercio:', error)
            })
        }
      },
      fetchComercios() {
        this.$axios
          .get('/comercio')
          .then((response) => {
            this.comercio = response.data
          })
          .catch((error) => {
            console.error('Error fetching comercios:', error)
          })
      },
    },
    components: {
      NuevoComercio,
      EditarComercio,
      DetalleComercio,
    },
  }
  </script>