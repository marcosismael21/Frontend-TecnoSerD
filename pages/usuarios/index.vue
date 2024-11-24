<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-account-circle"></v-icon> &nbsp;
            Lista de Colaboradores
          </v-card-title>
          <v-spacer></v-spacer>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row align="center">
              <v-col cols="9">
                <v-btn color="primary" @click="nuevoUsuario">
                  <v-icon left>mdi-plus</v-icon>
                  Añadir Colaborador
                </v-btn>
                <v-btn color="primary" @click="listRoles">
                  <v-icon left>mdi-account-key</v-icon>
                  Roles
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

          <v-tabs v-model="tab" align-tabs="center" class="justify-center" color="deep-purple-accent-4">
            <v-tab :key="1">Colaboradores Habilitados</v-tab>
            <v-tab :key="2">Colaboradores Deshabilitados</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item :key="1">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headers" :items="usuario" :search="search">
                      <template v-slot:item.nro="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-slot:item.nombres="{ item }">
                        {{ item.nombres }}
                      </template>
                      <template v-slot:item.idrol="{ item }">
                        {{ item.idrol }}
                      </template>
                      <template v-slot:item.estado="{ item }">
                        {{ getEstadoText(item.estado) }}
                      </template>
                      <template v-slot:item.acciones="{ item }">
                        <v-btn icon @click="verUsuario(item.id)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="editarUsuario(item.id)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="cambiarEstadoTrue(item.id)">
                          <v-icon>mdi-account-remove</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item :key="2">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-data-table :headers="headers" :items="usuarioFalse" :search="search">
                      <template v-slot:item.nro="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-slot:item.nombres="{ item }">
                        {{ item.nombres }}
                      </template>
                      <template v-slot:item.idrol="{ item }">
                        {{ item.idrol }}
                      </template>
                      <template v-slot:item.estado="{ item }">
                        {{ getEstadoText(item.estado) }}
                      </template>
                      <template v-slot:item.acciones="{ item }">
                        <v-btn icon @click="verUsuarioFalse(item.id)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon @click="editarUsuarioFalse(item.id)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="cambiarEstadoFalse(item.id)">
                          <v-icon>mdi-account-check</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>

        </v-card>
      </v-col>
    </v-row>
    <!-- Dialogos para crear usuario-->
    <v-dialog v-model="dialogNuevoUsuario" max-width="600px" persistent>
      <nuevo-usuario @close="dialogNuevoUsuario = false" @saved="onSuccess" @error="onError"></nuevo-usuario>
    </v-dialog>
    <!-- Dialogos para ver usuario-->
    <v-dialog v-model="dialogDetalleUsuario" max-width="600px" persistent>
      <detalle-usuario :id="usuarioSeleccionado.id" @close="dialogDetalleUsuario = false"></detalle-usuario>
    </v-dialog>
    <!-- Dialogos para editar usuario-->
    <v-dialog v-model="dialogEditarUsuario" max-width="600px" persistent>
      <editar-usuario :id="usuarioSeleccionado.id" @close="dialogEditarUsuario = false" @saved="onSuccess"
        @error="onError"></editar-usuario>
    </v-dialog>

    <!-- Dialog para cambiar el estado a deshabilitados-->

    <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Deshabilitación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas deshabilitar a este colaborador?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogEliminarConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Deshabilitando colaborador...</v-card-title>
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

    <!-- Dialog para cambiar el estado a habilitados-->

    <v-dialog v-model="dialogFalseConfirm" max-width="425" persistent>
      <v-card>
        <v-card-title class="text-h6">Confirmar Habilitación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas habilitar a este colaborador?</v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="dialogFalseConfirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarCambioTrue">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFalse" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Habilitando colaborador...</v-card-title>
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

import NuevoUsuario from '~/pages/usuarios/crearUsuario.vue'
import DetalleUsuario from '~/pages/usuarios/show/[id].vue'
import EditarUsuario from '~/pages/usuarios/editarUsuario.vue'

export default {
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/usuario/uf/1');
      const f = await $axios.get('/usuario/uf/0')
      return { usuario: data, usuarioFalse: f.data };

    } catch (error) {
      console.error('Error fetching usuarios:', error);
      return { usuario: [], usuarioFalse: [] };
    }
  },
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.loadUsuarios()
        this.loadUsuariosFalse()
      }
    }
  },
  data() {
    return {
      tab: 0, // inicializamos el tab en 0
      search: '',
      usuario: [],
      usuarioFalse: [],
      // cabeceras de la tabla
      headers: [
        { text: 'N°', value: 'nro' },
        { text: 'Nombre', value: 'nombres' },
        { text: 'Rol', value: 'idrol' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acciones', value: 'acciones', sortable: false },
      ],
      estadoOptions: [
        { text: 'Habilitado', value: 1 },
        { text: 'Deshabilitado', value: 0 },
      ],
      //variables para activar los modales
      dialogNuevoUsuario: false,
      dialogEditarUsuario: false,
      dialogDetalleUsuario: false,
      dialogEliminar: false,
      dialogFalse: false,
      dialogEliminarConfirm: false,
      dialogFalseConfirm: false,
      usuarioSeleccionado: false,
      // Añadimos estos campos para el snackbar
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: '',  // 'success' o 'error' para diferenciar el tipo de mensaje
    }
  },
  methods: {
    async loadUsuarios() {
      try {
        const { data } = await this.$axios.get('/usuario/uf/1');
        const f = await this.$axios.get('/usuario/uf/0')
        this.usuario = data;
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        this.usuario = [];
      }
    },
    async loadUsuariosFalse() {
      try {
        const { data } = await this.$axios.get('/usuario/uf/0');
        this.usuarioFalse = data;
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        this.usuarioFalse = [];
      }
    },
    getEstadoText(estado) {
      const estadoOption = this.estadoOptions.find(option => option.value === estado);
      return estadoOption ? estadoOption.text : '';
    },
    nuevoUsuario() {
      this.dialogNuevoUsuario = true;
    },
    listRoles() {
      this.$router.push('rol')
    },
    verUsuario(id) {
      this.usuarioSeleccionado = this.usuario.find(e => e.id === id) || {};
      this.dialogDetalleUsuario = true;
    },
    verUsuarioFalse(id) {
      this.usuarioSeleccionado = this.usuarioFalse.find(e => e.id === id) || {};
      this.dialogDetalleUsuario = true;
    },
    editarUsuario(id) {
      this.usuarioSeleccionado = this.usuario.find(e => e.id === id) || {};
      this.dialogEditarUsuario = true;
    },
    editarUsuarioFalse(id) {
      this.usuarioSeleccionado = this.usuarioFalse.find(e => e.id === id) || {};
      this.dialogEditarUsuario = true;
    },
    cambiarEstadoTrue(id) {
      this.usuarioSeleccionado = this.usuario.find((e) => e.id === id) || {}
      this.dialogEliminarConfirm = true  // Mostrar el modal de confirmación
    },
    // Función para deshabilitar un colaborador (cambiar el estado a false)
    confirmarEliminacion() {
      this.dialogEliminarConfirm = false;
      this.dialogEliminar = true;  // Mostrar el modal de carga

      // Usamos this.usuarioSeleccionado.id para obtener el ID del usuario
      this.$axios.patch(`/usuario/${this.usuarioSeleccionado.id}`, { estado: 0 })
        .then((response) => {
          // Buscar el usuario en la lista de usuarios activos
          const usuario = this.usuario.find(usuario => usuario.id === this.usuarioSeleccionado.id);
          if (usuario) {
            usuario.estado = 0;  // Cambiar el estado a inactivo
            // Eliminar el usuario de la lista de habilitados
            this.usuario = this.usuario.filter(usuarios => usuarios.id !== this.usuarioSeleccionado.id);
            // Agregar el usuario a la lista de inhabilitados
            this.usuarioFalse.push(usuario);
          }
          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch((error) => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error eliminando el colaborador";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogEliminar = false;  // Cerrar el modal de carga después de 2 segundos
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
      this.fetchUsuarios();
      this.fetchUsuariosFalse();
    },
    onError(message) {
      // Mostrar el snackbar con un mensaje de error
      this.showSnackbar(message, 'error');
    },
    cambiarEstadoFalse(id) {
      this.usuarioSeleccionado = this.usuarioFalse.find((e) => e.id === id) || {}
      this.dialogFalseConfirm = true  // Mostrar el modal de confirmación
    },
    // Función para habilitar un colaborador (cambiar el estado a true)
    confirmarCambioTrue() {
      this.dialogFalseConfirm = false;
      this.dialogFalse = true;  // Mostrar el modal de carga

      // Usamos this.usuarioSeleccionado.id para obtener el ID del usuario
      this.$axios.patch(`/usuario/${this.usuarioSeleccionado.id}`, { estado: 1 })
        .then((response) => {
          // Buscar el usuario en la lista de usuarios inactivos
          const usuario = this.usuarioFalse.find(usuario => usuario.id === this.usuarioSeleccionado.id);
          if (usuario) {
            usuario.estado = 1;  // Cambiar el estado a activo
            // Eliminar el usuario de la lista de inhabilitados
            this.usuarioFalse = this.usuarioFalse.filter(usuarios => usuarios.id !== this.usuarioSeleccionado.id);
            // Agregar el usuario a la lista de habilitados
            this.usuario.push(usuario);
          }
          // Mostrar el mensaje que viene del backend en el snackbar
          this.showSnackbar(response.data.message, "success");
        })
        .catch(error => {
          // Mostrar el mensaje de error del backend o un mensaje genérico si no está disponible
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error actualizando el colaborador";
          this.showSnackbar(errorMessage, "error");
        })
        .finally(() => {
          setTimeout(() => {
            this.dialogFalse = false;  // Cerrar el modal de carga después de 2 segundos
          }, 2000);
        });
    },
    fetchUsuarios() {
      this.$axios.get('/usuario/uf/1')
        .then(response => {
          this.usuario = response.data;
        })
        .catch(error => {
          console.error('Error fetching empleados:', error);
        });
    },
    fetchUsuariosFalse() {
      this.$axios.get('/usuario/uf/0')
        .then(response => {
          this.usuarioFalse = response.data;
        })
        .catch(error => {
          console.error('Error fetching empleados:', error);
        });
    },
  },
  components: {
    NuevoUsuario,
    DetalleUsuario,
    EditarUsuario,
  },
}
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
