<template>
    <v-card v-if="rol">
        <v-card-title>
            <span class="headline">Actualizar Rol</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="rol.nombre" label="Rol" placeholder="Ej. Administrador" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col> 
                    <v-col cols="12">
                        <v-select v-model="rol.estado" :items="estadoOptions" item-text="text"
                            item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Volver</v-btn>
            <v-btn color="green darken-1" text @click="actualizarRol">Guardar</v-btn>
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
            rol: null,  
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
            await Promise.all([this.fetchRol()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchRol() {
            try {
                const { data } = await this.$axios.get(`/rol/${this.id}`);
                this.rol = data;
            } catch (error) {
                console.error('Error fetching rol:', error);
                this.usuario = null;
            }
        }, 
        closeDialog() {
            this.$emit('close');
        },
        actualizarRol() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/rol/${this.rol.id}`, this.rol)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error actualizando el rol:', error);
                    });
            }
        },
    },
    watch: {
        id(newId) {
            if (newId) {
                this.fetchRol();
            }
        }
    }
};
</script>