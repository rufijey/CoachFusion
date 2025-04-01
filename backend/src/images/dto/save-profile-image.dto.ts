import {ApiProperty} from "@nestjs/swagger";

export class SaveProfileImageDto {

    @ApiProperty({ example: '[{filename: 123.jpg}]', description: 'image files' })
    image: {filename: string};

    @ApiProperty({ example: 'http', description: 'Request protocol (http or https)' })
    readonly protocol: string;

    @ApiProperty({ example: 'localhost:3000', description: 'Host (domain or IP with port)' })
    readonly host: string;

    @ApiProperty({ example: '1', description: 'user id' })
    readonly userId: number;

    constructor(image: {filename: string}, protocol: string, host: string, userId: number) {
        this.image = image;
        this.protocol = protocol;
        this.host = host;
        this.userId = userId;
    }
}