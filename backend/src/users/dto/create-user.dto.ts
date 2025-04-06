import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({example: 'user@gmail.com', description: 'Email'})
    readonly email: string;

    @ApiProperty({example: 'password123', description: 'Password'})
    readonly password: string;

    @ApiProperty({example: 'username', description: 'username'})
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