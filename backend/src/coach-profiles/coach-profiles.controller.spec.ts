import { Test, TestingModule } from '@nestjs/testing';
import { CoachProfilesController } from './coach-profiles.controller';
import { CoachProfilesService } from './coach-profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CoachDto } from './dto/coach.dto';
import { CoachFilterDto } from './dto/coach-filter.dto';
import {WorkMode} from "./coach-profile.entity";
import {SpecializationDto} from "../specializations/dto/specialization.dto";
import {PortfolioItemDto} from "../portfolios/dto/portfolio-item.dto";

describe('CoachProfilesController', () => {
    let controller: CoachProfilesController;
    let service: CoachProfilesService;

    const mockCoachProfilesService = {
        get: jest.fn(),
        getFiltered: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const coachDto: CoachDto = {
        id: 1,
        description:'description',
        specializations:[],
        portfolioItems:[],
        experience:1,
        city: 'Kiev',
        workMode: WorkMode.ONLINE,
        email:'email@gmail.com',
        name:'name',
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CoachProfilesController],
            providers: [
                {
                    provide: CoachProfilesService,
                    useValue: mockCoachProfilesService,
                },
            ],
        }).compile();

        controller = module.get<CoachProfilesController>(CoachProfilesController);
        service = module.get<CoachProfilesService>(CoachProfilesService);

        mockCoachProfilesService.get.mockResolvedValue(coachDto);
        mockCoachProfilesService.getFiltered.mockResolvedValue(coachDto);
        mockCoachProfilesService.create.mockResolvedValue(undefined);
        mockCoachProfilesService.update.mockResolvedValue(undefined);
        mockCoachProfilesService.delete.mockResolvedValue(undefined);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should call service get method', async () => {
            const result = await controller.getAll();

            expect(service.get).toHaveBeenCalled();
        });
    });

    describe('getFilteredCoaches', () => {
        it('should return filtered coaches', async () => {
            const filterDto: CoachFilterDto = { minExperience: 4 };
            const result = await controller.getFilteredCoaches(filterDto);
            expect(result).toEqual(coachDto);
            expect(service.getFiltered).toHaveBeenCalledWith(filterDto);
        });
    });

    describe('create', () => {
        it('should create a new coach profile', async () => {
            const dto: CreateProfileDto =
                { description: 'desc',
                    specializationIds: [1, 2],
                    city: 'Kiev',
                    experience: 2,
                    workMode: WorkMode.ONLINE };
            const mockReq = { user: { id: 1 } } as any;

            await controller.create(dto, mockReq);
            expect(service.create).toHaveBeenCalledWith(dto, 1);
        });
    });

    describe('update', () => {
        it('should update a coach profile', async () => {
            const dto: UpdateProfileDto = {  };
            const mockReq = { user: { id: 1 } } as any;

            await controller.update(dto, mockReq);
            expect(service.update).toHaveBeenCalledWith(dto, 1);
        });
    });

    describe('delete', () => {
        it('should delete a coach profile', async () => {
            const mockReq = { user: { id: 1 } } as any;

            await controller.delete(mockReq);
            expect(service.delete).toHaveBeenCalledWith(1);
        });
    });
});
