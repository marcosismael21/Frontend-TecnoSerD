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
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" flat hide-details single-line>
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

    <v-dialog v-model="dialogNuevoComercio" max-width="700px">
      <nuevo-comercio @close="dialogNuevoComercio = false" @saved="fetchComercios"></nuevo-comercio>
    </v-dialog>

    <v-dialog v-model="dialogEditarComercio" max-width="700px">
      <editar-comercio :id="comercioSeleccionada.id" @close="dialogEditarComercio = false"
        @saved="fetchComercios"></editar-comercio>
    </v-dialog>

    <v-dialog v-model="dialogDetalleComercio" max-width="700px">
      <detalle-comercio :id="comercioSeleccionada.id" @close="dialogDetalleComercio = false"></detalle-comercio>
    </v-dialog>

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este comercio?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando comercio...</v-card-title>
        <v-card-subtitle>
          <v-row align="center" class="ma-0 pa-0">
            <v-col cols="12" class="d-flex align-center">
              <v-alert v-if="alertMessage" :type="alertType" dismissible>
                {{ alertMessage }}
              </v-alert>
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
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      comercioSeleccionada: false,
      alertMessage: '',
      alertType: '',
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
      this.comercioSeleccionada = this.comercio.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/comercio/${this.comercioSeleccionada.id}`)
        .then(response => {
          const message = response.data.message || 'Error al eliminar este comercio'
          this.setAlert(message, "error");
          this.comercio = this.comercio.filter((comercio) => comercio.id !== this.comercioSeleccionada.id);
        })
        .catch((error) => {
          console.error("Error eliminando el comercio:", error);
          const message =  'Error al eliminar este comercio'
          this.setAlert(message, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
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
    setAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
    },
  },
  components: {
    NuevoComercio,
    EditarComercio,
    DetalleComercio,
  },
}
</script>