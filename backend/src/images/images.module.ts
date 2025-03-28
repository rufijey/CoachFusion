import { Module } from '@nestjs/common';
import { PortfolioImagesService } from './portfolio-images.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ImagesController } from './images.controller';
import {Image} from './portfolio-image.entity';

@Module({
  providers: [PortfolioImagesService],
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [],
  exports: [PortfolioImagesService],
})
export class ImagesModule {}

