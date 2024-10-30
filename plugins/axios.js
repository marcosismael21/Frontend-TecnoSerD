import Cookies from 'js-cookie';

export default function ({ $axios }) {
  if (process.client) {
    $axios.defaults.withCredentials = true;
    $axios.onRequest(config => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        const tokenValue = token.split('=')[1];
        config.headers.common['Authorization'] = `Bearer ${tokenValue}`;
      }
    });
  }
}