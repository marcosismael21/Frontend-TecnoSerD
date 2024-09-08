<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nuevo Proveedor</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="nuevoProveedor.nombre" label="Nombre del Proveedor" :rules="[rules.required]" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="nuevoProveedor.estado" :items="estadoOptions" item-text="text" item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="yellow" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green" text @click="saveProveedor">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            nuevoProveedor: {
                nombre: '',
                estado: ''
            },
            estadoOptions: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false }
            ],
            rules: {
                required: value => !!value || 'Requerido.'
            }
        }
    },
    methods: {
        resetForm() {
            this.nuevoProveedor = {
                nombre: '',
                estado: ''
            }
            this.$refs.form.resetValidation();
        },
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        saveProveedor() {
            if (this.$refs.form.validate()) {
                this.$axios.post('/proveedor', this.nuevoProveedor)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando el Proveedor:', error);
                    });
            }
        }
    }
};
</script>
