// Dynamic API URL configuration
// Automatically switches between Localhost and Production based on the hostname

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isLocalhost
  ? 'http://localhost:5001'
  : 'https://gigflow-server.onrender.com';
