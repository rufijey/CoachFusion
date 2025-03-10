import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/user.entity";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class RegisterDto {

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({example: 'password123', description: 'Password'})
    @IsString()
    readonly password: string;

    @ApiProperty({ example: 'username', description: 'Username' })
    @IsString()
    readonly name: string;

    constructor(
        email: string,
        password: string,
        name: string,
    ) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}