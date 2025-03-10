import { Module } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Specialization} from "./specialization.entity";
import { SpecializationsController } from './specializations.controller';

@Module({
  providers: [SpecializationsService],
  controllers: [SpecializationsController],
  imports: [TypeOrmModule.forFeature([Specialization])],
})
export class SpecializationsModule {}
