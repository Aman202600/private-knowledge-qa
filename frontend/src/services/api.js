import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // If backend is down (network error)
        if (!error.response) {
            toast.error('Network Error: Backend seems to be offline.');
            return Promise.reject(error);
        }

        // Pass through error
        return Promise.reject(error);
    }
);

export const endpoints = {
    health: '/api/health',
    documents: '/api/documents',
    upload: '/api/documents/upload',
    query: '/api/query',
};

export default api;
