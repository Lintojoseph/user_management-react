// import api from './api';

// export const userService = {
//   // Get users list
//   getUsers: (params = {}) => {
//     return api.get('/user', { params });
//   },
  
//   // Get single user
//   getUser: (id) => {
//     return api.get(`/user/${id}`);
//   },
  
//   // Create user
//   createUser: (userData) => {
//     const formData = new FormData();
    
//     Object.keys(userData).forEach(key => {
//       if (userData[key] !== null && userData[key] !== undefined) {
//         if (key === 'responsibilities' && Array.isArray(userData[key])) {
//           userData[key].forEach(resp => formData.append('responsibilities[]', resp));
//         } else if (key === 'user_picture' && userData[key] instanceof File) {
//           formData.append('user_picture', userData[key]);
//         } else {
//           formData.append(key, userData[key]);
//         }
//       }
//     });
    
//     return api.post('/user', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },
  
//   // Update user
//   updateUser: (id, userData) => {
//     const formData = new FormData();
//     formData.append('_method', 'put');
    
//     Object.keys(userData).forEach(key => {
//       if (userData[key] !== null && userData[key] !== undefined) {
//         if (key === 'responsibilities' && Array.isArray(userData[key])) {
//           userData[key].forEach(resp => formData.append('responsibilities[]', resp));
//         } else if (key === 'user_picture' && userData[key] instanceof File) {
//           formData.append('user_picture', userData[key]);
//         } else {
//           formData.append(key, userData[key]);
//         }
//       }
//     });
    
//     return api.post(`/user/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },
  
//   // Delete user
//   deleteUser: (id) => {
//     return api.delete(`/user/${id}`);
//   },
  
//   // Change user status
//   changeStatus: (id, status) => {
//     return api.post(`/user/${id}/status`, { status });
//   },
  
//   // Delete user image
//   deleteUserImage: (id) => {
//     return api.delete(`/user/${id}/image`);
//   },
  
//   // Check email exists
//   checkEmailExists: (email) => {
//     return api.post('/user/check-mail-exist', { email });
//   },
  
//   // Get roles dropdown
//   getRoles: () => {
//     return api.post('/role/dropdown', { type: 1 });
//   },
  
//   // Get responsibilities dropdown
//   getResponsibilities: () => {
//     return api.get('/user/dropdown-responsibility');
//   }
// };
import api from './api';

export const userService = {
  // List users
  getUsers: (params = {}) => api.get('/user', { params }),

  // Single user
  getUser: (id) => api.get(`/user/${id}`),

  // Create user
  // Create user
createUser: (userData) => {
  const fd = new FormData();

  Object.keys(userData).forEach((key) => {
    const val = userData[key];

    if (val !== null && val !== undefined) {
      if (key === 'responsibilities' && Array.isArray(val)) {
        // IDs are strings like "01K1WB9V..."
        val.forEach((r) => fd.append('responsibilities[]', r));
      } else if (key === 'user_picture' && val instanceof File) {
        fd.append('user_picture', val);
      } else {
        fd.append(key, val);
      }
    }
  });

  return api.post('/user', fd);
},

// Update user
updateUser: (id, userData) => {
  const fd = new FormData();
  fd.append('_method', 'put');

  Object.keys(userData).forEach((key) => {
    const val = userData[key];

    if (val !== null && val !== undefined) {
      if (key === 'responsibilities' && Array.isArray(val)) {
        val.forEach((r) => fd.append('responsibilities[]', r));
      } else if (key === 'user_picture' && val instanceof File) {
        fd.append('user_picture', val);
      } else {
        fd.append(key, val);
      }
    }
  });

  return api.post(`/user/${id}`, fd);
},

  // Delete
  deleteUser: (id) => api.delete(`/user/${id}`),

  // Status change
  changeStatus: (id, status) => api.post(`/user/${id}/status`, { status }),

  // Delete image
  deleteUserImage: (id) => api.delete(`/user/${id}/image`),

  // Email check — MUST be FormData
//   checkEmailExists: (email) => {
//     const fd = new FormData();
//     fd.append('email', email);
//     return api.post('/user/check-mail-exist', fd);
//   },
// in userService.js
checkEmailExists: (email) => {
  const fd = new FormData();
  fd.append('email', email);

  // pass company_id header exactly as backend expects
  return api.post('/user/check-mail-exist', fd, {
    headers: { company_id: localStorage.getItem('company_id') || '01k1wb9vm3kxzc90p92d95ttps' }
  });
},


  // Roles dropdown — MUST be FormData
  getRoles: () => {
    const fd = new FormData();
    fd.append('type', 1);
    return api.post('/role/dropdown', fd);
  },

  // Responsibilities
  getResponsibilities: () => api.get('/user/dropdown-responsibility'),
};
