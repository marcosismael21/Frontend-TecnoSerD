import Cookies from 'js-cookie';

export default function ({ $axios, app, redirect }) {
  if (process.client) {
    $axios.defaults.withCredentials = true;

    // Interceptor para las solicitudes
    $axios.onRequest(config => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        const tokenValue = token.split('=')[1];
        config.headers.common['Authorization'] = `Bearer ${tokenValue}`;
      }
      return config;
    });

    // Interceptor para los errores
    $axios.onResponseError(error => {
      // Verificar si el error es por token expirado (401) o no autorizado
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Limpiar cookies
        Cookies.remove('token');
        Cookies.remove('rol');
        Cookies.remove('id');

        // Buscar el componente de diálogo en el store
        const root = app.context.app.store?.state?.sessionDialog;
        if (root) {
          app.context.app.store.commit('sessionDialog/showDialog');
        } else {
          // Si no se encuentra el diálogo, redirigir directamente
          redirect('/');
        }

        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  }
}
