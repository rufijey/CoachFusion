import { Test, TestingModule } from '@nestjs/testing';
import { SpecializationsController } from './specializations.controller';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { SpecializationDto } from './dto/specialization.dto';

describe('SpecializationsController', () => {
    let specializationsController: SpecializationsController;
    let specializationsService: SpecializationsService;

    const mockSpecializationsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SpecializationsController],
            providers: [
                {
                    provide: SpecializationsService,
                    useValue: mockSpecializationsService,
                },
            ],
        }).compile();

        specializationsController = module.get<SpecializationsController>(SpecializationsController);
        specializationsService = module.get<SpecializationsService>(SpecializationsService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a specialization', async () => {
            const createSpecializationDto: CreateSpecializationDto = { title: 'Frontend Developer' };
            const specialization: SpecializationDto = { id: 1, title: 'Frontend Developer' };

            mockSpecializationsService.create.mockResolvedValue(specialization);

            await expect(specializationsController.create(createSpecializationDto)).resolves.toEqual(specialization);

            expect(mockSpecializationsService.create).toHaveBeenCalledWith(createSpecializationDto);
        });
    });

    describe('findAll', () => {
        it('should return a list of specializations', async () => {
            const specializations: SpecializationDto[] = [
                { id: 1, title: 'Frontend Developer' },
                { id: 2, title: 'Backend Developer' },
            ];

            mockSpecializationsService.findAll.mockResolvedValue(specializations);

            await expect(specializationsController.findAll()).resolves.toEqual(specializations);

            expect(mockSpecializationsService.findAll).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a specialization', async () => {
            const id = 1;
            const updateSpecializationDto: UpdateSpecializationDto = { title: 'Fullstack Developer' };

            mockSpecializationsService.update.mockResolvedValue(undefined);

            await expect(specializationsController.update(id, updateSpecializationDto)).resolves.toBeUndefined();

            expect(mockSpecializationsService.update).toHaveBeenCalledWith(id, updateSpecializationDto);
        });
    });

    describe('remove', () => {
        it('should delete a specialization', async () => {
            const id = 1;

            mockSpecializationsService.remove.mockResolvedValue(undefined);

            await expect(specializationsController.remove(id)).resolves.toBeUndefined();

            expect(mockSpecializationsService.remove).toHaveBeenCalledWith(id);
        });
    });
});
