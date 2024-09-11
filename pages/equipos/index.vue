<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="d-flex align-center pe-2">
                        <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Equipos
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-card-subtitle>
                        <v-row align="center">
                            <v-col cols="9">
                                <v-btn color="primary" @click="nuevoRegistro">
                                    <v-icon left>mdi-plus</v-icon>
                                    Registrar Rquipo
                                </v-btn>
                                <v-btn color="primary" @click="nuevoEquipo">
                                    <v-icon left>mdi-file-find</v-icon>
                                    Crear Equipo
                                </v-btn>
                            </v-col>

                            <v-col cols="3">
                                <v-text-field v-model="search" density="compact" label="Buscar"
                                    prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-subtitle>

                    <v-divider></v-divider>

                    <v-data-table :headers="headers" :items="equipo" :search="search">
                        <template v-slot:item.nro="{ index }">
                            {{ index + 1 }}
                        </template>
                        <template v-slot:item.idTipoEquipo="{ item }">
                            {{ item.idTipoEquipo }}
                        </template>
                        <template v-slot:item.comodin="{ item }">
                            {{ getComodinText(item.comodin) }}
                        </template>
                        <template v-slot:item.estado="{ item }">
                            {{ getEstadoText(item.estado) }}
                        </template>
                        <template v-slot:item.acciones="{ item }">
                            <v-btn icon @click="detallerEquipo(item.id)">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn icon @click="editarEquipo(item.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon @click="eliminarEquipo(item.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialogNuevoEquipo" max-width="600px">
            <nuevo-equipo @close="dialogNuevoEquipo = false" @saved="fetchEquipos"></nuevo-equipo>
        </v-dialog>

        <v-dialog v-model="dialogDetalleEquipo" max-width="600px">
            <detalle-equipo :id="equipoSeleccionado.id" @close="dialogDetalleEquipo = false"></detalle-equipo>
        </v-dialog>

        <v-dialog v-model="dialogEditarEquipo" max-width="600px">
            <editar-equipo :id="equipoSeleccionado.id" @close="dialogEditarEquipo = false"
                @saved="fetchEquipos"></editar-equipo>
        </v-dialog>

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
                            <v-progress-circular indeterminate color="primary" size="64" width="4"
                                class="mr-4"></v-progress-circular>
                        </v-col>
                    </v-row>
                </v-card-subtitle>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>

import NuevoEquipo from "~/pages/equipos/crearEquipo.vue"
import DetalleEquipo from "~/pages/equipos/detalleEquipo.vue"
import EditarEquipo from '~/pages/equipos/editarEquipo.vue'

export default {
    async asyncData({ $axios }) {
        try {
            const { data } = await $axios.get("/equipo")
            return { equipo: data }
        } catch (error) {
            console.error("Error fetching equipos:", error)
            return { equipo: [] }
        }
    },
    watch: {
        $route(to, from) {
            if (to.fullPath !== from.fullPath) {
                this.loadEquipo();
            }
        },
    },
    data() {
        return {
            tab: 0, // inicializamos el tab en 0
            search: "",
            equipo: [],
            headers: [
                { text: 'N°', value: 'nro' },
                { text: "Nombre", value: "idTipoEquipo" },
                { text: "N° Serie", value: "noserie" },
                { text: "Comodín", value: "comodin" },
                { text: "Estado", value: "estado" },
                { text: "Acciones", value: "acciones" },
            ],
            estadoOptions: [
                { text: "Equipo Bueno", value: 1 },
                { text: "Equipo Dañado", value: 0 },
            ],
            comodinOptions: [
                { text: "Sí", value: 1 },
                { text: "No", value: 0 },
            ],
            //variables para activar los modales
            dialogNuevoEquipo: false,
            dialogEditarEquipo: false,
            dialogDetalleEquipo: false,
            dialogEliminar: false,
            dialogEliminarConfirm: false, // Nuevo estado para la confirmación de eliminación
            equipoSeleccionado: false,
        };
    },
    methods: {
        async loadEquipo() {
            try {
                const { data } = await this.$axios.get("/equipo");
                this.equipo = data;
            } catch (error) {
                console.error("Error fetching equipo:", error);
                this.equipo = [];
            }
        },
        getEstadoText(estado) {
            const estadoOption = this.estadoOptions.find((option) => option.value === estado)
            return estadoOption ? estadoOption.text : ""
        },
        getComodinText(comodin) {
            const comodinOptions = this.comodinOptions.find((option) => option.value === comodin)
            return comodinOptions ? comodinOptions.text : ""
        },
        nuevoRegistro() {
            this.dialogNuevoEquipo = true
        },
        editarEquipo(id) {
            this.equipoSeleccionado = this.equipo.find((e) => e.id === id) || {}
            this.dialogEditarEquipo = true
        },
        detallerEquipo(id) {
            this.equipoSeleccionado = this.equipo.find((e) => e.id === id) || {}
            this.dialogDetalleEquipo = true
        },
        eliminarEquipo(id) {
            this.equipoSeleccionado = this.equipo.find((e) => e.id === id) || {};
            this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
        },
        confirmarEliminacion() {
            this.dialogEliminarConfirm = false;
            this.dialogEliminar = true;  // Mostrar el modal de carga

            this.$axios
                .delete(`/equipo/${this.equipoSeleccionado.id}`)
                .then(() => {
                    this.equipo = this.equipo.filter((equipo) => equipo.id !== this.equipoSeleccionado.id);
                })
                .catch((error) => {
                    console.error("Error eliminando el equipo:", error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.dialogEliminar = false;  // Cerrar el modal de carga después de 3 segundos
                    }, 2000);
                });
        },
        fetchEquipos() {
            this.$axios
                .get("/equipo")
                .then((response) => {
                    this.equipo = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching regalia:", error);
                });
        },
        nuevoEquipo() {
            this.$router.push('tipoEquipo')
        }
    },
    components: {
        NuevoEquipo,
        DetalleEquipo,
        EditarEquipo
    },
};
</script>