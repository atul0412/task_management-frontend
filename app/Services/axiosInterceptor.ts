// apiClient.js

import axios from 'axios';
import { clearSecureLocalStorage, getSecureJsonValueFromLocalStorage } from './core.services';
import { DeleteAllCookies } from '../utils/utils';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getSecureJsonValueFromLocalStorage('aToken');

        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            if (
                status === 401 ||
                (data.msg && (data.msg === 'UNAUTHORIZED' || data.msg === 'Token_eTOKEN_EXPIREDxpired'))
            ) {
                
                clearSecureLocalStorage();

                DeleteAllCookies();
                window.location.href = '/'; 
            }
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;
