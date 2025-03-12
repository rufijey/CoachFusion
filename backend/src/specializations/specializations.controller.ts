import {Controller, Get, Post, Body, Param, Delete, NotFoundException, Patch, UseGuards} from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { SpecializationDto } from './dto/specialization.dto';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('Specializations')
@Controller('api/specializations')
export class SpecializationsController {
    constructor(private readonly specializationsService: SpecializationsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create specialization' })
    @ApiResponse({ status: 201, description: 'Specialization successfully created'})
    create(@Body() createSpecializationDto: CreateSpecializationDto): Promise<void> {
        return this.specializationsService.create(createSpecializationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all specializations' })
    @ApiResponse({ status: 200, description: 'List of specializations', type: [SpecializationDto] })
    findAll(): Promise<SpecializationDto[]> {
        return this.specializationsService.findAll();
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update specialization by ID' })
    @ApiResponse({ status: 200, description: 'Specialization successfully updated'})
    update(@Param('id') id: number, @Body() updateSpecializationDto: UpdateSpecializationDto): Promise<void> {
        return this.specializationsService.update(id, updateSpecializationDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete specialization by ID' })
    @ApiResponse({ status: 204, description: 'Specialization successfully deleted' })
    async remove(@Param('id') id: number): Promise<void> {
        await this.specializationsService.remove(id);
    }
}
