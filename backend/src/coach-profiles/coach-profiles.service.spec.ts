import { Test, TestingModule } from '@nestjs/testing';
import { CoachProfilesService } from './coach-profiles.service';
import { Repository } from 'typeorm';
import { CoachProfile, WorkMode } from './coach-profile.entity';
import { PortfoliosService } from '../portfolios/portfolios.service';
import { UsersService } from '../users/users.service';
import { Specialization } from '../specializations/specialization.entity';
import { UserRole } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {ConflictException, NotFoundException} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CoachFilterDto } from './dto/coach-filter.dto';
import { UserDto } from '../users/dto/user.dto';
import { CoachFilter } from './coach.filter';

describe('CoachProfilesService', () => {
    let service: CoachProfilesService;
    let coachProfileRepository: Repository<CoachProfile>;
    let portfolioService: PortfoliosService;
    let userService: UsersService;
    let specializationRepository: Repository<Specialization>;
    let coachFilter: CoachFilter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoachProfilesService,
                PortfoliosService,
                UsersService,
                {
                    provide: getRepositoryToken(CoachProfile),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Specialization),
                    useClass: Repository,
                },
                {
                    provide: PortfoliosService,
                    useValue: { deleteMany: jest.fn() },
                },
                {
                    provide: UsersService,
                    useValue: {
                        getById: jest.fn(),
                        makeCoach: jest.fn(),
                    },
                },
                {
                    provide: CoachFilter,
                    useValue: { getFilterOptions: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<CoachProfilesService>(CoachProfilesService);
        coachProfileRepository = module.get<Repository<CoachProfile>>(getRepositoryToken(CoachProfile));
        portfolioService = module.get<PortfoliosService>(PortfoliosService);
        userService = module.get<UsersService>(UsersService);
        specializationRepository = module.get<Repository<Specialization>>(getRepositoryToken(Specialization));
        coachFilter = module.get<CoachFilter>(CoachFilter);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createProfileDto: CreateProfileDto = {
            specializationIds: [1, 2],
            description: 'Experienced coach in fitness',
            experience: 5,
            city: 'New York',
            workMode: WorkMode.ONLINE,
        };
        const userId = 1;

        it('should create a coach profile', async () => {
            jest.spyOn(service, 'isExist').mockResolvedValue(false);
            jest.spyOn(userService, 'getById').mockResolvedValue(new UserDto(1, 'email@gmail.com', 'username', UserRole.USER));
            jest.spyOn(specializationRepository, 'create').mockImplementation((entity) => {
                return { id: entity.id } as Specialization;
            });
            jest.spyOn(coachProfileRepository, 'create').mockReturnValue({ ...createProfileDto, user: { id: userId } } as any);
            jest.spyOn(coachProfileRepository, 'save').mockResolvedValue({ ...createProfileDto, user: { id: userId } } as any);

            await service.create(createProfileDto, userId);

            expect(coachProfileRepository.create).toHaveBeenCalled();
            expect(coachProfileRepository.save).toHaveBeenCalled();
        });

        it('should throw error if user already has a profile', async () => {
            jest.spyOn(service, 'isExist').mockResolvedValue(true);

            await expect(service.create(createProfileDto, userId)).rejects.toThrowError(ConflictException);
        });
    });

    describe('update', () => {
        it('should update a coach profile', async () => {
            const updateProfileDto: UpdateProfileDto = {
                specializationIds: [2],
                description: 'Updated coach description',
                experience: 6,
                city: 'Los Angeles',
                workMode: WorkMode.OFFLINE,
            };
            const userId = 1;

            const existingProfile = new CoachProfile();
            jest.spyOn(coachProfileRepository, 'findOne').mockResolvedValue(existingProfile);
            jest.spyOn(specializationRepository, 'create').mockImplementation((entity) => {
                return { id: entity.id } as Specialization;
            });
            jest.spyOn(coachProfileRepository, 'save').mockResolvedValue(existingProfile);

            await service.update(updateProfileDto, userId);

            expect(coachProfileRepository.save).toHaveBeenCalled();
        });

        it('should throw error if profile not found', async () => {
            const updateProfileDto: UpdateProfileDto = { specializationIds: [2], description: 'Updated' };
            const userId = 1;

            jest.spyOn(coachProfileRepository, 'findOne').mockResolvedValue(null);

            await expect(service.update(updateProfileDto, userId)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('getFiltered', () => {
        it('should return filtered coaches', async () => {
            const query: CoachFilterDto = { specialization: 1, city: 'New York', minExperience: 2, maxExperience: 6 };
            const coaches = [
                {
                    id: 1,
                    user: { id: 1 },
                    specializations: [{ id: 1 }],
                    portfolioItems: [],
                    description: '',
                    experience: 5,
                    city: 'New York',
                    workMode: 'ONLINE',
                },
            ];

            jest.spyOn(coachFilter, 'getFilterOptions').mockReturnValue({});
            jest.spyOn(coachProfileRepository, 'find').mockResolvedValue(coaches as any);

            const result = await service.getFiltered(query);

            expect(result).toHaveLength(1);
        });
    });

});