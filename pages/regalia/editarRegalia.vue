<template>
    <v-card v-if="regalia">
        <v-card-title>
            <span class="headline">Actualizar Regalia</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="regalia.nombre" label="Nombre" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="regalia.idTipoComercio" :items="tipoComercio" item-text="nombre"
                            item-value="id" label="Tipo Comercio" required></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="regalia.cantidad" label="Cantidad" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="regalia.estado" :items="estadoOptions" item-text="text"
                            item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Volver</v-btn>
            <v-btn color="blue darken-1" text @click="actualizarRegalia">Guardar</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información del regalia.</v-alert>
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
            regalia: null,
            tipoComercio: [],
            estadoOptions: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
            ],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        };
    },
    async mounted() {
        try {
            await Promise.all([this.fetchRegalia(), this.fetchTipoComercio()])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    },
    methods: {
        async fetchRegalia() {
            try {
                const { data } = await this.$axios.get(`/pubreg/${this.id}`)
                this.regalia = data;
            } catch (error) {
                console.error('Error fetching tipoComercio by ID:', error)
                this.regalia = null;
            }
        },
        fetchTipoComercio() {
            this.$axios.get('/tipcom')
                .then(response => {
                    this.tipoComercio = response.data;
                })
                .catch(error => {
                    console.error('Error fetching tipoComercio:', error)
                });
        },
        closeDialog() {
            this.$emit('close');
        },
        actualizarRegalia() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/pubreg/${this.regalia.id}`, this.regalia)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error actualizando al regalia:', error)
                    });
            }
        },
    },
    watch: {
        id(newId) {
            if (newId) {
                this.fetchRegalia()
            }
        }
    }
};
</script>
