<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nueva Ciudad</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="nuevoCiudad.nombre" label="Ciudad" placeholder="Ej. Olanchito":rules="[rules.required]"
                            required></v-text-field>
                    </v-col> 
                    <v-col cols="12">
                        <v-select v-model="nuevoCiudad.estado" :items="estadoOptions" item-text="text"
                            item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="saveCiudad">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            nuevoCiudad: {
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
        }
    }, 
    methods: {
        resetForm() {
            this.nuevoCiudad = {
                nombre: '', 
                estado: ''
            }
            this.$refs.form.resetValidation();
        }, 
        closeDialog() {
            this.resetForm();
            this.$emit('close');
        },
        saveCiudad() {
            if (this.$refs.form.validate()) {
                this.$axios.post('/ciudad', this.nuevoCiudad)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando la Ciudad:', error);
                    });
            }
        }
    }
};
</script>