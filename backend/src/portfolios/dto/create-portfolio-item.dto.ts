import {ApiProperty} from "@nestjs/swagger";

export class CreatePortfolioItemDto {

    readonly description: string;

    readonly coachProfileId: number;

    readonly images: Express.Multer.File[];

    readonly protocol: string;

    readonly host: string;

    constructor(
        description: string,
        coachProfileId: number,
        images: Express.Multer.File[],
        protocol: string,
        host: string) {
        this.description = description;
        this.coachProfileId = coachProfileId;
        this.images = images;
        this.protocol = protocol;
        this.host = host;
    }
}