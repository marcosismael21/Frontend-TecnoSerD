<template>
  <v-row no-gutters class="auth-wrapper" align="center" justify="center"
    style="height: 100vh; background: rgb(184, 233, 255);">
    <!-- División con la tarjeta de inicio de sesión centrada -->
    <div class="login-pane" style="display: flex; align-items: center; justify-content: center; width: 100%;">
      <v-card flat max-width="400" class="pa-4 elevation-12" style="border-radius: 16px;">
        <!-- Logo en la parte superior izquierda -->
        <v-card-text class="d-flex align-start mb-4">
          <v-img src="/Logo.jpg" max-width="150" />
        </v-card-text>

        <v-card-text class="text-center">
          <h4 class="text-h4 mb-3">
            BIENVENIDO
          </h4>
        </v-card-text>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <!-- Campo de correo electrónico -->
              <v-col cols="12">
                <v-text-field v-model="logg.usuario" label="Nombre de Usuario" density="compact"
                  placeholder="Ingrese su nombre de usuario" prepend-inner-icon="mdi-account" variant="outlined"
                  :error-messages="nombreErrors" required @keyup.enter="login">
                </v-text-field>
              </v-col>

              <!-- Campo de contraseña -->
              <v-col cols="12">
                <v-text-field v-model="logg.pass" label="Contraseña"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                  density="compact" placeholder="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                  @click:append-inner="visible = !visible" :error-messages="passErrors" required @keyup.enter="login">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Mensaje de error -->
                <v-alert v-if="errorMessage" type="error" class="mb-4">
                  {{ errorMessage }}
                </v-alert>
                <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login">
                  Iniciar Sesión
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-row>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
}

.login-pane {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.text-center {
  text-align: center;
}
</style>

<script>
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
              Cookies.set('token', response.data.token, { expires: response.data.expiresIn })
              Cookies.set('rol', userData.idrol)
              Cookies.set('id', userData.id)
              if (userData.idrol == 2) {
                this.$router.push('tecnico')
              } else {
                this.$router.push('tablero')
              }

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
