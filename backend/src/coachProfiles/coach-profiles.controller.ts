import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import { CoachProfilesService } from "./coach-profiles.service";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CoachDto } from "./dto/coach.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import {CoachFilterDto} from "./dto/coach-filter.dto";
import {Request, Response} from "express";

@ApiTags('Coaches')
@Controller('api/coaches')
export class CoachProfilesController {
    constructor(private readonly coachProfilesService: CoachProfilesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all coach profiles' })
    @ApiResponse({ status: 200, description: 'Returns all coaches', type: [CoachDto] })
    async getAll(): Promise<CoachDto[]> {
        return this.coachProfilesService.get();
    }

    @Get('filtered')
    @ApiOperation({ summary: 'Get filtered coach profiles' })
    @ApiResponse({ status: 200, description: 'Returns filtered coaches', type: [CoachDto] })
    async getFilteredCoaches(@Query() filterDto: CoachFilterDto): Promise<CoachDto[]> {
        return this.coachProfilesService.getFiltered(filterDto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a coach profile' })
    @ApiResponse({ status: 201, description: 'Coach profile created successfully' })
    async create(@Body() createProfileDto: CreateProfileDto, @Req() req: Request): Promise<void> {
        return this.coachProfilesService.create(createProfileDto, req.user.id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a coach profile' })
    @ApiResponse({ status: 200, description: 'Coach profile updated successfully' })
    async update(@Body() updateProfileDto: UpdateProfileDto, @Req() req: Request): Promise<void> {
        return this.coachProfilesService.update(updateProfileDto, req.user.coachProfileId);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a coach profile' })
    @ApiResponse({ status: 200, description: 'Coach profile deleted successfully' })
    async delete(@Req() req: Request): Promise<void> {
        return this.coachProfilesService.delete(req.user.coachProfileId);
    }
}
