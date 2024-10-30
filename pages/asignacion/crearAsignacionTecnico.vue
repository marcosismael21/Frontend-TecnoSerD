<template>
    <v-card>
        <v-card-title>
            Crear Asignacion
        </v-card-title>
        <v-card-text>
            <v-form ref="form">
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="nuevaAsignacionTecnico.idUsuario" :items="tecnicos" item-text="nombres" item-value="id"
                            label="Tecnicos" required>
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="saveAsignacionTecnic">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props: {
        idComercio: {
            type: Number,
            required: true
        },
        idEstado: {
            type: Number,
            required: true
        },
        idServicio: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            nuevaAsignacionTecnico: {
                idUsuario: '',
                idComercio: this.idComercio,
                idEstado: this.idEstado,
                idServicio: this.idServicio,
            },
            tecnicos: [],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        } 
    },
    mounted() {
        this.fetchTecnicos()
    },
    methods: {
        fetchTecnicos() {
            this.$axios.get('/usuario/t')
                .then(response => {
                    this.tecnicos = response.data
                })
                .catch(error => {
                    console.error('error:', error)
                })
        },
        closeDialog() {
            this.$emit('close');
        },
        async saveAsignacionTecnic() {
            if (this.$refs.form.validate()) {
                this.$axios
                    .post("/asignacionTecnico/at", this.nuevaAsignacionTecnico)
                    .then((response) => {
                        this.$emit("saved");
                        this.closeDialog();
                    })
                    .catch((error) => {
                        console.error("Error guardando el canal:", error);
                    });
            }
        }
    }
}
</script>