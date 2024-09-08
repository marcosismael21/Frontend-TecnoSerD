<template>
    <v-card v-if="usuario">
        <v-card-title>
            <span class="headline">Actualizar Género</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="usuario.nombres" label="Nombres" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="usuario.usuario" label="Nombre de usuario" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="usuario.pass" :append-icon="verContra ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="verContra ? 'text' : 'password'" label="Contraseña"
                            :rules="[rules.required, rules.min]" @click:append="verContra = !verContra"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="usuario.idrol" :items="roles" item-text="nombre" item-value="id"
                            label="Roles" required></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="usuario.estado" :items="estadoOptions" item-text="text" item-value="value"
                            label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Volver</v-btn>
            <v-btn color="blue darken-1" text @click="actualizarUsuario">Guardar</v-btn>
        </v-card-actions>
    </v-card>
    <v-alert v-else type="error">No se pudo cargar la información del usuario.</v-alert>
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
            usuario: null,
            verContra: false,
            roles: [],
            valid: false,
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
            await Promise.all([this.fetchUsuario(), this.fetchRoles()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchUsuario() {
            try {
                const { data } = await this.$axios.get(`/usuario/${this.id}`);
                this.usuario = data;
            } catch (error) {
                console.error('Error fetching usuario by ID:', error);
                this.usuario = null;
            }
        },
        fetchRoles() {
            this.$axios.get('/rol')
                .then(response => {
                    this.roles = response.data;
                })
                .catch(error => {
                    console.error('Error fetching roles:', error);
                });
        },
        closeDialog() {
            this.$emit('close');
        },
        actualizarUsuario() {
            if (this.$refs.form.validate()) {
                this.$axios.put(`/usuario/${this.usuario.id}`, this.usuario)
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
                this.fetchUsuario();
            }
        }
    }
};
</script>
