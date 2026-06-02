import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (data) => axios.post('http://127.0.0.1:8000/api/users/register/', data);
export const loginUser = (data) => axios.post('http://127.0.0.1:8000/api/users/login/', data);
export const getProfile = () => API.get('/users/profile/');

export default API;