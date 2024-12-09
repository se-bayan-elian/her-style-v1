'use client';

import axios from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useEffect, useLayoutEffect } from 'react';

const useAxiosInstance = () => {
  // Create Axios instance
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://herstyleapi.onrender.com/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Ensure cookies are sent
  });

  useLayoutEffect(() => {
    // Request Interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = getCookie('auth_token'); // Retrieve auth token from cookies
        console.log('token',token)
        if (token && !config.headers._retry) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If Unauthorized (401) and not retried yet, attempt to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'https://herstyleapi.onrender.com/api/v1'}/users/refresh-token`,
              { withCredentials: true } // Ensure cookies are sent
            );

            // Update auth token in cookies
            setCookie('auth_token', data.auth_token, { path: '/' });
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.auth_token}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Remove cookies and local storage data
            deleteCookie('auth_token');
            deleteCookie('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on component unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosInstance;
