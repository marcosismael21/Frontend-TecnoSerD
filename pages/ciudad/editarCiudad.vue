<template>
    <v-card v-if="ciudad">
        <v-card-title>
            <span class="headline">Actualizar Ciudad</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="ciudad.nombre" label="Cuidad" placeholder="Ej. Olanchito" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>                 
                    <v-col cols="12">
                        <v-select v-model="ciudad.estado" :items="estadoOptions" item-text="text" item-value="value"
                            label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
            <v-btn color="green darken-1" text @click="actualizarCiudad">Guardar</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información de la cuidad.</v-alert>
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
            ciudad: null,  
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
            await Promise.all([this.fetchCiudad()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchCiudad() {
            try {
                const { data } = await this.$axios.get(`/ciudad/${this.id}`);
                this.ciudad = data;
            } catch (error) {
                console.error('Error fetching ciudad by ID:', error);
                this.usuario = null;
            }
        }, 
        closeDialog() {
            this.$emit('close');
        },
        actualizarCiudad() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/ciudad/${this.ciudad.id}`, this.ciudad)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error actualizando al genero:', error);
                    });
            }
        },
    },
    watch: {
        id(newId) {
            if (newId) {
                this.fetchCiudad();
            }
        }
    }
};
</script>
