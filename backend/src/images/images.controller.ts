import {Body, Controller, Delete, Get, Post, Req, UploadedFile, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {ImagesService} from "./images.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {SaveImagesDto} from "./dto/save-images.dto";
import {imageSaveOptions} from "./image-save.options";
import { Request } from 'express';
import {ImageIdsListDto} from "./dto/image-ids-list.dto";
import {resolve} from "path";
import {ImageDto} from "./dto/image.dto";

@Controller('api/images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Post()
    @UseInterceptors(
        FilesInterceptor('images', 10, imageSaveOptions)
    )
    uploadImages(
        @UploadedFiles() images: Express.Multer.File[],
        @Req() req: Request,
        @Body() {portfolioItemId}:{portfolioItemId:number},
    ): Promise<ImageDto[]> {
        const saveImagesDto = new SaveImagesDto(images, req.protocol, req.host, portfolioItemId);
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

