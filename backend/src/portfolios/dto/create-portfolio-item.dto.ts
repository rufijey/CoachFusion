import {ApiProperty} from "@nestjs/swagger";

export class CreatePortfolioItemDto {

    readonly description: string;

    readonly coachProfileId: number;

    imageFiles: {filename: string}[];

    readonly protocol: string;

    readonly host: string;

    constructor(
        description: string,
        coachProfileId: number,
        imageFiles: {filename: string}[],
        protocol: string,
        host: string) {
        this.description = description;
        this.coachProfileId = coachProfileId;
        this.imageFiles = imageFiles;
        this.protocol = protocol;
        this.host = host;
    }
}