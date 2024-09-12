<template>
    <v-card v-if="comercio">
        <v-card-title>
            <span class="headline">Actualizar Comercio</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="comercio.nombreComercio" label="Nombre del Comercio"
                                    placeholder="Ej. Bodega Los 3 Hermanos" :rules="[rules.required]"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="comercio.numUsuario" label="N° Usuario" placeholder="Ej. 99901234"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="comercio.numTienda" label="N° Tienda" placeholder="Ej. 12345"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-textarea v-model="comercio.direccion" label="Direccion"
                                    placeholder="Ej. Colonia El Sauce al lado de Little Caesars" :rules="[rules.required]"
                                    required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="comercio.nombreContacto" label="Nombres del Contacto"
                                    placeholder="Ej. Juan Ramon Padilla" :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="comercio.rtn" label="RTN" :rules="[rules.required]"
                                    placeholder="Ej. 01012000123456" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="comercio.telefono" label="Telefono" placeholder="Ej. 12345678"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-select v-model="comercio.idCiudad" :items="ciudad" item-text="nombre"
                                    item-value="id" label="Ciudad" required></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-select v-model="comercio.idTipoComercio" :items="tipoComercio"
                                    item-text="nombre" item-value="id" label="Tipo Comercio" required></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="comercio.latitud" label="Latitud" :rules="[rules.required]"
                                    placeholder="Ej. 15°46'25.7" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="comercio.longitud" label="Longitud" placeholder="Ej. 15°46'25.7"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
            <v-btn color="green darken-1" text @click="actualizarComercio">Guardar</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información del comercio.</v-alert>
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
            comercio: null,
            ciudad: [],
            tipoComercio: [],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        };
    },
    async mounted() {
        try {
            await Promise.all([this.fetchCiudad(), this.fetchTipoComercio(), this.fetchComercio()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchComercio() {
            try {
                const { data } = await this.$axios.get(`/comercio/${this.id}`);
                this.comercio = data;
            } catch (error) {
                console.error('Error fetching comercio by ID:', error);
                this.comercio = null;
            }
        },
        fetchCiudad() {
            this.$axios.get('/ciudad')
                .then(response => {
                    this.ciudad = response.data;
                })
                .catch(error => {
                    console.error('Error fetching ciudad:', error);
                });
        },
        fetchTipoComercio() {
            this.$axios.get('/tipcom')
                .then(response => {
                    this.tipoComercio = response.data;
                })
                .catch(error => {
                    console.error('Error fetching Tipo Comercio:', error);
                });
        },
        closeDialog() {
            this.$emit('close');
        },
        actualizarComercio() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/comercio/${this.comercio.id}`, this.comercio)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error actualizando el comercio:', error);
                    });
            }
        },
    },
    watch: {
        id(newId) {
            if (newId) {
                this.fetchComercio();
            }
        }
    }
};
</script>