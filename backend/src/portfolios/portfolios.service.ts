import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {PortfolioImagesService} from "../images/portfolio-images.service";
import {CreatePortfolioItemDto} from "./dto/create-portfolio-item.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {PortfolioItem} from "./portfolio-item.entity";
import {In, Repository} from "typeorm";
import {SavePortfolioImagesDto} from "../images/dto/save-portfolio-images.dto";
import {PortfolioItemDto} from "./dto/portfolio-item.dto";
import {UpdatePortfolioItemDto} from "./dto/update-portfolio-item.dto";

@Injectable()
export class PortfoliosService {
    constructor(
        private imagesService: PortfolioImagesService,
        @InjectRepository(PortfolioItem) private portfolioItemRepository: Repository<PortfolioItem>
    ) {
    }

    async create(createDto: CreatePortfolioItemDto): Promise<void> {
        if (createDto.coachProfileId === null){
            throw new UnauthorizedException();
        }
        const portfolio = this.portfolioItemRepository.create({
            ...createDto,
            coachProfile: {id: createDto.coachProfileId}
        });

        const savedPortfolio = await this.portfolioItemRepository.save(portfolio);
        const saveImagesDto = new SavePortfolioImagesDto(createDto.imageFiles, createDto.protocol, createDto.host, savedPortfolio.id);
        await this.imagesService.save(saveImagesDto);
    }

    async getById(id: number): Promise<PortfolioItemDto> {
        const portfolioItem = await this.portfolioItemRepository.findOne({
            where: {id},
            relations: {images: true},
        });

        if (!portfolioItem) {
            throw new NotFoundException(`Portfolio item with id ${id} not found`);
        }

        return PortfolioItemDto.create(portfolioItem);
    }

    async getByCoachId(coachProfileId: number): Promise<PortfolioItemDto[]> {
        const portfolioItems = await this.portfolioItemRepository.find({
            where: {coachProfile: {id: coachProfileId}},
            relations: {images: true},
            order: {createdAt: 'DESC'},
        });

        return portfolioItems.map(item => PortfolioItemDto.create(item));
    }

    async delete(id: number): Promise<void> {
        if (!id) {
            throw new NotFoundException(`No ID`);
        }

        const portfolioItem = await this.portfolioItemRepository.findOne({
            where: { id: id} ,
            relations: { images: true },
        });

        if (!portfolioItem) {
            throw new NotFoundException(`Portfolio item not found`);
        }
        const imageIds = portfolioItem.images.map(image => image.id);

        if (imageIds.length) {
            await this.imagesService.delete(imageIds);
        }

        await this.portfolioItemRepository.delete(id);
    }

    async deleteMany(ids: number[]): Promise<void> {
        if (!ids.length) {
            throw new NotFoundException(`No IDs provided`);
        }

        const portfolioItems = await this.portfolioItemRepository.find({
            where: { id: In(ids) },
            relations: { images: true },
        });

        const imageIds = portfolioItems.flatMap(item => item.images.map(image => image.id));

        if (imageIds.length) {
            await this.imagesService.delete(imageIds);
        }

        await this.portfolioItemRepository.delete(ids);
    }

    async update(updateDto: UpdatePortfolioItemDto): Promise<void> {

        if (updateDto.imageIdsForDelete) {
            await this.imagesService.delete(updateDto.imageIdsForDelete);
        }

        if (updateDto.imageFiles) {
            const saveImageDto = new SavePortfolioImagesDto(
                updateDto.imageFiles,
                updateDto.protocol,
                updateDto.host,
                updateDto.id);
            await this.imagesService.save(saveImageDto);
        }
        const portfolio = this.portfolioItemRepository.create(updateDto);
        await this.portfolioItemRepository.update(portfolio.id, portfolio);
    }

    async areImagesFromPortfolio(portfolioId: number, imageIds: number[]): Promise<boolean> {

        const images = await this.imagesService.getByPortfolioId(portfolioId);

        const portfolioImageIds = images.map(image => image.id);

        return imageIds.every(id => portfolioImageIds.includes(id));
    }

    async isOwner(userId: number, portfolioId: number): Promise<boolean> {
        const portfolio = await this.portfolioItemRepository.findOne({
            where: { id: portfolioId, coachProfile: { user: { id: userId } }},
        });
        return !!portfolio;
    }

}
