import {FindOptionsWhere, FindManyOptions, MoreThanOrEqual, LessThanOrEqual, Between} from 'typeorm';
import {CoachProfile} from './coach-profile.entity';
import {CoachFilterDto} from "./dto/coach-filter.dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class CoachFilter {
    private readonly callbacks: Record<string, (query: CoachFilterDto, options: FindManyOptions<CoachProfile>) => void>;

    constructor() {
        this.callbacks = {
            specialization: this.specialization.bind(this),
            minExperience: this.minExperience.bind(this),
            maxExperience: this.maxExperience.bind(this),
            sortBy: this.sortBy.bind(this),
        };
    }

    getFilterOptions(filterDto: CoachFilterDto): FindManyOptions<CoachProfile> {
        const options: FindManyOptions<CoachProfile> = {where: {}};

        for (const key in this.callbacks) {
            if (filterDto[key] !== undefined) {
                this.callbacks[key](filterDto, options);
            }
        }

        return options;
    }

    private specialization(query: CoachFilterDto, options: FindManyOptions<CoachProfile>) {
        if (query.specialization) {
            (options.where as FindOptionsWhere<CoachProfile>).specializations = {
                id: query.specialization
            };
        }
    }

    private minExperience(query: CoachFilterDto, options: FindManyOptions<CoachProfile>) {
        const where = options.where as FindOptionsWhere<CoachProfile>;

        if (query.minExperience !== undefined && query.maxExperience !== undefined) {
            where.experience = Between(query.minExperience, query.maxExperience);
        }
        else if (query.minExperience !== undefined) {
            where.experience = MoreThanOrEqual(query.minExperience);
        }
    }

    private maxExperience(query: CoachFilterDto, options: FindManyOptions<CoachProfile>) {
        if (query.minExperience !== undefined && query.maxExperience !== undefined) {
            return;
        }

        if (query.maxExperience !== undefined) {
            const where = options.where as FindOptionsWhere<CoachProfile>;
            where.experience = LessThanOrEqual(query.maxExperience);
        }
    }

    private sortBy(query: CoachFilterDto, options: FindManyOptions<CoachProfile>) {
        if (query.sortBy) {
            const direction = query.sortDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            options.order = {[query.sortBy]: direction};
        } else {
            options.order = {createdAt: 'DESC'};
        }
    }
}
