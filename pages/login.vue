<template>


    <div>
        <v-img class="mx-auto my-6" max-width="228" src="../static/v.png">
        </v-img>

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <v-form ref="form">
                <v-text-field v-model="logg.usuario" label="Nombre de Usuario" density="compact"
                    placeholder="Nombre de Usuario" prepend-inner-icon="mdi-account" variant="outlined"
                    :error-messages="nombreErrors" required>
                </v-text-field>

                <v-text-field v-model="logg.pass" label="Contraseña"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    @click:append-inner="visible = !visible" :error-messages="passErrors" required>
                </v-text-field>
            </v-form>

            <!-- Mensaje de error -->
            <v-alert v-if="errorMessage" type="error" class="mb-4">
                {{ errorMessage }}
            </v-alert>

            <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login">
                Log In
            </v-btn>
        </v-card>
    </div>

</template>


<script>
export default {
    layout: 'loginLayout',
    data: () => ({
        visible: false,
        errorMessage: '', // Almacena el mensaje de error general
        nombreErrors: [], // Almacena los errores específicos del campo 'nombre'
        passErrors: [], // Almacena los errores específicos del campo 'pass'
        logg: {
            usuario: '',
            pass: ''
        }
    }),
    methods: {
        login() {
            this.validateFields();
            if (this.nombreErrors.length === 0 && this.passErrors.length === 0) {
                this.$axios.post('/usuario/login', this.logg)
                    .then((response) => {
                        const {
                            ok,
                            userData,
                            mensage
                        } = response.data;

                        if (ok) {
                            console.log(ok, " a")
                            console.log('Login exitoso:', userData.nombre);
                            this.errorMessage = ''; // Limpia el mensaje de error si es exitoso
                            this.$router.push('inspire');
                        } else {
                            console.log(ok, " b")
                            this.errorMessage = mensage;
                        }
                    }).catch((error) => {
                        console.error('Error al iniciar sesión:', error); // Para depuración
                        this.errorMessage = 'Usuario o contraseña incorrecta';
                    });
            }
        },
        validateFields() {
            // Limpia los mensajes de error anteriores
            this.nombreErrors = [];
            this.passErrors = [];

            // Verifica si 'nombre' está vacío
            if (!this.logg.usuario) {
                this.nombreErrors.push('El nombre de usuario es obligatorio');
            }

            // Verifica si 'pass' está vacío
            if (!this.logg.pass) {
                this.passErrors.push('La contraseña es obligatoria');
            }
        }
    }
}
</script>