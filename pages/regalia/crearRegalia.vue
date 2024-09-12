<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nueva Regalia</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="nuevaRegalia.nombre" label="Nombre" placeholder="Ej. Sombrilla":rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="nuevaRegalia.idTipoComercio" :items="tipoComercio" item-text="nombre" item-value="id"
                            label="Tipo Comercio" required></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevaRegalia.cantidad" label="Cantidad" placeholder="Ej. 1":rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="nuevaRegalia.estado" :items="estadoOptions" item-text="text"
                            item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="saveRegalia">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            nuevaRegalia: {
                nombre: "",
                idTipoComercio: "",
                cantidad: "",
                estado: "",
            },
            tipoComercio: [],
            estadoOptions: [
                { text: "Activo", value: true },
                { text: "Inactivo", value: false },
            ],
            rules: {
                required: (value) => !!value || "Requerido.",
            },
        };
    },
    mounted() {
        this.fetchTipoComercio()
    },
    methods: {
        resetForm() {
            this.nuevaRegalia = {
                nombre: "",
                idTipoComercio: "",
                cantidad: "",
                estado: "",
            },
                this.$refs.form.resetValidation();
        },
        fetchTipoComercio() {
            this.$axios
                .get("/tipcom")
                .then((response) => {
                    this.tipoComercio = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching tipo comercio:", error);
                });
        },
        closeDialog() {
            this.resetForm();
            this.$emit("close");
        },
        saveRegalia() {
            if (this.$refs.form.validate()) {
                this.$axios
                    .post("/pubreg", this.nuevaRegalia)
                    .then((response) => {
                        this.$emit("saved");
                        this.closeDialog();
                    })
                    .catch((error) => {
                        console.error("Error guardando la regalia:", error);
                    });
            }
        },
    },
};
</script>
