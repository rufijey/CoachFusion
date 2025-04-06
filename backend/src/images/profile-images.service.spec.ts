import { Test, TestingModule } from '@nestjs/testing';
import { ProfileImagesService } from './profile-images.service';
import { Repository } from 'typeorm';
import { ProfileImage } from './profile-image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { SaveProfileImageDto } from './dto/save-profile-image.dto';
import { ImageDto } from './dto/image.dto';
import { join } from 'path';

jest.mock('fs/promises', () => ({
    unlink: jest.fn(),
}));

describe('ProfileImagesService', () => {
    let service: ProfileImagesService;
    let imageRepository: Repository<ProfileImage>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileImagesService,
                {
                    provide: getRepositoryToken(ProfileImage),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProfileImagesService>(ProfileImagesService);
        imageRepository = module.get<Repository<ProfileImage>>(getRepositoryToken(ProfileImage));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('save', () => {
        it('should save profile image and return DTO', async () => {
            const saveImageDto: SaveProfileImageDto = {
                image: { filename: 'profile-test.jpg' } as Express.Multer.File,
                protocol: 'http',
                host: 'localhost',
                userId: 1,
            };

            const savedImage = {
                id: 1,
                path: '/images/profile-test.jpg',
                url: 'http://localhost/images/profile-test.jpg',
                user: { id: 1 },
            } as ProfileImage;

            jest.spyOn(imageRepository, 'create').mockReturnValue(savedImage);
            jest.spyOn(imageRepository, 'save').mockResolvedValue(savedImage);

            const result = await service.save(saveImageDto);

            expect(imageRepository.create).toHaveBeenCalledWith({
                path: savedImage.path,
                url: savedImage.url,
                user: { id: saveImageDto.userId },
            });
            expect(imageRepository.save).toHaveBeenCalledWith(savedImage);
            expect(result).toEqual(ImageDto.create(savedImage));
        });
    });

    describe('delete', () => {
        it('should delete profile image and remove from repository', async () => {
            const image = new ProfileImage();
            image.id = 1;
            image.path = '/images/profile-test.jpg';
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(image);
            jest.spyOn(imageRepository, 'remove').mockResolvedValue(new ProfileImage());

            await service.delete(1);

            const expectedPath = join(__dirname, '..', '..', 'static', 'images', 'profile-test.jpg');

            expect(unlink).toHaveBeenCalledWith(expectedPath);
            expect(imageRepository.remove).toHaveBeenCalledWith(image);
        });

        it('should throw NotFoundException if no image found', async () => {
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toThrow(NotFoundException);
        });
    });
});
