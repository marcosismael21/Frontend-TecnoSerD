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
                                <v-btn color="primary" @click="nuevoCliente">
                                    <v-icon left>mdi-plus</v-icon>
                                    Añadir Cliente
                                </v-btn>
                            </v-col>

                            <v-col cols="6">
                                <v-text-field v-model="search" density="compact" label="Buscar"
                                    prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details
                                    single-line>
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
                            <v-btn icon @click="verCliente(item.id)">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn icon @click="editarCliente(item.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon @click="eliminarCliente(item.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
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
    methods: {
        async loadUsuarios() {
            try {
                const { data } = await this.$axios.get('/usuario');
                this.usuario = data;
            } catch (error) {
                console.error('Error fetching usuarios:', error);
                this.usuario = [];
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
        };
    },
}
</script>