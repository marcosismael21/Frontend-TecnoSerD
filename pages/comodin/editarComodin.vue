<template>
    <v-card v-if="equipo">
        <v-card-title>
            Actualizar Registro
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-select v-model="equipo.idTipoEquipo" :items="Tipoequipo" item-text="nombre" item-value="id"
                            label="Equipos" required></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="equipo.noserie" label="N° de SERIE" placeholder="Ej. 12345678" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="equipo.noimei" label="N° de IMEI" placeholder="Ej. 12345678" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="equipo.pin" label="N° de PIN" placeholder="Ej. 18919159" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="equipo.puk" label="N° de PUK" placeholder="Ej. 1234" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="equipo.comodin" :items="comodinOptions" item-text="text" item-value="value"
                            label="Comodín" required></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="equipo.fechaLlegada" label="Fecha de Llegada"
                                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="equipo.fechaLlegada" @input="menu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
            <v-btn color="green darken-1" text @click="actualizarEquipo">Guardar</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información del Equipo.</v-alert>
</template>

<script>
export default {
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            equipo: null,
            menu: false,
            Tipoequipo: [],
            valid: false,
            comodinOptions: [
                { text: "Sí", value: true },
                { text: "No", value: false },
            ],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        };
    },
    async mounted() {
        try {
            await Promise.all([this.fetchEquipo(), this.fetchTipoequipo()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchEquipo() {
            try {
                const { data } = await this.$axios.get(`/equipo/${this.id}`);
                this.equipo = {
                    ...data,
                    fechaLlegada: data.fechaLlegada ? new Date(data.fechaLlegada).toISOString().slice(0, 10) : '',
                }
            } catch (error) {
                console.error('Error fetching equipo by ID:', error);
                this.equipo = null;
            }
        },
        fetchTipoequipo() {
            this.$axios.get('/tipoequipo')
                .then(response => {
                    this.Tipoequipo = response.data;
                })
                .catch(error => {
                    console.error('Error fetching Tipoequipo:', error);
                });
        },
        closeDialog() {
            this.$emit('close');
        },
        actualizarEquipo() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/equipo/${this.equipo.id}`, this.equipo)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error actualizando al equipo:', error);
                    });
            }
        },
    },
    watch: {
        id(newId) {
            if (newId) {
                this.fetchEquipo();
            }
        }
    }
};
</script>
