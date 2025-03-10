import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ImagesController } from './images.controller';
import {Image} from './image.entity';

@Module({
  providers: [ImagesService],
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}

