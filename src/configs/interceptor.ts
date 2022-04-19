import axios from 'axios';
import history from './history';

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      history.push('/login');
    }

    if (error.response.status === 423) {
      history.push('/must-change-password');
    }

    if (error.response.status === 403) {
      history.push('/forbidden');
    }

    return Promise.reject(error);
  },
);
