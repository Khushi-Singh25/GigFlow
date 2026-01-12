const isProduction = window.location.hostname.includes('vercel.app');

export const API_URL = isProduction 
  ? 'https://gigflow-server.onrender.com' 
  : 'http://localhost:5001';
