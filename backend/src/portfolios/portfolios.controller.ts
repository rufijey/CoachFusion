import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Req,
    NotFoundException, UseInterceptors, UploadedFiles, UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { PortfolioItemDto } from './dto/portfolio-item.dto';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FilesInterceptor} from "@nestjs/platform-express";
import {imageSaveOptions} from "../images/image-save.options";
import {UpdatePortfolioRequestDto} from "./dto/update-portfolio-request.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {CreatePortfolioRequestDto} from "./dto/create-portfolio-request.dto";
import {PortfolioOwnerGuard} from "./portfolio-owner.guard";

@ApiTags('Portfolios')
@Controller('api/portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FilesInterceptor('images', 10, imageSaveOptions)
    )
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new portfolio item' })
    @ApiResponse({ status: 201, description: 'Portfolio item created' })
    create(
        @UploadedFiles() images: Express.Multer.File[],
        @Body() createPortfolioRequestDto: CreatePortfolioRequestDto,
        @Req() req: Request
    ):Promise<void>  {
        const protocol = req.protocol;
        const host = req.host;

        const createDto = new CreatePortfolioItemDto(
            createPortfolioRequestDto.description,
            req.user.coachProfileId,
            images,
            protocol,
            host
        );

        return this.portfoliosService.create(createDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get portfolio item by ID' })
    @ApiResponse({ status: 200, type: PortfolioItemDto })
    getById(@Param('id') id: number):Promise<PortfolioItemDto> {
        return this.portfoliosService.getById(id);
    }

    @Get('coach/:coachProfileId')
    @ApiOperation({ summary: 'Get portfolio items by coach ID' })
    @ApiResponse({ status: 200, type: [PortfolioItemDto] })
    getByCoachId(@Param('coachProfileId') coachProfileId: number): Promise<PortfolioItemDto[]> {
        return this.portfoliosService.getByCoachId(coachProfileId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PortfolioOwnerGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete portfolio items by IDs' })
    @ApiResponse({ status: 204, description: 'Portfolio items deleted' })
    delete(
        @Param('id') id: number,
        @Req() req: Request
        ): Promise<void> {
        return this.portfoliosService.delete(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PortfolioOwnerGuard)
    @ApiBearerAuth()
    @UseInterceptors(
        FilesInterceptor('images', 10, imageSaveOptions)
    )
    @ApiOperation({ summary: 'Update portfolio item' })
    @ApiResponse({ status: 200, description: 'Portfolio item updated' })
    update(
        @UploadedFiles() images: Express.Multer.File[],
        @Param('id') id: number,
        @Body() updatePortfolioRequestDto: UpdatePortfolioRequestDto,
        @Req() req: Request
    ): Promise<void> {
        const protocol = req.protocol;
        const host = req.host;
        const updateDto = new UpdatePortfolioItemDto(
            id,
            req.user.id,
            protocol,
            host,
            updatePortfolioRequestDto.description,
            updatePortfolioRequestDto.imageIdsForDelete,
            images,
        );
        return this.portfoliosService.update(updateDto);
    }
}
