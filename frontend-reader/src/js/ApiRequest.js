import axios from 'axios';
import { isTokenExpired, refreshAccessToken } from './TokensHandling';

const api = axios.create({
    baseURL: 'http://localhost:2020/api',
});

api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // If there's no access token or the token is expired, attempt to refresh it
        if (!accessToken || isTokenExpired(accessToken)) {
            if (!refreshToken) throw new Error('Please log in again!');

            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (err) {
                throw new Error(
                    'Failed to refresh token. Please log in again.'
                );
            }
        } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor to handle 401 errors (token expired or invalid)
api.interceptors.response.use(
    (response) => response, // Pass through if request is successful
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers[
                    'Authorization'
                ] = `Bearer ${newAccessToken}`;
                return api(originalRequest); // Retry original request with new token
            } catch (err) {
                throw new Error(
                    'Failed to refresh token. Please log in again.'
                );
            }
        }
        return Promise.reject(error);
    }
);

export default api;
