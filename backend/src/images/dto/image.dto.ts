import {ApiProperty} from "@nestjs/swagger";

export class ImageDto {

    @ApiProperty({ example: '1', description: 'id' })
    readonly id: number;

    @ApiProperty({ example: 'http://localhost:8000/static/images/image123.jpg', description: 'image url' })
    readonly url: string;

    @ApiProperty({ example: '/images/image123.jpg', description: 'path to image' })
    readonly path: string;

    constructor(
        id: number,
        url: string,
        path: string,
    ) {
        this.id = id;
        this.url = url;
        this.path = path;
    }

    static create(item: any): ImageDto {
        return new ImageDto(item.id, item.url, item.path);
    }

}