import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from './specialization.entity';
import {CreateSpecializationDto} from "./dto/create-specialization.dto";
import {UpdateSpecializationDto} from "./dto/update-specialization.dto";
import {SpecializationDto} from "./dto/specialization.dto";

@Injectable()
export class SpecializationsService {
    constructor(
        @InjectRepository(Specialization)
        private specializationRepository: Repository<Specialization>,
    ) {}

    async create(dto: CreateSpecializationDto): Promise<SpecializationDto> {
        const specialization = this.specializationRepository.create(dto);
        const savedSpecialization = await this.specializationRepository.save(specialization);
        return new SpecializationDto(savedSpecialization.id, savedSpecialization.title);
    }

    async findAll(): Promise<SpecializationDto[]> {
        const specializations =  await this.specializationRepository.find();
        return specializations.map(specialization =>
            new SpecializationDto(specialization.id, specialization.title));
    }

    async update(id: number, dto: UpdateSpecializationDto): Promise<void> {
        await this.specializationRepository.update(id, dto);
    }


    async remove(id: number): Promise<void> {
        const specialization = await this.specializationRepository.findOne({where: {id}});
        if (!specialization) {
            throw new NotFoundException();
        }
        await this.specializationRepository.remove(specialization);
    }
}
