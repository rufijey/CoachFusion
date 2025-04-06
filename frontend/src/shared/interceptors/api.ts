import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getFingerprint } from '../utils/getFingerprint.ts';
import { logout, refresh } from '../../modules/users/store/authThunks.ts';

const api = axios.create({
    baseURL : 'http://localhost:3000/api'
});

let store: any;
import('../../shared/store/store.ts').then((module) => {
    store = module.store;
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    const fingerprint = await getFingerprint();

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers) {
        config.headers['fingerprint'] = fingerprint;
    }

    return config;
}, (error: AxiosError) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (!error.config || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (!error.config.headers) {
            return Promise.reject(error);
        }

        if (!(error.config as any)._retry) {
            (error.config as any)._retry = true;
            try {
                const resultAction = await store.dispatch(refresh());
                if (refresh.fulfilled.match(resultAction)) {
                    error.config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
                    return api.request(error.config);
                }
            } catch (err) {
                await store.dispatch(logout());
            }
        } else {
            await store.dispatch(logout());
        }

        return Promise.reject(error);
    }
);

export default api;
