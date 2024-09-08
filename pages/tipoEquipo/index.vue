<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card flat>
            <v-card-title class="d-flex align-center pe-2">
              <v-icon icon="mdi-laptop"></v-icon> &nbsp; Lista de Tipo de Equipos
              <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-subtitle>
              <v-row>
                <v-col cols="3">
                  <v-btn color="primary" @click="nuevoTipoEquipo">
                    <v-icon left>mdi-plus</v-icon>
                    Añadir Tipo de Equipo
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
                  ></v-text-field>
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
                <v-icon>{{ item.estado ? 'mdi-check' : 'mdi-close' }}</v-icon>
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
                <nuevo-tipo-equipo @close="dialogNuevoTipoEquipo = false" @saved="fetchTiposEquipo"></nuevo-tipo-equipo>
      </v-dialog>
  
      <!--v-dialog-- v-model="dialogEditarTipoEquipo" max-width="600px">
        <editar-tipo-equipo :id="tipoEquipoSeleccionado.id" @close="dialogEditarTipoEquipo = false" @saved="fetchTiposEquipo"></editar-tipo-equipo>
      </-v-dialog-->
    </v-container>
  </template>
  
  <script>
  import NuevoTipoEquipo from '~/pages/tipoEquipo/crearTipoEquipo.vue';
// import EditarTipoEquipo from '~/pages/tipoEquipo/editarTipoEquipo.vue';
  
  export default {
    async asyncData({ $axios }) {
      try {
        const { data } = await $axios.get('/tipoEquipo');
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
          { text: 'ID Proveedor', value: 'idProveedor' },
          { text: 'Estado', value: 'estado' },
          { text: 'Acciones', value: 'acciones' },
        ],
        dialogNuevoTipoEquipo: false,
        dialogEditarTipoEquipo: false,
        tipoEquipoSeleccionado: null,
      };
    },
    methods: {
      nuevoTipoEquipo() {
        this.dialogNuevoTipoEquipo = true;
      },
      editarTipoEquipo(id) {
        this.tipoEquipoSeleccionado = this.tiposEquipo.find((te) => te.id === id) || {};
        this.dialogEditarTipoEquipo = true;
      },
      eliminarTipoEquipo(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este tipo de equipo?')) {
          this.$axios
            .delete(`/tipoEquipo/${id}`)
            .then(() => {
              this.tiposEquipo = this.tiposEquipo.filter((tipo) => tipo.id !== id);
            })
            .catch((error) => {
              console.error('Error eliminando tipo de equipo:', error);
            });
        }
      },
      fetchTiposEquipo() {
        this.$axios
          .get('/tipoEquipo')
          .then((response) => {
            this.tiposEquipo = response.data;
          })
          .catch((error) => {
            console.error('Error fetching tipos de equipo:', error);
          });
      },
    },
    components: {
     NuevoTipoEquipo,
    //  EditarTipoEquipo,
   },
  };
  </script>
  