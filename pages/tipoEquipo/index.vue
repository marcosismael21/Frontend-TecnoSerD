<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-laptop"></v-icon> &nbsp; Lista de Tipo de Equipos
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row>
              <v-col cols="9">
                <v-btn color="primary" @click="regresar">
                  <v-icon left>mdi-arrow-collapse-left</v-icon>
                  Regresar
                </v-btn>
                <v-btn color="primary" @click="nuevoTipoEquipo">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Tipo de Equipo
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                  variant="outlined" flat hide-details single-line></v-text-field>
              </v-col>
            </v-row>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-data-table :headers="headers" :items="tiposEquipo" :search="search">
            <template v-slot:item.id="{ item }">
              {{ item.id }}
            </template>
            <template v-slot:item.nombre="{ item }">
              {{ item.nombre }}
            </template>
            <template v-slot:item.idProveedor="{ item }">
              {{ item.idProveedor }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ getEstadoText(item.estado) }}
            </template>
            <template v-slot:item.acciones="{ item }">
              <v-btn icon @click="editarTipoEquipo(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="eliminarTipoEquipo(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogos para crear y editar Tipo de Equipo -->

    <v-dialog v-model="dialogNuevoTipoEquipo" max-width="600px">
      <nuevo @close="dialogNuevoTipoEquipo = false" @saved="fetchTiposEquipo"></nuevo>
    </v-dialog>

    <v-dialog v-model="dialogEditarTipoEquipo" max-width="600px">
      <editar :id="tipoEquipoSeleccionado.id" @close="dialogEditarTipoEquipo = false" @saved="fetchTiposEquipo">
      </editar>
    </v-dialog>

     <!-- Diálogos eliminar -->

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este equipo?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Eliminando equipo...</v-card-title>
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
import Nuevo from '~/pages/tipoEquipo/crear.vue';
import Editar from '~/pages/tipoEquipo/editar.vue';

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/tipoequipo');
      return { tiposEquipo: data };
    } catch (error) {
      console.error('Error fetching tipos de equipo:', error);
      return { tiposEquipo: [] };
    }
  },
  data() {
    return {
      search: '',
      tiposEquipo: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Proveedor', value: 'idProveedor' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acciones', value: 'acciones' },
      ],
      estadoOptions: [
        { text: 'Activo', value: 1 },
        { text: 'Inactivo', value: 0 },
      ],
      dialogNuevoTipoEquipo: false,
      dialogEditarTipoEquipo: false,
      dialogEliminar: false,
      dialogEliminarConfirm: false,
      tipoEquipoSeleccionado: false,
    };
  },
  methods: {
    nuevoTipoEquipo() {
      this.dialogNuevoTipoEquipo = true;
    },
    editarTipoEquipo(id) {
      this.tipoEquipoSeleccionado = this.tiposEquipo.find((e) => e.id === id) || {};
      this.dialogEditarTipoEquipo = true;
    },
    eliminarTipoEquipo(id) {
      this.tipoEquipoSeleccionado = this.tiposEquipo.find((e) => e.id === id) || {};
      this.dialogEliminarConfirm = true;
    },
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      this.$axios
        .delete(`/tipoequipo/${this.tipoEquipoSeleccionado.id}`)
        .then(() => {
          this.tiposEquipo = this.tiposEquipo.filter((tiposEquipo) => tiposEquipo.id !== this.tipoEquipoSeleccionado.id);
        })
        .catch((error) => {
          console.error("Error eliminando el tipos de equipo:", error);
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
          }, 2000);
        });
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find(option => option.value === estado);
      return estadoOption ? estadoOption.text : '';
    },
    fetchTiposEquipo() {
      this.$axios
        .get('/tipoequipo')
        .then((response) => {
          this.tiposEquipo = response.data;
        })
        .catch((error) => {
          console.error('Error fetching tipos de equipo:', error);
        });
    },
    regresar() {
      this.$router.push('equipos');
    }
  },
  components: {
    Nuevo,
    Editar
  },
};
</script>