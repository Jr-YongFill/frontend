import axios from 'axios';

const BASE_URL = `http://${process.env.REACT_APP_HOST_IP}:${process.env.REACT_APP_HOST_PORT}`;

export const baseAPI = axios.create({
    baseURL: BASE_URL,
});