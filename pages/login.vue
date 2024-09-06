<template>
    <v-row no-gutters class="auth-wrapper">
        <!-- Columna izquierda con la imagen -->
        <v-col md="8" class="d-none d-md-flex">
            <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
                <div class="d-flex align-center justify-center w-100 h-100">
                    <v-img max-width="505" src="/login-bg-BprgzFH_.png" class="auth-illustration mt-16 mb-2" />
                </div>
            </div>
        </v-col>

        <!-- Columna derecha con la tarjeta de inicio de sesión -->
        <v-col cols="12" md="4" class="d-flex align-center justify-center">
            <v-card flat max-width="500" class="mt-12 mt-sm-0 pa-4">
                <v-card-text>
                    <h4 class="text-h4 mb-1">
                        ¡Bienvenidos a <span class="text-capitalize">Nombre del sistema</span>!
                    </h4>
                </v-card-text>
                <v-card-text>
                    <v-form ref="form">
                        <v-row>
                            <!-- Campo de correo electrónico -->
                            <v-col cols="12">
                                <v-text-field v-model="logg.usuario" label="Nombre de Usuario" density="compact"
                                    placeholder="Ingrese si nombre de usuario" prepend-inner-icon="mdi-account"
                                    variant="outlined" :error-messages="nombreErrors" required>
                                </v-text-field>
                            </v-col>

                            <!-- Campo de contraseña -->
                            <v-col cols="12">
                                <v-text-field v-model="logg.pass" label="Contraseña"
                                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                    :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña"
                                    prepend-inner-icon="mdi-lock-outline" variant="outlined"
                                    @click:append-inner="visible = !visible" :error-messages="passErrors" required>
                                </v-text-field>
                            </v-col>


                            <v-col cols="12">
                                <!-- Mensaje de error -->
                                <v-alert v-if="errorMessage" type="error" class="mb-4">
                                    {{ errorMessage }}
                                </v-alert>
                                <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login">
                                    Log In
                                </v-btn>

                            </v-col>


                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>



<script>
import axios from 'axios';
import Cookies from 'js-cookie';

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
        async login() {
            this.validateFields();
            if (this.nombreErrors.length === 0 && this.passErrors.length === 0) {
                this.$axios.post('/usuario/login', this.logg, { withCredentials: true })
                    .then((response) => {
                        const {
                            ok,
                            userData,
                            mensage
                        } = response.data;

                        if (ok) {
                            /*console.log(ok, " a")
                            console.log('Login exitoso:', userData.nombre);
                            this.errorMessage = ''; // Limpia el mensaje de error si es exitoso
                            this.$router.push('inspire');*/
                            Cookies.set('token', response.data.token, { expires: response.data.expiresIn / (24 * 60 * 60) });
                            this.$router.push('inspire')
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