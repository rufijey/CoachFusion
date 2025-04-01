
import api from '../../../shared/interceptors/api.ts';


export class SpecializationService {

    static async getAll() {
        return await api.get('/specializations');
    }

}