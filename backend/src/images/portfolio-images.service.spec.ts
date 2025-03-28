import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioImagesService } from './portfolio-images.service';
import { Repository } from 'typeorm';
import { Image } from './portfolio-image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { SaveImagesDto } from './dto/save-images.dto';
import { ImageDto } from './dto/image.dto';
import {join} from "path";

jest.mock('fs/promises', () => ({
    unlink: jest.fn(),
}));


describe('ImagesService', () => {
    let service: PortfolioImagesService;
    let imageRepository: Repository<Image>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PortfolioImagesService,
                {
                    provide: getRepositoryToken(Image),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<PortfolioImagesService>(PortfolioImagesService);
        imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('save', () => {
        it('should save images and return DTOs', async () => {
            const saveImagesDto: SaveImagesDto = {
                images: [{ filename: 'test.jpg' }],
                protocol: 'http',
                host: 'localhost',
                portfolioItemId: 1,
            };

            const savedImage = {
                id: 1,
                path: '/images/test.jpg',
                url: 'http://localhost/images/test.jpg',
                portfolioItem: { id: 1 },
            } as Image;

            jest.spyOn(imageRepository, 'create').mockReturnValue(savedImage);
            jest.spyOn(imageRepository, 'save').mockResolvedValue(savedImage);

            await service.save(saveImagesDto);

            expect(imageRepository.create).toHaveBeenCalledWith({
                path: savedImage.path,
                url: savedImage.url,
                portfolioItem: { id: saveImagesDto.portfolioItemId },
            });
            expect(imageRepository.save).toHaveBeenCalledWith(savedImage);
        });
    });

    describe('delete', () => {
        it('should delete images and remove from repository', async () => {
            const image = new Image();
            image.id = 1;
            image.path = '/images/test.jpg';
            jest.spyOn(imageRepository, 'find').mockResolvedValue([image]);
            jest.spyOn(imageRepository, 'remove').mockResolvedValue(new Image());

            await service.delete([1]);

            const expectedPath = join(__dirname, '..', '..', 'static', 'images', 'test.jpg');

            expect(unlink).toHaveBeenCalledWith(expectedPath);
            expect(imageRepository.remove).toHaveBeenCalledWith([image]);
        });

        it('should throw NotFoundException if no images found', async () => {
            jest.spyOn(imageRepository, 'find').mockResolvedValue([]);
            await expect(service.delete([1])).rejects.toThrow(NotFoundException);
        });
    });

    describe('get', () => {
        it('should return images DTOs', async () => {
            const image = new Image();
            image.id = 1;
            image.url = 'http://localhost/images/test.jpg';
            image.path = '/images/test.jpg';
            jest.spyOn(imageRepository, 'find').mockResolvedValue([image]);

            const result = await service.get([1]);
            expect(result).toEqual([new ImageDto(1, image.url, image.path)]);
        });

        it('should throw NotFoundException if no images found', async () => {
            jest.spyOn(imageRepository, 'find').mockResolvedValue([]);
            await expect(service.get([1])).rejects.toThrow(NotFoundException);
        });
    });

    describe('getByPortfolioId', () => {
        it('should return images by portfolio ID', async () => {
            const image = new Image();
            image.id = 1;
            image.url = 'http://localhost/images/test.jpg';
            image.path = '/images/test.jpg';
            jest.spyOn(imageRepository, 'find').mockResolvedValue([image]);

            const result = await service.getByPortfolioId(1);
            expect(result).toEqual([ImageDto.create(image)]);
        });
    });
});
