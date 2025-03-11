import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {CoachProfile} from "./coach-profile.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {PortfoliosService} from "../portfolios/portfolios.service";
import {UsersService} from "../users/users.service";
import {UserRole} from "../users/user.entity";
import {UpdateProfileDto} from "./dto/update-profile.dto";
import {CoachDto} from "./dto/coach.dto";
import {CoachFilter} from "./coach.filter";
import {CoachFilterDto} from "./dto/coach-filter.dto";
import {Specialization} from "../specializations/specialization.entity";

@Injectable()
export class CoachProfilesService {

    constructor(@InjectRepository(CoachProfile) private coachProfileRepository: Repository<CoachProfile>,
                @InjectRepository(Specialization) private specializationRepository: Repository<Specialization>,
                private portfolioService: PortfoliosService,
                private userService: UsersService,
                private coachFilter: CoachFilter
    ) {
    }

    async get(): Promise<CoachDto[]> {
        const coaches = await this.coachProfileRepository.find({
            relations: {
                user: true,
                specializations: true,
                portfolioItems: {
                    images: true
                }
            }
        });

        return coaches.map(coach => CoachDto.create(coach))

    }

    async getFiltered(query: CoachFilterDto): Promise<CoachDto[]> {

        const options = this.coachFilter.getFilterOptions(query);

        options.relations = {
            user: true,
            specializations: true,
            portfolioItems: {
                images: true
            }
        };

        const coaches = await this.coachProfileRepository.find(options);

        return coaches.map(coach => CoachDto.create(coach));
    }


    async create(createProfileDto: CreateProfileDto, userId: number): Promise<void> {

        console.log(createProfileDto)

        await this.isExist(userId);

        const specializations =
            createProfileDto.specializationIds.map(id => this.specializationRepository.create({id: id}));

        const profile = this.coachProfileRepository.create({
            ...createProfileDto,
            specializations,
            user: {id: userId}
        })

        await this.coachProfileRepository.save(profile)

        const user = await this.userService.getById(userId)

        if (user.role === UserRole.USER) {
            await this.userService.makeCoach(userId)
        }

    }

    async update(updateProfileDto: UpdateProfileDto, userId: number): Promise<void> {
        const profile = await this.coachProfileRepository.findOne({
            where: { user: {id: userId} },
        });

        if (!profile) {
            throw new NotFoundException(`Coach profile not found`);
        }

        await this.coachProfileRepository.update(profile.id, updateProfileDto)
    }

    async delete(userId: number): Promise<void> {
        const profile = await this.coachProfileRepository.findOne({
            where: { user: {id: userId} },
        });

        if (!profile) {
            throw new NotFoundException(`Coach profile not found`);
        }

        if (profile.portfolioItems && profile.portfolioItems.length > 0) {
            const portfolioItemIds = profile.portfolioItems.map(item => item.id);
            await this.portfolioService.deleteMany(portfolioItemIds);
        }

        await this.coachProfileRepository.delete(profile.id);
    }

    async isExist(userId: number): Promise<boolean> {
        const profile = this.coachProfileRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        });

        return !!profile;
    }
}