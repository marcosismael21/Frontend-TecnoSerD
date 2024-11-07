<template>
    
    <div class="unauthorized-page"> 
        <h1 style="color: #f00; padding-bottom: 10px;">Acceso no autorizado </h1>
      <p style="color: #666;">Parece que no tienes permiso para acceder a esta página.</p>
      <p style="color: #666;">Por favor, inicia sesión con una cuenta diferente.</p>
      <button class="btn btn-primary" @click="logout">Iniciar Sesion con Cuenta Diferente</button>
      <div class="img">  
    </div>
    </div>
  </template> 
  

  
  <script>
  export default {
    name: 'UnauthorizedPage',
    methods: {
      logout() { 
        this.$router.push('/login2');
      }
    }
  }
  </script>
  
  <style>
  .unauthorized-page {
    text-align: center;
    padding: 20px; 
    background-position: center; 
  }
  
  .img{
    background-image: url('static/login.png');
     
    padding: 200px; 
    background-position: center; 
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: #fff;
  }
  </style>