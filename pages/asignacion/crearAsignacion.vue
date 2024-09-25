<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nueva Asignacion</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form">
                <v-row>
                    <v-col cols="6">
                        <v-autocomplete v-model="nuevaAsignacion.idComercio" :items="comercio"
                            item-text="nombreComercio" item-value="id" label="Comercio" required></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="nuevaAsignacion.idServicio" :items="servicio" item-text="nombre"
                            item-value="id" label="Tipo Servicio" required></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete v-model="nuevaAsignacion.idEquipo" :items="equipo" item-text="idTipoEquipo"
                            item-value="id" label="Equipos" required chips closable-chips multiple></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="nuevaAsignacion.tipoProblema" label="Descripción"
                            placeholder="Ej.  Cambio de D2 Mini"></v-text-field>
                    </v-col>

                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="saveComercio">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            nuevaAsignacion: {
                idComercio: '',
                idServicio: '',
                idEquipo: '',
                tipoProblema: '',
                idEstado: 1
            },
            comercio: [],
            servicio: [],
            equipo: [],
            estado: [],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        }
    },
    async mounted() {
        try {
            await Promise.all([this.fetchComercio(), this.fetchServicio(), this.fetchEquipo(), this.fetchEstado()])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    },
    methods: {
        resetForm() {
            this.nuevaAsignacion = {
                idComercio: '',
                idServicio: '',
                idEquipo: '',
                tipoProblema: '',
                idEstado: 1
            }
            this.$refs.form.resetValidation()
        },
        fetchComercio() {
            this.$axios.get('/comercio')
                .then(response => {
                    this.comercio = response.data;
                })
                .catch(error => {
                    console.error('Error fetching comercio:', error);
                })
        },
        fetchServicio() {
            this.$axios.get('/servicio/sc')
                .then(response => {
                    this.servicio = response.data;
                })
                .catch(error => {
                    console.error('Error fetching servicio:', error);
                })
        },
        async fetchEquipo() {
            this.$axios.get('/equipo/ea')
                .then(response => {
                    this.equipo = response.data;
                })
                .catch(error => {
                    console.error('Error fetching equipo:', error);
                })
        },
        fetchEstado() {
            this.$axios.get('/estado')
                .then(response => {
                    this.estado = response.data;
                })
                .catch(error => {
                    console.error('Error fetching estado:', error);
                })
        },
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        async saveComercio() {
            if (this.$refs.form.validate()) {

                if (!this.nuevaAsignacion.tipoProblema) {
                    this.nuevaAsignacion.tipoProblema = ' ';
                }

                const requests = this.nuevaAsignacion.idEquipo.map(idEquipo => {
                    const asignacion = {
                        ...this.nuevaAsignacion,
                        idEquipo: idEquipo
                    };
                    return this.$axios.post('/asignacion', asignacion)
                });

                try {
                    await Promise.all(requests)
                    this.$emit('saved')
                    this.closeDialog()
                    await this.fetchEquipo()
                } catch (error) {
                    console.error('Error guardando la asignacion:', error)
                }
            }
        },
    }
};
</script>