<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card flat>
                    <v-card-title class="d-flex align-center pe-2">
                        <v-icon icon="mdi-account-circle"></v-icon> &nbsp;
                        Lista de Usuarios
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-card-subtitle>
                        <v-row>
                            <v-col cols="3">
                                <v-btn color="primary" @click="nuevoUsuario">
                                    <v-icon left>mdi-plus</v-icon>
                                    Añadir Usuarios
                                </v-btn>
                            </v-col>

                            <v-col cols="6">
                                <v-text-field v-model="search" density="compact" label="Buscar"
                                    prepend-inner-icon="mdi-magnify" variant="outlined" flat hide-details single-line>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-subtitle>

                    <v-divider></v-divider>

                    <v-data-table :headers="headers" :items="usuario" :search="search">
                        <template v-slot:item.id="{ item }">
                            {{ item.id }}
                        </template>
                        <template v-slot:item.nombres="{ item }">
                            {{ item.nombres }}
                        </template>
                        <template v-slot:item.idrol="{ item }">
                            {{ item.idrol }}
                        </template>
                        <template v-slot:item.acciones="{ item }">
                            <v-btn icon @click="verUsuario(item.id)">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn icon @click="editarUsuario(item.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon @click="eliminarUsuario(item.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <!-- Dialogos para crear usuario-->
        <v-dialog v-model="dialogNuevoUsuario" max-width="600px">
            <nuevo-usuario @close="dialogNuevoUsuario = false" @saved="fetchUsuarios"></nuevo-usuario>
        </v-dialog>
        <!-- Dialogos para ver usuario-->
        <v-dialog v-model="dialogDetalleUsuario" max-width="600px">
            <detalle-usuario :id="usuarioSeleccionado.id" @close="dialogDetalleUsuario = false"></detalle-usuario>
        </v-dialog>
        <!-- Dialogos para editar usuario-->
        <v-dialog v-model="dialogEditarUsuario" max-width="600px">
            <editar-usuario :id="usuarioSeleccionado.id" @close="dialogEditarUsuario = false"
                @saved="fetchUsuarios"></editar-usuario>
        </v-dialog>
    </v-container>
</template>

<script>

import NuevoUsuario from '~/pages/usuarios/crearUsuario.vue'
import DetalleUsuario from '~/pages/usuarios/show/[id].vue'
import EditarUsuario from '~/pages/usuarios/editarUsuario.vue'

export default {
    async asyncData({ $axios }) {
        try {
            const { data } = await $axios.get('/usuario');
            return { usuario: data };
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            return { usuario: [] };
        }
    },
    watch: {
        $route(to, from) {
            if (to.fullPath !== from.fullPath) {
                this.loadUsuarios();
            }
        }
    },
    data() {
        return {
            search: '',
            usuario: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nombre', value: 'nombres' },
                { text: 'Rol', value: 'idrol' },
                { text: 'Acciones', value: 'acciones', sortable: false },
            ],
            //variables para activar los modales
            dialogNuevoUsuario: false,
            dialogEditarUsuario: false,
            dialogDetalleUsuario: false,
            usuarioSeleccionado: false,
        };
    },
    methods: {
        async loadUsuarios() {
            try {
                const { data } = await this.$axios.get('/usuario');
                this.usuario = data;
            } catch (error) {
                console.error('Error fetching usuarios:', error);
                this.usuario = [];
            }
        },
        nuevoUsuario() {
            this.dialogNuevoUsuario = true
        },
        verUsuario(id) {
            this.usuarioSeleccionado = this.usuario.find(e => e.id === id) || {};
            this.dialogDetalleUsuario = true
        },
        editarUsuario(id) {
            this.usuarioSeleccionado = this.usuario.find(e => e.id === id) || {};
            this.dialogEditarUsuario = true
        },
        eliminarUsuario(id) {
            if (confirm("¿Estás seguro de que quieres eliminar este Usuario?")) {
                this.$axios.delete(`/usuario/${id}`)
                    .then(() => {
                        this.usuario = this.usuario.filter(usuarios => usuarios.id !== id);
                    })
                    .catch(error => {
                        console.error('Error eliminando al Usuario:', error);
                    });
            }
        },
        fetchUsuarios() {
            this.$axios.get('/usuario')
                .then(response => {
                    this.usuario = response.data;
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