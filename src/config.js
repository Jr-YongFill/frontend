import axios from 'axios';

const getTokenType = () => localStorage.getItem('tokenType');
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const BASE_URL = `http://${process.env.REACT_APP_HOST_IP}:${process.env.REACT_APP_HOST_PORT}`;

export const baseAPI = axios.create({
    baseURL: BASE_URL,
});

const refreshAccessToken = async () => {
    try {
        const response = await baseAPI.get(`/api/auth/refresh`);

        localStorage.setItem('accessToken', response.data);
    } catch (error) {
        localStorage.clear();
        window.location.href = '/';
    }
}

baseAPI.interceptors.request.use(async config => {
    const tokenType = getTokenType();
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
    }

    if (refreshToken) {
        config.headers['REFRESH_TOKEN'] = refreshToken;
    }

    return config;
});

baseAPI.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    if (getRefreshToken() && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshAccessToken();
        return baseAPI(originalRequest);
    }

    return Promise.reject(error);
});