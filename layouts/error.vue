<template>
  <v-app :class="errorPageClass">
    <v-container class="text-center">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" md="6" class="text-center">
          <v-container margin="100px"></v-container>
          <v-container margin="100px"></v-container>
          <v-img
            src="/error.png"
            alt="Error Image"
            class="mx-auto mb-5"
            max-width="1250"
          ></v-img>
          <h1 :class="textClass" class="display-1 font-weight-bold">Ups!</h1>
          <p :class="textClass" class="subtitle-1">Parece que no se encontró el sitio. Contactate con tu jefe!</p>
          <p :class="textClass">Código de Error: 404</p>
          <v-btn color="primary" dark large class="mt-5">
            <NuxtLink to="/" class="home-link">Inicio</NuxtLink>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'ErrorPage',
  computed: {
    isDark() {
      return this.$vuetify.theme.dark;
    },
    textClass() {
      return this.isDark ? 'dark-text' : 'light-text';
    },
    errorPageClass() {
      return this.isDark ? 'dark-background' : 'light-background';
    },
  },
}
</script>

<style scoped>
.error-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.display-1 {
  font-size: 8rem;
  margin-bottom: 20px;
}

.subtitle-1 {
  font-size: 5rem;
}

.home-link {
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

.home-link:hover {
  text-decoration: underline;
}


.light-text {
  color: black;
}

.light-background {
  background-color: #f5f5f5;
}

.dark-text {
  color: white;
}

.dark-background {
  background-color: #121212;
}
</style>
