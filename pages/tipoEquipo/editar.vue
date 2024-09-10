<template>
    <v-card v-if="equipo">
        <v-card-title>
            <span class="headline">Editar Equipo</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="equipo.nombre" label="Nombre del Equipo" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="equipo.idProveedor" :items="proveedores" item-text="nombre" item-value="id"
                            label="Proveedor" required></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="equipo.estado" :items="estadoOptions" item-text="text" item-value="value"
                            label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="yellow" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green" text @click="updateEquipo">Guardar</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información del equipo.</v-alert>
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
            proveedores: [],
            estadoOptions: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false }
            ],
            rules: {
                required: value => !!value || 'Requerido.'
            }
        }
    },
    async mounted() {
        try {
            await Promise.all([this.fetchEquipo(), this.fetchProveedores()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchEquipo() {
            try {
                const { data } = await this.$axios.get(`/tipoequipo/${ this.id }`);
                this.equipo = data;
            } catch (error) {
                console.error('Error fetching equipo by ID:', error);
                this.equipo = null;
            }
        },
        async fetchProveedores() {
            try {
                const { data } = await this.$axios.get('/proveedor');
                this.proveedores = data;
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            }
        },
        closeDialog() {
            this.$emit('close');
        },
        updateEquipo() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/tipoequipo/${this.equipo.id}`, this.equipo)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error actualizando el equipo:', error);
                    });
            }
        }
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