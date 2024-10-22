<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nuevo Comercio</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="nuevoComercio.nombreComercio" label="Nombre del Comercio"
                                    placeholder="Ej. Bodega Los 3 Hermanos" :rules="[rules.required]"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="nuevoComercio.numUsuario" label="N° Usuario" placeholder="Ej. 99901234"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="nuevoComercio.numTienda" label="N° Tienda" placeholder="Ej. 12345"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-textarea v-model="nuevoComercio.direccion" label="Direccion"
                                    placeholder="Ej. Colonia El Sauce al lado de Little Caesars" :rules="[rules.required]"
                                    required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="nuevoComercio.nombreContacto" label="Nombres del Contacto"
                                    placeholder="Ej. Juan Ramon Padilla" :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="nuevoComercio.rtn" label="RTN" :rules="[rules.required]"
                                    placeholder="Ej. 01012000123456" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="nuevoComercio.telefono" label="Telefono" placeholder="Ej. 12345678"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-autocomplete v-model="nuevoComercio.idCiudad" :items="ciudad" item-text="nombre"
                                    item-value="id" label="Ciudad" required></v-autocomplete>
                            </v-col>
                            <v-col cols="6">
                                <v-select v-model="nuevoComercio.idTipoComercio" :items="tipoComercio"
                                    item-text="nombre" item-value="id" label="Tipo Comercio" required></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="nuevoComercio.latitud" label="Latitud" :rules="[rules.required]"
                                    placeholder="Ej. 15°46'25.7" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="nuevoComercio.longitud" label="Longitud" placeholder="Ej. 15°46'25.7"
                                    :rules="[rules.required]" required></v-text-field>
                            </v-col>
                        </v-row>
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
            nuevoComercio: {
                nombreComercio: '',
                rtn: '',
                direccion: '',
                numTienda: '',
                nombreContacto: '',
                telefono: '',
                numUsuario: '',
                idCiudad: '',
                longitud: '',
                latitud: '',
                idTipoComercio: ''
            },
            ciudad: [],
            tipoComercio: [],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        }
    },
    async mounted() {
        try {
            await Promise.all([this.fetchCiudad(), this.fetchTipoComercio()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        resetForm() {
            this.nuevoComercio = {
                nombreComercio: '',
                rtn: '',
                direccion: '',
                numTienda: '',
                nombreContacto: '',
                telefono: '',
                numUsuario: '',
                idCiudad: '',
                longitud: '',
                latitud: '',
                idTipoComercio: ''
            }
            this.$refs.form.resetValidation();
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
                    console.error('Error fetching tipoComercio:', error);
                });
        },
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        saveComercio() {
            if (this.$refs.form.validate()) {
                this.$axios.post('/comercio', this.nuevoComercio)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando el comercio:', error);
                    });
            }
        }
    }
};
</script>