import { Module } from '@nestjs/common';
import { CoachProfilesService } from './coach-profiles.service';
import { CoachProfilesController } from './coach-profiles.controller';
import {UsersModule} from "../users/users.module";
import {CoachProfile} from "./coach-profile.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PortfoliosModule} from "../portfolios/portfolios.module";
import {AuthModule} from "../auth/auth.module";
import {CoachFilter} from "./coach.filter";

@Module({
  providers: [CoachProfilesService, CoachFilter],
  controllers: [CoachProfilesController],
  imports: [
      UsersModule,
      PortfoliosModule,
      TypeOrmModule.forFeature([CoachProfile]),
      AuthModule,
  ]
})
export class CoachProfilesModule {}
