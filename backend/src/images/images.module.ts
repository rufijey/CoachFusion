import { Module } from '@nestjs/common';
import { PortfolioImagesService } from './portfolio-images.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ImagesController } from './images.controller';
import {PortfolioImage} from './portfolio-image.entity';
import { ProfileImage } from './profile-image.entity';
import { ProfileImagesService } from './profile-images.service';

@Module({
  providers: [PortfolioImagesService, ProfileImagesService],
  imports: [TypeOrmModule.forFeature([PortfolioImage, ProfileImage])],
  controllers: [],
  exports: [PortfolioImagesService, ProfileImagesService],
})
export class ImagesModule {}

