import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {
    readonly id: number;

    readonly email?: string;

    readonly password?: string;

    readonly name?: string;

    readonly imageFile?: {filename: string};

    readonly protocol: string;

    readonly host: string;

    constructor(
        id: number,
        protocol: string,
        host: string,
        email?: string,
        password?: string,
        name?: string,
        imageFile?: {filename: string},
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.imageFile = imageFile;
        this.protocol = protocol;
        this.host = host;
    }
}