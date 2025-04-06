import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/user.entity";
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({example: 'password123', description: 'Password'})
    @IsString()
    @IsNotEmpty()
    readonly password: string;


    constructor(
        email: string,
        password: string,
    ) {
        this.email = email;
        this.password = password;
    }
}