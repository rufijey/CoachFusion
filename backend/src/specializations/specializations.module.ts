import {Module} from '@nestjs/common';
import {SpecializationsService} from './specializations.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Specialization} from "./specialization.entity";
import {SpecializationsController} from './specializations.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
    providers: [SpecializationsService],
    controllers: [SpecializationsController],
    imports: [
        TypeOrmModule.forFeature([Specialization]),
        AuthModule
    ],
})
export class SpecializationsModule {
}
