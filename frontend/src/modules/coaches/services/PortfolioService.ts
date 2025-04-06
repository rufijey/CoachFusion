import api from '../../../shared/interceptors/api.ts';

export interface PortfolioData {
    description: string;
    images: { file: File }[];
}

export class PortfolioService {
    static async post(data: PortfolioData) {
        const formData = new FormData();
        formData.append('description', data.description);
        data.images.forEach(image => formData.append('images', image.file));

        return await api.post('/portfolios', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    static async update(id: number, data: PortfolioData) {
        const formData = new FormData();
        formData.append('description', data.description);
        data.images.forEach(image => formData.append('images[]', image.file));

        return await api.patch(`/portfolios/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}
