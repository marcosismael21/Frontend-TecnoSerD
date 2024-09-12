<template>
    <v-card v-if="canal">
        <v-card-title>
            <span class="headline">Detalles del Canal</span>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="canal.nombre" label="Nombre" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="canal.idTipoComercio" :items="tipoComercio" item-text="nombre"
                            item-value="id" label="Tipo Comercio" readonly></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="canal.estado" :items="estadoOptions" item-text="text"
                            item-value="value" label="Estado" readonly></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información del canal.</v-alert>
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
            canal: null,
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
            await Promise.all([this.fetchCanal(), this.fetchTipoComercio()])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    },
    methods: {
        async fetchCanal() {
            try {
                const { data } = await this.$axios.get(`/canal/${this.id}`)
                this.canal = data;
            } catch (error) {
                console.error('Error fetching tipoComercio by ID:', error)
                this.canal = null;
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
    },
    watch: {
        id(newId) {
            if (newId) {
                this.fetchCanal()
            }
        }
    }
};
</script>