<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nuevo Género</span>
        </v-card-title>

        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="nuevoGenero.nombre" label="Nombre" :rules="[rules.required]"
                    required></v-text-field>
                <v-select v-model="nuevoGenero.estado" :items="estadoOptions" item-text="text" item-value="value"
                    label="Estado" required></v-select>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="saveEmpleado">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            nuevoGenero: {
                nombre: '',
                estado: ''
            },
            estadoOptions: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
            ],
            rules: {
                required: value => !!value || 'Requerido.',
            }
        };
    },
    methods: {
        resetForm() {
            this.nuevoGenero = {
                nombre: '',
                estado: ''
            };
            this.$refs.form.resetValidation();
        },
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        saveEmpleado() {
            if (this.$refs.form.validate()) {
                this.$axios.post('http://localhost:3002/api/v1/genero', this.nuevoGenero)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando el genero:', error);
                    });
            }
        }
    }
};
</script>