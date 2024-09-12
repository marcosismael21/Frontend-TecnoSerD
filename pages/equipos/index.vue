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
                                    Registrar Equipo
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

                    <v-tabs v-model="tab" align-tabs="center" class="justify-center" color="deep-purple-accent-4">
                        <v-tab :key="1">Equipos en buen estado</v-tab>
                        <v-tab :key="2">Equipos en mal estado</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                        <v-tab-item :key="1">
                            <v-container fluid>
                                <v-row>
                                    <v-col>
                                        <v-data-table :headers="headers" :items="equipoBueno" :search="search">
                                            <template v-slot:item.nro="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.idTipoEquipo="{ item }">
                                                {{ item.idTipoEquipo }}
                                            </template>
                                            <template v-slot:item.estado="{ item }">
                                                {{ getEstadoText(item.estado) }}
                                            </template>
                                            <template v-slot:item.acciones="{ item }">
                                                <v-btn icon @click="detalleEquipoBueno(item.id)">
                                                    <v-icon>mdi-eye</v-icon>
                                                </v-btn>
                                                <v-btn icon @click="editarEquipoBueno(item.id)">
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn icon @click="cambiarEstadoBueno(item.id)">
                                                    <v-icon>mdi-package-down</v-icon>
                                                </v-btn>
                                                <v-btn icon @click="eliminarEquipoBueno(item.id)">
                                                    <v-icon>mdi-delete</v-icon>
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
                                        <v-data-table :headers="headers" :items="equipoMalo" :search="search">
                                            <template v-slot:item.nro="{ index }">
                                                {{ index + 1 }}
                                            </template>
                                            <template v-slot:item.idTipoEquipo="{ item }">
                                                {{ item.idTipoEquipo }}
                                            </template>
                                            <template v-slot:item.estado="{ item }">
                                                {{ getEstadoText(item.estado) }}
                                            </template>
                                            <template v-slot:item.acciones="{ item }">
                                                <v-btn icon @click="detalleEquipoMalo(item.id)">
                                                    <v-icon>mdi-eye</v-icon>
                                                </v-btn>
                                                <v-btn icon @click="editarEquipoMalo(item.id)">
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn icon @click="cambiarEstadoMalo(item.id)">
                                                    <v-icon>mdi-package-up</v-icon>
                                                </v-btn>
                                                <v-btn icon @click="eliminarEquipoMalo(item.id)">
                                                    <v-icon>mdi-delete</v-icon>
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

        <v-dialog v-model="dialogNuevoEquipo" max-width="600px">
            <nuevo-equipo @close="dialogNuevoEquipo = false"
                @saved="fetchEquiposBueno(); fetchEquiposMalo();"></nuevo-equipo>
        </v-dialog>

        <v-dialog v-model="dialogDetalleEquipo" max-width="600px">
            <detalle-equipo :id="equipoSeleccionado.id" @close="dialogDetalleEquipo = false"></detalle-equipo>
        </v-dialog>

        <v-dialog v-model="dialogEditarEquipo" max-width="600px">
            <editar-equipo :id="equipoSeleccionado.id" @close="dialogEditarEquipo = false"
                @saved="fetchEquiposBueno(); fetchEquiposMalo();"></editar-equipo>
        </v-dialog>

        <v-dialog v-model="dialogEditarEquipoMalo" max-width="600px">
            <editar-equipo-malo :id="equipoSeleccionado.id" @close="dialogEditarEquipoMalo = false"
                @saved="fetchEquiposBueno(); fetchEquiposMalo();"></editar-equipo-malo>
        </v-dialog>

        <!-- Dialog para eliminar -->
        <v-dialog v-model="dialogEliminarConfirm" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
                <v-card-text>¿Estás seguro de que deseas eliminar este registro de equipo?</v-card-text>
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

        <v-dialog v-model="dialogEliminarConfirmMalo" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
                <v-card-text>¿Estás seguro de que deseas eliminar este registro de equipo?</v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn color="red darken-1" text @click="dialogEliminarConfirmMalo = false">Cancelar</v-btn>
                    <v-btn color="green darken-1" text @click="confirmarEliminacionMalo">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEliminarMalo" max-width="400" persistent>
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

        <!-- Modales para el cambio de estado -->

        <v-dialog v-model="dialogConfimacionBueno" max-width="450" persistent>
            <v-card>
                <v-card-title class="text-h6">Confirmar cambio de estado</v-card-title>
                <v-card-text>¿Estás seguro de que deseas cambiar el estado a este equipo?</v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn color="red darken-1" text @click="dialogConfimacionBueno = false">Cancelar</v-btn>
                    <v-btn color="green darken-1" text @click="confirmarCambioBueno">Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCambioBueno" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h6">Cambiando estado...</v-card-title>
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

        <!-- Modales para el cambio de estado -->

        <v-dialog v-model="dialogConfimacionMalo" max-width="450" persistent>
            <v-card>
                <v-card-title class="text-h6">Confirmar cambio de estado</v-card-title>
                <v-card-text>¿Estás seguro de que deseas cambiar el estado a este equipo?</v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn color="red darken-1" text @click="dialogConfimacionMalo = false">Cancelar</v-btn>
                    <v-btn color="green darken-1" text @click="confirmarCambioMalo">Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCambioMalo" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h6">Cambiando estado...</v-card-title>
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
import EditarEquipoMalo from '~/pages/equipos/editarEquipoMalo.vue'

export default {
    async asyncData({ $axios }) {
        try {
            const b = await $axios.get("/equipo/es/1")
            const m = await $axios.get("/equipo/es/0")

            return { equipoBueno: b.data, equipoMalo: m.data }
        } catch (error) {
            console.error("Error fetching equipos:", error)
            return { equipoBueno: [], equipoMalo: [] }
        }
    },
    watch: {
        $route(to, from) {
            if (to.fullPath !== from.fullPath) {
                this.loadEquipoBueno()
                this.loadEquipoMalo()
            }
        },
    },
    data() {
        return {
            tab: 0, // inicializamos el tab en 0
            search: "",
            equipoBueno: [],
            equipoMalo: [],
            headers: [
                { text: 'N°', value: 'nro' },
                { text: "Nombre", value: "idTipoEquipo" },
                { text: "N° Serie", value: "noserie" },
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
            dialogEditarEquipoMalo: false,
            dialogDetalleEquipo: false,
            dialogEliminar: false,
            dialogEliminarConfirm: false, // Nuevo estado para la confirmación de eliminación
            dialogEliminarConfirmMalo: false,
            dialogEliminarMalo: false,
            equipoSeleccionado: false,
            dialogCambioBueno: false,
            dialogCambioMalo: false,
            dialogConfimacionBueno: false,
            dialogConfimacionMalo: false,
        };
    },
    methods: {
        async loadEquipoBueno() {
            try {
                const { data } = await this.$axios.get("/equipo/es/1");
                this.equipoBueno = data;
            } catch (error) {
                console.error("Error fetching equipo:", error);
                this.equipoBueno = []
            }
        },
        async loadEquipoMalo() {
            try {
                const { data } = await this.$axios.get("/equipo/es/0")
                this.equipoMalo = data
            } catch (error) {
                console.error("Error fetching equipo:", error);
                this.equipoMalo = []
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
        detalleEquipoBueno(id) {
            this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {}
            this.dialogDetalleEquipo = true
        },
        detalleEquipoMalo(id) {
            this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {}
            this.dialogDetalleEquipo = true
        },
        editarEquipoBueno(id) {
            this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {}
            this.dialogEditarEquipo = true
        },
        editarEquipoMalo(id) {
            this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {}
            this.dialogEditarEquipoMalo = true
        },
        cambiarEstadoBueno(id) {
            this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {}
            this.dialogConfimacionBueno = true
        },
        confirmarCambioBueno() {
            this.dialogConfimacionBueno = false;
            this.dialogCambioBueno = true;  // Mostrar el modal de carga
            this.$axios
                .patch(`/equipo/cs/${this.equipoSeleccionado.id}`, { estado: false })
                .then(() => {
                    const equipo = this.equipoBueno.find(equipo => equipo.id === this.equipoSeleccionado.id);
                    if (equipo) {
                        equipo.estado = 0;
                        this.equipoBueno = this.equipoBueno.filter(equipos => equipos.id !== this.equipoSeleccionado.id);
                        this.equipoMalo.push(equipo);
                    }
                })
                .catch(error => {
                    console.error('Error al cambiar el estado del Usuario:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.dialogCambioBueno = false;  // Cerrar el modal de carga después de 2 segundos
                    }, 2000);
                });
        },
        cambiarEstadoMalo(id) {
            this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {}
            this.dialogConfimacionMalo = true
        },
        confirmarCambioMalo() {
            this.dialogConfimacionMalo = false;
            this.dialogCambioMalo = true;  // Mostrar el modal de carga
            this.$axios
                .patch(`/equipo/cs/${this.equipoSeleccionado.id}`, { estado: true })
                .then(() => {
                    const equipo = this.equipoMalo.find(equipo => equipo.id === this.equipoSeleccionado.id);
                    if (equipo) {
                        equipo.estado = 1;
                        this.equipoMalo = this.equipoMalo.filter(equipos => equipos.id !== this.equipoSeleccionado.id);
                        this.equipoBueno.push(equipo);
                    }
                })
                .catch(error => {
                    console.error('Error al cambiar el estado del Usuario:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.dialogCambioMalo = false;  // Cerrar el modal de carga después de 2 segundos
                    }, 2000);
                });
        },
        eliminarEquipoBueno(id) {
            this.equipoSeleccionado = this.equipoBueno.find((e) => e.id === id) || {};
            this.dialogEliminarConfirm = true;  // Mostrar el modal de confirmación
        },
        confirmarEliminacion() {
            this.dialogEliminarConfirm = false;
            this.dialogEliminar = true;  // Mostrar el modal de carga

            this.$axios
                .delete(`/equipo/${this.equipoSeleccionado.id}`)
                .then(() => {
                    this.equipoBueno = this.equipoBueno.filter((equipoBueno) => equipoBueno.id !== this.equipoSeleccionado.id);
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
        eliminarEquipoMalo(id) {
            this.equipoSeleccionado = this.equipoMalo.find((e) => e.id === id) || {};
            this.dialogEliminarConfirmMalo = true;  // Mostrar el modal de confirmación
        },
        confirmarEliminacionMalo() {
            this.dialogEliminarConfirmMalo = false;
            this.dialogEliminarMalo = true;  // Mostrar el modal de carga

            this.$axios
                .delete(`/equipo/${this.equipoSeleccionado.id}`)
                .then(() => {
                    this.equipoMalo = this.equipoMalo.filter((equipo) => equipo.id !== this.equipoSeleccionado.id);
                })
                .catch((error) => {
                    console.error("Error eliminando el equipo:", error);
                })
                .finally(() => {
                    setTimeout(() => {
                        this.dialogEliminarMalo = false;  // Cerrar el modal de carga después de 3 segundos
                    }, 2000);
                });
        },
        fetchEquiposBueno() {
            this.$axios
                .get("/equipo/es/1")
                .then((response) => {
                    this.equipoBueno = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching equipo:", error);
                });
        },
        fetchEquiposMalo() {
            this.$axios
                .get("/equipo/es/0")
                .then((response) => {
                    this.equipoMalo = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching equipo:", error);
                });
        },
        nuevoEquipo() {
            this.$router.push('tipoEquipo')
        }
    },
    components: {
        NuevoEquipo,
        DetalleEquipo,
        EditarEquipo,
        EditarEquipoMalo
    },
};
</script>

<style scoped>
.justify-center {
    display: flex;
    justify-content: center;
}
</style>