<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="d-flex align-center pe-2">
                        <v-icon icon="mdi-account-circle"></v-icon> &nbsp;
                        Lista de Usuarios
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-card-subtitle>
                        <v-row align="center">
                            <v-col cols="9">
                                <v-btn color="primary" @click="nuevoUsuario">
                                    <v-icon left>mdi-plus</v-icon>
                                    Añadir Usuarios
                                </v-btn>
                            </v-col>

                            <v-col cols="3">
                                <v-text-field v-model="search" density="compact" label="Buscar"
                                    prepend-inner-icon="mdi-magnify" variant="outlined" flat hide-details single-line>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-subtitle>

                    <v-divider></v-divider>

                    <v-tabs v-model="tab" align-tabs="center" class="justify-center" color="deep-purple-accent-4">
                        <v-tab :key="1">Empleados Habilitados</v-tab>
                        <v-tab :key="2">Empleados Deshabilitados</v-tab>
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
        <v-dialog v-model="dialogNuevoUsuario" max-width="600px">
            <nuevo-usuario @close="dialogNuevoUsuario = false"
                @saved="fetchUsuarios(); fetchUsuariosFalse();"></nuevo-usuario>
        </v-dialog>
        <!-- Dialogos para ver usuario-->
        <v-dialog v-model="dialogDetalleUsuario" max-width="600px">
            <detalle-usuario :id="usuarioSeleccionado.id" @close="dialogDetalleUsuario = false"></detalle-usuario>
        </v-dialog>
        <!-- Dialogos para editar usuario-->
        <v-dialog v-model="dialogEditarUsuario" max-width="600px">
            <editar-usuario :id="usuarioSeleccionado.id" @close="dialogEditarUsuario = false"
                @saved="fetchUsuarios(); fetchUsuariosFalse();"></editar-usuario>
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
            const { data } = await $axios.get('/usuario/uf/1');
            const f = await $axios.get('/usuario/uf/0')
            return { usuario: data, usuarioFalse: f.data };

        } catch (error) {
            console.error('Error fetching usuarios:', error);
            return { usuario: [] };
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
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
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
            if (confirm("¿Estás seguro de que quieres deshabilitar a este Usuario?")) {
                this.$axios.patch(`/usuario/${id}`, { estado: false })
                    .then(() => {
                        // Buscar el usuario en la lista de usuarios activos
                        const usuario = this.usuario.find(usuario => usuario.id === id)
                        if (usuario) {
                            usuario.estado = false // Cambiar el estado a inactivo
                            this.usuario = this.usuario.filter(usuarios => usuarios.id !== id) // Eliminar de la lista de activos
                            this.usuarioFalse.push(usuario) // Agregar a la lista de inactivos
                        }
                    })
                    .catch(error => {
                        console.error('Error al cambiar el estado del Usuario:', error)
                    });
            }
        },
        cambiarEstadoFalse(id) {
            if (confirm("¿Estás seguro de que quieres habilitar a este Usuario?")) {
                this.$axios.patch(`/usuario/${id}`, { estado: true })
                    .then(() => {
                        // Buscar el usuario en la lista de usuarios inactivos
                        const usuario = this.usuarioFalse.find(usuario => usuario.id === id)
                        if (usuario) {
                            usuario.estado = true // Cambiar el estado a activo
                            this.usuarioFalse = this.usuarioFalse.filter(usuarios => usuarios.id !== id) // Eliminar de la lista de inactivos
                            this.usuario.push(usuario) // Agregar a la lista de activos
                        }
                    })
                    .catch(error => {
                        console.error('Error al cambiar el estado del Usuario:', error)
                    });
            }
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