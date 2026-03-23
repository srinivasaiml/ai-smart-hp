import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// Interceptor to add the correct authorization token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || '';
     const adminRoutePrefixes = [
      '/appointments/all',
      '/auth/admin-login',
      '/contact',
      // You can add other admin route prefixes here in the future
    ];

    // Check if the request URL begins with any of the defined admin prefixes.
    const isAdminRoute = adminRoutePrefixes.some(prefix => url.startsWith(prefix));

    if (isAdminRoute) {
      // If it's a known admin route, attach the admin token.
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // For all other routes, assume it's a regular user and attach the user token.
      const userToken = localStorage.getItem('authToken');
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    // --- END OF FIX ---
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('adminToken');
      window.location.assign('/'); 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;