import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import * as process from "node:process";
import {User} from "./users/user.entity";
import { AuthModule } from './auth/auth.module';
import {RefreshToken} from "./auth/refresh-token.entity";
import { CoachProfilesModule } from './coachProfiles/coach-profiles.module';
import {CoachProfile} from "./coachProfiles/coach-profile.entity";
import {PortfoliosModule} from "./portfolios/portfolios.module";
import { ImagesModule } from './images/images.module';
import { SpecializationsModule } from './specializations/specializations.module';
import {PortfolioItem} from "./portfolios/portfolio-item.entity";
import {Specialization} from "./specializations/specialization.entity";
import {Image} from "./images/image.entity";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [User, RefreshToken, CoachProfile, PortfolioItem, Specialization, Image],
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
        }),
        UsersModule,
        AuthModule,
        CoachProfilesModule,
        PortfoliosModule,
        ImagesModule,
        SpecializationsModule,
    ],
})
export class AppModule {
}
