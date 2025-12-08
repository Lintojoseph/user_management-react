import api from './api';

export const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('ip_address', '127.0.0.1');

     const response = await api.post('/login', formData);
     console.log(response,'response of auth')

    const data = response.data;

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
