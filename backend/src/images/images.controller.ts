import { Body, Controller, Delete, Get, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PortfolioImagesService } from './portfolio-images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SavePortfolioImagesDto } from './dto/save-portfolio-images.dto';
import { imageSaveOptions } from './image-save.options';
import { Request } from 'express';
import { ImageIdsListDto } from './dto/image-ids-list.dto';
import { resolve } from 'path';
import { ImageDto } from './dto/image.dto';

@Controller('api/images')
export class ImagesController {
    constructor(private readonly imagesService: PortfolioImagesService) {
    }

    @Post()
    @UseInterceptors(
        FilesInterceptor('images', 10, imageSaveOptions),
    )
    uploadImages(
        @UploadedFiles() images: Express.Multer.File[],
        @Req() req: Request,
        @Body() { portfolioItemId }: { portfolioItemId: number },
    ): Promise<void> {
        const saveImagesDto = new SavePortfolioImagesDto(images, req.protocol, req.host, portfolioItemId);
        return this.imagesService.save(saveImagesDto);
    }

    @Delete()
    deleteImages(
        @Body() imageList: ImageIdsListDto,
    ): Promise<void> {
        return this.imagesService.delete(imageList.ids);
    }

    @Get()
    getImages(
        @Body() imageList: ImageIdsListDto,
    ): Promise<ImageDto[]> {
        return this.imagesService.get(imageList.ids);
    }
}

