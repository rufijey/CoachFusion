import api from '../../../shared/interceptors/api.ts';

export interface PostData {
    description: string;
    city: string;
    experience: number;
    workMode: 'online' | 'offline' | 'both';
    specializations: {id: number}[];
}

export interface UpdateData extends PostData {
    id: number;
}
export interface FilterData {
    specialization?: number;
    minExperience?: number;

    maxExperience?: number;

    readonly city?: string;

    readonly workMode?: 'online' | 'offline' | 'both';

    sortBy?: 'experience' | 'name' | 'createdAt';

    sortDirection?: 'ASC' | 'DESC';
}


export class CoachService {
    static async post(data: PostData) {
        data.experience = Number(data.experience)

        return await api.post('/coaches', {
            ...data,
            specializationIds: data.specializations.map(spec => spec.id)
        });
    }

    static async update(data: UpdateData) {
        data.experience = Number(data.experience)

        return await api.patch(`/coaches`, {
            ...data,
            specializationIds: data.specializations.map(spec => spec.id)
        });
    }

    static async getFiltered(data: FilterData) {
        return await api.get('/coaches/filtered', {
            params: data
        });
    }

}
