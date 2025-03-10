import {Injectable} from '@nestjs/common';
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

@Injectable()
export class CoachProfilesService {

    constructor(@InjectRepository(CoachProfile) private coachProfileRepository: Repository<CoachProfile>,
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

        await this.isExist(userId);

        const profile = this.coachProfileRepository.create({
            ...createProfileDto,
            user: {id: userId}
        })

        await this.coachProfileRepository.save(profile)

        const user = await this.userService.getById(userId)

        if (user.role === UserRole.USER) {
            await this.userService.makeCoach(userId)
        }

    }

    async update(updateProfileDto: UpdateProfileDto, coachProfileId: number): Promise<void> {
        await this.coachProfileRepository.update(coachProfileId, updateProfileDto)
    }

    async delete(profileId: number): Promise<void> {
        const profile = await this.coachProfileRepository.findOne({
            where: { id: profileId },
            relations: {
                portfolioItems: true,
                user: true
            },
        });

        if (profile && profile.portfolioItems) {
            const portfolioItemIds = profile.portfolioItems.map(item => item.id);
            await this.portfolioService.deleteMany(portfolioItemIds);
        }

        await this.coachProfileRepository.delete(profileId);
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