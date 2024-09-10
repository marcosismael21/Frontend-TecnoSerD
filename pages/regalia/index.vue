<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="d-flex align-center pe-2">
                        <v-icon icon="mdi-account-circle"></v-icon> &nbsp; Lista de Regalias
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-card-subtitle>
                        <v-row align="center">
                            <v-col cols="9">
                                <v-btn color="primary" @click="nuevaRegalia">
                                    <v-icon left>mdi-plus</v-icon>
                                    Añadir Regalia
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

                    <v-data-table :headers="headers" :items="regalia" :search="search">
                        <template v-slot:item.nro="{ index }">
                            {{ index + 1 }}
                        </template>
                        <template v-slot:item.nombre="{ item }">
                            {{ item.nombre }}
                        </template>
                        <template v-slot:item.idTipoComercio="{ item }">
                            {{ item.idTipoComercio }}
                        </template>
                        <template v-slot:item.cantidad="{ item }">
                            {{ item.cantidad }}
                        </template>
                        <template v-slot:item.estado="{ item }">
                            {{ getEstadoText(item.estado) }}
                        </template>
                        <template v-slot:item.acciones="{ item }">
                            <v-btn icon @click="detalleRegalia(item.id)">
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <v-btn icon @click="editarRegalia(item.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon @click="eliminarRegalia(item.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <!-- Dialogos para crear Ciudad-->



        <v-dialog v-model="dialogNuevaRegalia" max-width="600px">
            <nueva-regalia @close="dialogNuevaRegalia = false" @saved="fetchRegalias"></nueva-regalia>
        </v-dialog>

        <v-dialog v-model="dialogEditarRegalia" max-width="600px">
            <editar-regalia :id="regaliaSeleccionada.id" @close="dialogEditarRegalia = false"
                @saved="fetchRegalias"></editar-regalia>
        </v-dialog>

        <v-dialog v-model="dialogDetalleRegalia" max-width="600px">
            <detalle-regalia :id="regaliaSeleccionada.id" @close="dialogDetalleRegalia = false"></detalle-regalia>
        </v-dialog>

    </v-container>
</template>

<script>

import NuevaRegalia from "~/pages/regalia/crearRegalia.vue"
import EditarRegalia from "~/pages/regalia/editarRegalia.vue"
import DetalleRegalia from "~/pages/regalia/detalleRegalia.vue"

export default {
    async asyncData({ $axios }) {
        try {
            const { data } = await $axios.get("/pubreg")
            return { regalia: data }
        } catch (error) {
            console.error("Error fetching regalia:", error)
            return { regalia: [] }
        }
    },
    watch: {
        $route(to, from) {
            if (to.fullPath !== from.fullPath) {
                this.loadRegalia();
            }
        },
    },
    data() {
        return {
            tab: 0, // inicializamos el tab en 0
            search: "",
            regalia: [],
            headers: [
                { text: 'N°', value: 'nro' },
                { text: "Nombre", value: "nombre" },
                { text: "Tipo de Comercio", value: "idTipoComercio" },
                { text: "Cantidad", value: "cantidad" },
                { text: "Estado", value: "estado" },
                { text: "Acciones", value: "acciones" },
            ],
            estadoOptions: [
                { text: "Activo", value: true },
                { text: "Inactivo", value: false },
            ],
            //variables para activar los modales
            dialogNuevaRegalia: false,
            dialogEditarRegalia: false,
            dialogDetalleRegalia: false,
            regaliaSeleccionada: false,
        };
    },
    methods: {
        async loadRegalia() {
            try {
                const { data } = await this.$axios.get("/pubreg");
                this.regalia = data;
            } catch (error) {
                console.error("Error fetching regalia:", error);
                this.regalia = [];
            }
        },
        getEstadoText(estado) {
            const estadoOption = this.estadoOptions.find((option) => option.value === estado)
            return estadoOption ? estadoOption.text : ""
        },
        nuevaRegalia() {
            this.dialogNuevaRegalia = true
        },
        editarRegalia(id) {
            this.regaliaSeleccionada = this.regalia.find((e) => e.id === id) || {}
            this.dialogEditarRegalia = true
        },
        detalleRegalia(id) {
            this.regaliaSeleccionada = this.regalia.find((e) => e.id === id) || {}
            this.dialogDetalleRegalia = true
        },
        eliminarRegalia(id) {
            if (confirm("¿Estás seguro de que quieres eliminar esta Regalia?")) {
                this.$axios
                    .delete(`/pubreg/${id}`)
                    .then(() => {
                        this.regalia = this.ciudad.filter((regalias) => regalias.id !== id);
                    })
                    .catch((error) => {
                        console.error("Error eliminando la regalia:", error);
                    });
            }
        },
        fetchRegalias() {
            this.$axios
                .get("/pubreg")
                .then((response) => {
                    this.regalia = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching regalia:", error);
                });
        },
    },
    components: {
        NuevaRegalia,
        EditarRegalia,
        DetalleRegalia
    },
};
</script>

<style scoped>
.justify-center {
    display: flex;
    justify-content: center;
}
</style>