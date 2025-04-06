import {ApiProperty} from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {

    @ApiProperty({example: 'user@gmail.com', description: 'Email'})
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({example: 'password123', description: 'Password'})
    @IsString()
    @IsOptional()
    readonly password?: string;

    @ApiProperty({example: 'username', description: 'username'})
    @IsString()
    @IsOptional()
    readonly name?: string;

}