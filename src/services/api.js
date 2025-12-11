import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    // do NOT set global Content-Type, let axios decide based on data
    Accept: 'application/json',
  },
});

// Request interceptor to add token and company_id
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     const companyId = process.env.REACT_APP_COMPANY_ID;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     if (companyId) {
//       config.headers['company_id'] = companyId;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url || '';

//     // ✅ Only auto-logout for non-login requests
//     if (status === 401 && !url.includes('/login')) {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';

    // 🚫 for /login do NOT attach token / company_id
    const isLogin = url.includes('/login');

    if (!isLogin) {
      const token = localStorage.getItem('access_token');
      const companyId = localStorage.getItem('company_id');
      console.log('token:', localStorage.getItem('access_token'));
console.log('company_id:', localStorage.getItem('company_id'));


      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (companyId) {
        config.headers['company_id'] = companyId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor – we already fixed to ignore /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (status === 401 && !url.includes('/login')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('company_id');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
export default api;
