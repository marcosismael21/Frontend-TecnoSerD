<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nuevo Tipo de Equipo</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="nuevoTipoEquipo.nombre" label="Nombre del Tipo de Equipo" :rules="[rules.required]" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="nuevoTipoEquipo.idProveedor" :items="proveedores" item-text="nombre" item-value="id" label="Proveedor" required></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="nuevoTipoEquipo.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="yellow" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green" text @click="saveTipoEquipo">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            nuevoTipoEquipo: {
                nombre: '',
                idProveedor: null,
                estado: ''
            },
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
        await this.fetchProveedores();
    },
    methods: {
        resetForm() {
            this.nuevoTipoEquipo = {
                nombre: '',
                idProveedor: null,
                estado: ''
            }
            this.$refs.form.resetValidation();
        },
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        saveTipoEquipo() {
            if (this.$refs.form.validate()) {
                this.$axios.post('/tipoEquipo', this.nuevoTipoEquipo)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando el Tipo de Equipo:', error);
                    });
            }
        },
        async fetchProveedores() {
            try {
                const { data } = await this.$axios.get('/proveedor');
                this.proveedores = data;
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            }
        }
    }
};
</script>
