'use client'
import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { cookies } from 'next/headers';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://herstyleapi.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials:true
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('auth_token')
    config.headers.Authorization = !config.headers._retry && token ?` Bearer ${token}` : config.headers.Authorization;
    return config;
  }
);



axiosInstance.interceptors.response.use(
  (response) => response, // Handle successful responses
  async (error: any) => {
    // Check if the error response exists and the status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Remove user-related data from localStorage and cookies
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      
      // Make sure you are using the correct method to delete the cookie
      deleteCookie('auth_token'); // Make sure 'auth_token' is the correct cookie name
    }

    // Return the error to propagate it
    return Promise.reject(error);
  })

export default axiosInstance;
