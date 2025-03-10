import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/user.entity";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class LoginDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({example: 'password123', description: 'Password'})
    @IsString()
    readonly password: string;


    constructor(
        email: string,
        password: string,
    ) {
        this.email = email;
        this.password = password;
    }
}