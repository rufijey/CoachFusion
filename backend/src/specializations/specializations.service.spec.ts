import { Test, TestingModule } from '@nestjs/testing';
import { SpecializationsService } from './specializations.service';
import { Specialization } from './specialization.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

describe('SpecializationsService', () => {
    let service: SpecializationsService;
    let specializationRepository: Repository<Specialization>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SpecializationsService,
                {
                    provide: getRepositoryToken(Specialization),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<SpecializationsService>(SpecializationsService);
        specializationRepository = module.get<Repository<Specialization>>(getRepositoryToken(Specialization));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create specialization', async () => {
            const dto: CreateSpecializationDto = { title: 'Test Specialization' };
            const savedSpecialization = { id: 1, title: dto.title };

            jest.spyOn(specializationRepository, 'create').mockReturnValue(savedSpecialization as Specialization);
            jest.spyOn(specializationRepository, 'save').mockResolvedValue(savedSpecialization as Specialization);

            const result = await service.create(dto);

            expect(specializationRepository.create).toHaveBeenCalledWith({...dto, title: dto.title.toLowerCase()});
            expect(specializationRepository.save).toHaveBeenCalledWith(savedSpecialization);
        });
    });

    describe('findAll', () => {
        it('should return an array of specialization DTOs', async () => {
            const specializations = [
                { id: 1, title: 'Spec 1' },
                { id: 2, title: 'Spec 2' },
            ];

            jest.spyOn(specializationRepository, 'find').mockResolvedValue(specializations as Specialization[]);

            const result = await service.findAll();

            expect(result).toEqual([
                { id: 1, title: 'Spec 1' },
                { id: 2, title: 'Spec 2' },
            ]);
            expect(specializationRepository.find).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update specialization without throwing', async () => {
            const dto: UpdateSpecializationDto = { title: 'Updated Title' };

            jest.spyOn(specializationRepository, 'update').mockResolvedValue(new UpdateResult());

            await expect(service.update(1, dto)).resolves.toBeUndefined();
            expect(specializationRepository.update).toHaveBeenCalledWith(1, {...dto, title: dto.title.toLowerCase() });
        });
    });

    describe('remove', () => {
        it('should remove specialization if it exists', async () => {
            const specialization = { id: 1, title: 'To be deleted' };

            jest.spyOn(specializationRepository, 'findOne').mockResolvedValue(specialization as Specialization);
            jest.spyOn(specializationRepository, 'remove').mockResolvedValue(new Specialization());

            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(specializationRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(specializationRepository.remove).toHaveBeenCalledWith(specialization);
        });

        it('should throw NotFoundException if specialization does not exist', async () => {
            jest.spyOn(specializationRepository, 'findOne').mockResolvedValue(null);

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
            expect(specializationRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
