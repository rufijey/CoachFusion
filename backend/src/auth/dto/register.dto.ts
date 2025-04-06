import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/user.entity";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class RegisterDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'username', description: 'Username' })
    @IsString()
    readonly name: string;

    @ApiProperty({example: 'password123', description: 'Password'})
    @IsString()
    readonly password: string;

    constructor(
        email: string,
        name: string,
        password: string,
    ) {
        this.email = email;
        this.name = name;
        this.password = password;
    }
}