<template>
    <v-card>
        <v-card-title>
            <span class="headline">Nuevo Usuario</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoUsuario.nombres" label="Nombres" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoUsuario.usuario" label="Nombre de usuario" :rules="[rules.required]"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="nuevoUsuario.pass" :append-icon="verContra ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="verContra ? 'text' : 'password'" label="Contraseña"
                            :rules="[rules.required, rules.min]" @click:append="verContra = !verContra"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="nuevoUsuario.idrol" :items="roles" item-text="nombre" item-value="id"
                            label="Roles" required></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-select v-model="nuevoUsuario.estado" :items="estadoOptions" item-text="text"
                            item-value="value" label="Estado" required></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="yellow" text @click="closeDialog">Cancelar</v-btn>
            <v-btn color="green" text @click="saveUsuario">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            verContra: false,
            valid: false,
            nuevoUsuario: {
                nombres: '',
                usuario: '',
                pass: '',
                idrol: '',
                estado: ''
            },
            roles: [],
            estadoOptions: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
            ],
            rules: {
                required: value => !!value || 'Requerido.',
                min: v => v.length >= 8 || 'Min 8 caracteres',
            }
        }
    },
    mounted() {
        this.fetchRoles();
    },
    methods: {
        resetForm() {
            this.nuevoUsuario = {
                nombres: '',
                usuario: '',
                pass: '',
                idrol: '',
                estado: ''
            }
            this.$refs.form.resetValidation();
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
            this.resetForm();
            this.$emit('close');
        },
        saveUsuario() {
            if (this.$refs.form.validate()) {
                this.$axios.post('/usuario', this.nuevoUsuario)
                    .then(response => {
                        this.$emit('saved');
                        this.closeDialog();
                    })
                    .catch(error => {
                        console.error('Error guardando el usuario:', error);
                    });
            }
        }
    }
};
</script>