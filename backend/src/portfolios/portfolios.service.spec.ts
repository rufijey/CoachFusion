import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosService } from './portfolios.service';
import {DeleteResult, Repository} from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PortfolioItem } from './portfolio-item.entity';
import { PortfolioImagesService } from '../images/portfolio-images.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { SavePortfolioImagesDto } from '../images/dto/save-portfolio-images.dto';
import {CoachProfile} from "../coach-profiles/coach-profile.entity";

jest.mock('../images/portfolio-images.service');

describe('PortfoliosService', () => {
    let service: PortfoliosService;
    let portfolioRepository: Repository<PortfolioItem>;
    let imagesService: PortfolioImagesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PortfoliosService,
                PortfolioImagesService,
                {
                    provide: getRepositoryToken(PortfolioItem),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<PortfoliosService>(PortfoliosService);
        portfolioRepository = module.get<Repository<PortfolioItem>>(getRepositoryToken(PortfolioItem));
        imagesService = module.get<PortfolioImagesService>(PortfolioImagesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and save a portfolio', async () => {
            const dto: CreatePortfolioItemDto =
                { coachProfileId: 1, description: 'description', imageFiles: [], protocol: 'http', host: 'localhost' };
            const portfolio = { id: 1, description: 'description', coachProfile: { id: 1 } };

            jest.spyOn(portfolioRepository, 'create').mockReturnValue(portfolio as PortfolioItem);
            jest.spyOn(portfolioRepository, 'save').mockResolvedValue(portfolio as PortfolioItem);
            jest.spyOn(imagesService, 'save').mockResolvedValue();

            await service.create(dto);

            expect(portfolioRepository.create).toHaveBeenCalledWith({ ...dto, coachProfile: { id: dto.coachProfileId } });
            expect(portfolioRepository.save).toHaveBeenCalledWith(portfolio);
            expect(imagesService.save).toHaveBeenCalledWith(new SavePortfolioImagesDto(dto.imageFiles, dto.protocol, dto.host, portfolio.id));
        });
    });

    describe('getById', () => {
        it('should return a portfolio item', async () => {
            const portfolioItem: PortfolioItem = {
                id: 1,
                description: 'Some description',
                images: [],
                coachProfile: new CoachProfile,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(portfolioRepository, 'findOne').mockResolvedValue(portfolioItem as PortfolioItem);

            const result = await service.getById(1);
            expect(result).toEqual({
                id: portfolioItem.id,
                description: portfolioItem.description,
                images: portfolioItem.images,
            });
        });

        it('should throw NotFoundException if not found', async () => {
            jest.spyOn(portfolioRepository, 'findOne').mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete portfolio and its images', async () => {
            const portfolio = { id: 1, images: [{ id: 1 }] };
            jest.spyOn(portfolioRepository, 'findOne').mockResolvedValue(portfolio as PortfolioItem);
            jest.spyOn(imagesService, 'delete').mockResolvedValue();
            jest.spyOn(portfolioRepository, 'delete').mockResolvedValue(new DeleteResult());

            await service.delete(1);

            expect(imagesService.delete).toHaveBeenCalledWith([1]);
            expect(portfolioRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if portfolio not found', async () => {
            jest.spyOn(portfolioRepository, 'findOne').mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('isOwner', () => {
        it('should return true if user is owner', async () => {
            const portfolio = { id: 1, coachProfile: { user: { id: 1 } } };
            jest.spyOn(portfolioRepository, 'findOne').mockResolvedValue(portfolio as PortfolioItem);

            const result = await service.isOwner(1, 1);
            expect(result).toBe(true);
        });

        it('should return false if user is not owner', async () => {
            jest.spyOn(portfolioRepository, 'findOne').mockResolvedValue(null);
            const result = await service.isOwner(1, 1);
            expect(result).toBe(false);
        });
    });
});
