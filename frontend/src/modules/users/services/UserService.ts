import axios from 'axios';
import { getFingerprint } from '../../../shared/utils/getFingerprint.ts';
import api from '../../../shared/interceptors/api.ts';

export interface loginData {
    email: string;
    password: string;
}

export interface registerData {
    email: string;
    password: string;
}

export interface userData {
    email: string;
    password: string;
    name: string;
    profileImage?: { file: File };
}

export class UserService {

    static async login(data: loginData) {
        return await api.post('/auth/login', data, { withCredentials: true });
    }

    static async register(data: registerData) {
        return await api.post('/auth/registration', data, { withCredentials: true });
    }

    static async logout() {
        return await api.post('/auth/logout', {}, { withCredentials: true });
    }

    static async refresh() {
        const fingerprint = await getFingerprint();

        return await axios.post('/auth/refresh', {},
            {
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'fingerprint': fingerprint,
                },
                withCredentials: true,
            },
        );
    }

    static async getUser() {
        return await api.get('/auth/me');
    }

    static async update(data: userData) {
        console.log(data);
        const formData = new FormData();
        if (data.profileImage) {
            formData.append('image', data.profileImage.file);
        }
        formData.append('name', data.name);
        formData.append('password', data.password);
        formData.append('email', data.email);
        return await api.patch('/users', formData);
    }
}