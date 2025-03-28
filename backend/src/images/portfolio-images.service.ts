import {Injectable, NotFoundException} from '@nestjs/common';
import {diskStorage} from "multer";
import {join, resolve} from 'path'
import {SaveImagesDto} from "./dto/save-images.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Image} from "./portfolio-image.entity";
import { unlink } from 'fs/promises';
import {ImageDto} from "./dto/image.dto";


@Injectable()
export class PortfolioImagesService {

    constructor(@InjectRepository(Image) private imageRepository: Repository<Image>) {
    }

    async save(
        saveImagesDto: SaveImagesDto,
    ):Promise<void> {

        for (const image of saveImagesDto.images) {
            const filePath = `/images/${image.filename}`;
            const fullUrl = `${saveImagesDto.protocol}://${saveImagesDto.host}${filePath}`;

            const newImage = this.imageRepository.create({
                path: filePath,
                url: fullUrl,
                portfolioItem: { id: saveImagesDto.portfolioItemId },
            });

            await this.imageRepository.save(newImage);
        }

    }

    async delete(ids: number[]): Promise<void> {
        const images = await this.imageRepository.find({
            where: {
                id: In(ids),
            },
        });

        if (images.length === 0) {
            throw new NotFoundException('Images not found');
        }

        for (const image of images) {
            const filePath = join(__dirname, '..', '..', 'static', image.path);
            try {
                await unlink(filePath);
            } catch (error) {
                console.error('Delete file error:', error);
            }
        }

        await this.imageRepository.remove(images);
    }

    async get(ids: number[]): Promise<ImageDto[]>{
        const images = await this.imageRepository.find({
            where: {
                id: In(ids),
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (images.length === 0) {
            throw new NotFoundException('Images not found');
        }
        return images.map(image=>new ImageDto(image.id, image.url, image.path));

    }

    async getByPortfolioId(id: number): Promise<ImageDto[]>{
        const images = await this.imageRepository.find({
            where: { portfolioItem: { id: id } },
        });

        return images.map(image=>ImageDto.create(image));
    }
}