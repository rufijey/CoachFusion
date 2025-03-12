import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(()=> AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
