import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfileImagesService } from '../images/profile-images.service';
import { ImagesModule } from '../images/images.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
        ImagesModule,
    ],
    exports: [UsersService],
})
export class UsersModule {
}
