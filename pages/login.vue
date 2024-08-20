<template>


    <div>
        <v-img class="mx-auto my-6" max-width="228" src="../static/logo1.jpg">
        </v-img>

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <v-form ref="form">
                <v-text-field v-model="logg.nombre" label="Nombre de Usuario" density="compact"
                    placeholder="Nombre de Usuario" prepend-inner-icon="mdi-account" variant="outlined" required>
                </v-text-field>

                <v-text-field v-model="logg.pass" label="Contraseña"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" placeholder="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                    @click:append-inner="visible = !visible" required>
                </v-text-field>
            </v-form>

            <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login">
                Log In
            </v-btn>

            <v-btn color="blue darken-1" text @click="login">Login</v-btn>

        </v-card>
    </div>

</template>


<script>
export default {
    data: () => ({
        visible: false,
        logg: {
            nombre: '',
            pass: ''
        }
    }),
    methods: {
        login() {
            if (this.$refs.form.validate()) {
                this.$axios.post('http://localhost:3010/api/v1/auth/login', this.logg)
                    .then(() => {
                        //this.$router.push({ name: 'index' });
                        console.log("hola mundo")
                    }).catch((error) => {
                        console.error('Error creando al cliente:', error);
                    });
            }
        }
    }
}
</script>