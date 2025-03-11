import {ApiProperty} from "@nestjs/swagger";

export class UpdatePortfolioItemDto{

    readonly id: number;

    readonly description?: string;

    readonly userId: number;

    readonly imageIdsForDelete?: number[];

    readonly image_files?: {filename: string}[];

    readonly protocol: string;

    readonly host: string;

    constructor(
        id: number,
        userId: number,
        protocol: string,
        host: string,
        description?: string,
        imageIdsForDelete?: number[],
        images?: {filename: string}[],
        ) {
        this.id = id;
        this.userId = userId;
        this.protocol = protocol;
        this.host = host;
        this.description = description;
        this.imageIdsForDelete = imageIdsForDelete;
        this.image_files = images;
    }
}