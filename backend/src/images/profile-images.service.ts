import { Injectable, NotFoundException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { join, resolve } from 'path';
import { SavePortfolioImagesDto } from './dto/save-portfolio-images.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PortfolioImage } from './portfolio-image.entity';
import { unlink } from 'fs/promises';
import { ImageDto } from './dto/image.dto';
import { SaveProfileImageDto } from './dto/save-profile-image.dto';
import { ProfileImage } from './profile-image.entity';


@Injectable()
export class ProfileImagesService {

    constructor(@InjectRepository(ProfileImage) private imageRepository: Repository<ProfileImage>) {
    }

    async save(
        saveImageDto: SaveProfileImageDto,
    ): Promise<ImageDto> {

        const filePath = `/images/${saveImageDto.image.filename}`;
        const fullUrl = `${saveImageDto.protocol}://${saveImageDto.host}${filePath}`;

        const newImage = this.imageRepository.create({
            path: filePath,
            url: fullUrl,
            user: { id: saveImageDto.userId },
        });

        return ImageDto.create(await this.imageRepository.save(newImage));

    }

    async delete(id: number): Promise<void> {
        const image = await this.imageRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!image) {
            throw new NotFoundException('Image not found');
        }

        const filePath = join(__dirname, '..', '..', 'static', image.path);
        try {
            await unlink(filePath);
        } catch (error) {
            console.error('Delete file error:', error);
        }

        await this.imageRepository.remove(image);
    }
}