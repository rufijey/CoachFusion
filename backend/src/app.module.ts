import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './auth/refresh-token.entity';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ImagesModule } from './images/images.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { PortfolioItem } from './portfolios/portfolio-item.entity';
import { Specialization } from './specializations/specialization.entity';
import { PortfolioImage } from './images/portfolio-image.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachProfile } from './coach-profiles/coach-profile.entity';
import { CoachProfilesModule } from './coach-profiles/coach-profiles.module';
import { ProfileImage } from './images/profile-image.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [User, RefreshToken, CoachProfile, PortfolioItem, Specialization, PortfolioImage, ProfileImage],
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'static'),
        }),
        AuthModule,
        UsersModule,
        CoachProfilesModule,
        PortfoliosModule,
        ImagesModule,
        SpecializationsModule,
    ],
})
export class AppModule {
}
