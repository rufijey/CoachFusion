import {ApiProperty} from "@nestjs/swagger";

export class SavePortfolioImagesDto {

    @ApiProperty({ example: '[{filename: 123.jpg}]', description: 'image files' })
    images: {filename: string}[];

    @ApiProperty({ example: 'http', description: 'Request protocol (http or https)' })
    readonly protocol: string;

    @ApiProperty({ example: 'localhost:3000', description: 'Host (domain or IP with port)' })
    readonly host: string;

    @ApiProperty({ example: '1', description: 'portfolio item id' })
    readonly portfolioItemId: number;

    constructor(images: {filename: string}[], protocol: string, host: string, portfolioItemId: number) {
        this.images = images;
        this.protocol = protocol;
        this.host = host;
        this.portfolioItemId = portfolioItemId;
    }
}