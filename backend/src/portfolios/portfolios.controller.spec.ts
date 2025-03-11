import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { PortfolioItemDto } from './dto/portfolio-item.dto';
import { Request } from 'express';

describe('PortfoliosController', () => {
    let portfoliosController: PortfoliosController;
    let portfoliosService: PortfoliosService;

    const mockPortfoliosService = {
        create: jest.fn(),
        getById: jest.fn(),
        getByCoachId: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PortfoliosController],
            providers: [
                {
                    provide: PortfoliosService,
                    useValue: mockPortfoliosService,
                },
            ],
        }).compile();

        portfoliosController = module.get<PortfoliosController>(PortfoliosController);
        portfoliosService = module.get<PortfoliosService>(PortfoliosService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a portfolio item', async () => {
            const images = [{ filename: 'image1.jpg' }, { filename: 'image2.jpg' }];
            const request: Partial<Request> = {
                protocol: 'https',
                host: 'localhost',
                user: { coachProfileId: 1 },
            };
            const createPortfolioRequestDto = { description: 'New portfolio' };
            const createDto = new CreatePortfolioItemDto(
                'New portfolio',
                1,
                images,
                'https',
                'localhost'
            );

            mockPortfoliosService.create.mockResolvedValue(undefined);

            await expect(
                portfoliosController.create(images as Express.Multer.File[], createPortfolioRequestDto, request as Request)
            ).resolves.toBeUndefined();

            expect(mockPortfoliosService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('getById', () => {
        it('should return portfolio item by ID', async () => {
            const id = 1;
            const portfolioItem = new PortfolioItemDto(id, 'Portfolio Item', []);

            mockPortfoliosService.getById.mockResolvedValue(portfolioItem);

            await expect(portfoliosController.getById(id)).resolves.toEqual(portfolioItem);

            expect(mockPortfoliosService.getById).toHaveBeenCalledWith(id);
        });
    });

    describe('getByCoachId', () => {
        it('should return a list of portfolio items for a coach', async () => {
            const coachProfileId = 1;
            const portfolioItems = [
                new PortfolioItemDto(1, 'Portfolio 1', []),
                new PortfolioItemDto(2, 'Portfolio 2', []),
            ];

            mockPortfoliosService.getByCoachId.mockResolvedValue(portfolioItems);

            await expect(portfoliosController.getByCoachId(coachProfileId)).resolves.toEqual(portfolioItems);

            expect(mockPortfoliosService.getByCoachId).toHaveBeenCalledWith(coachProfileId);
        });
    });

    describe('delete', () => {
        it('should delete a portfolio item by ID', async () => {
            const id = 1;
            const request: Partial<Request> = { user: { id: 1 } };

            mockPortfoliosService.delete.mockResolvedValue(undefined);

            await expect(portfoliosController.delete(id, request as Request)).resolves.toBeUndefined();

            expect(mockPortfoliosService.delete).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update a portfolio item', async () => {
            const id = 1;
            const images = [{ filename: 'image1.jpg' }];
            const request: Partial<Request> = {
                protocol: 'https',
                host: 'localhost',
                user: { id: 1 },
            };
            const updatePortfolioRequestDto = { description: 'Updated portfolio', imageIdsForDelete: [2, 3] };
            const updateDto = new UpdatePortfolioItemDto(
                id,
                request.user.id,
                'https',
                'localhost',
                updatePortfolioRequestDto.description,
                updatePortfolioRequestDto.imageIdsForDelete,
                images
            );

            mockPortfoliosService.update.mockResolvedValue(undefined);

            await expect(
                portfoliosController.update(images as Express.Multer.File[], id, updatePortfolioRequestDto, request as Request)
            ).resolves.toBeUndefined();

            expect(mockPortfoliosService.update).toHaveBeenCalledWith(updateDto);
        });
    });
});
