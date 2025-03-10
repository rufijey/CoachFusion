import {forwardRef, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import * as process from "node:process";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RefreshToken} from "./refresh-token.entity";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        TypeOrmModule.forFeature([RefreshToken]),
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        forwardRef(()=> UsersModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: '1h'
            }
        })
    ],
    exports: [JwtModule],
})
export class AuthModule  {
}