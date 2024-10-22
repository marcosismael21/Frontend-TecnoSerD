<template>
    <v-card>
        <v-card-title>
            Registro de Equipo
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="nuevoRegistro.idTipoEquipo" :items="tipoEquipo" item-text="nombre"
                            item-value="id" label="Equipos" required></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoRegistro.noserie" label="N° de SERIE" placeholder="Ej. 12345678" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoRegistro.noimei" label="N° de IMEI" placeholder="Ej. 12345678" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoRegistro.pin" label="N° de PIN" placeholder="Ej. 18919159" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoRegistro.puk" label="N° de PUK" placeholder="Ej. 1234" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="nuevoRegistro.fechaLlegada" label="Fecha de Llegada"
                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="nuevoRegistro.fechaLlegada" @input="menu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="guardarRegistro">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            menu: false,
            tipoEquipo: [],
            nuevoRegistro: {
                idTipoEquipo: '',
                noserie: '',
                noimei: '',
                pin: '',
                puk: '',
                fechaLlegada: '',
                comodin: true,
                estado: true,
            },
            rules: {
                required: value => !!value || 'Requerido.',
            }
        }
    },
    mounted() {
        this.fetchTipoEquipo();
    },
    methods: {
        resetForm() {
            this.nuevoRegistro = {
                idTipoEquipo: '',
                noserie: '',
                noimei: '',
                pin: '',
                puk: '',
                fechaLlegada: '',
                comodin: true,
                estado: true,
            }
            this.$refs.form.resetValidation();
        },
        fetchTipoEquipo() {
            this.$axios.get('/tipoequipo')
                .then(response => {
                    this.tipoEquipo = response.data;
                })
                .catch(error => {
                    console.error('Error fetching Tipo Equipo:', error);
                });
        },
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        guardarRegistro() {
            if (this.$refs.form.validate()) {
                this.$axios.post('/equipo', this.nuevoRegistro)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando el registro:', error);
                    });
            }
        }
    }
};
</script>