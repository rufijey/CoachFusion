import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
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
    let service: ImagesService;
    let imageRepository: Repository<Image>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImagesService,
                {
                    provide: getRepositoryToken(Image),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ImagesService>(ImagesService);
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

            const savedImage = new Image();
            savedImage.id = 1;
            savedImage.path = '/images/test.jpg';
            savedImage.url = 'http://localhost/images/test.jpg';

            jest.spyOn(imageRepository, 'create').mockReturnValue(savedImage);
            jest.spyOn(imageRepository, 'save').mockResolvedValue(savedImage);

            const result = await service.save(saveImagesDto);

            expect(result).toEqual([new ImageDto(1, savedImage.url, savedImage.path)]);
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
