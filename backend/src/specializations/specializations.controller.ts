import { Controller, Get, Post, Body, Param, Delete, NotFoundException, Patch } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { SpecializationDto } from './dto/specialization.dto';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Specializations')
@Controller('api/specializations')
export class SpecializationsController {
    constructor(private readonly specializationsService: SpecializationsService) {}

    @Post()
    @ApiOperation({ summary: 'Create specialization' })
    @ApiResponse({ status: 201, description: 'Specialization successfully created', type: SpecializationDto })
    create(@Body() createSpecializationDto: CreateSpecializationDto): Promise<SpecializationDto> {
        return this.specializationsService.create(createSpecializationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all specializations' })
    @ApiResponse({ status: 200, description: 'List of specializations', type: [SpecializationDto] })
    findAll(): Promise<SpecializationDto[]> {
        return this.specializationsService.findAll();
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update specialization by ID' })
    @ApiResponse({ status: 200, description: 'Specialization successfully updated'})
    update(@Param('id') id: number, @Body() updateSpecializationDto: UpdateSpecializationDto): Promise<void> {
        return this.specializationsService.update(id, updateSpecializationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete specialization by ID' })
    @ApiResponse({ status: 204, description: 'Specialization successfully deleted' })
    async remove(@Param('id') id: number): Promise<void> {
        await this.specializationsService.remove(id);
    }
}
