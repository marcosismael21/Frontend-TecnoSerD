import Cookies from 'js-cookie';

export default function ({ $axios }) {
  $axios.onRequest(config => {
    if (process.client) {
      const token = Cookies.get('token');
      if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  });
}

  