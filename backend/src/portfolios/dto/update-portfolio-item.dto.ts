import {ApiProperty} from "@nestjs/swagger";

export class UpdatePortfolioItemDto{

    readonly id: number;

    readonly description?: string;

    readonly userId: number;

    readonly imageIdsForDelete?: number[];

    readonly images?: Express.Multer.File[];

    readonly protocol: string;

    readonly host: string;

    constructor(
        id: number,
        userId: number,
        protocol: string,
        host: string,
        description?: string,
        imageIdsForDelete?: number[],
        images?: Express.Multer.File[],
        ) {
        this.id = id;
        this.userId = userId;
        this.protocol = protocol;
        this.host = host;
        this.description = description;
        this.imageIdsForDelete = imageIdsForDelete;
        this.images = images;
    }
}