import {ApiProperty} from "@nestjs/swagger";

export class CreatePortfolioItemDto {

    readonly description: string;

    readonly coachProfileId: number;

    image_files: {filename: string}[];

    readonly protocol: string;

    readonly host: string;

    constructor(
        description: string,
        coachProfileId: number,
        images: {filename: string}[],
        protocol: string,
        host: string) {
        this.description = description;
        this.coachProfileId = coachProfileId;
        this.image_files = images;
        this.protocol = protocol;
        this.host = host;
    }
}