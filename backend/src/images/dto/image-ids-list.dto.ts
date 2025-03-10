import {ApiProperty} from "@nestjs/swagger";

export class ImageIdsListDto {

    @ApiProperty({ example: 'This image...', description: 'image ids' })
    readonly ids: number[];

}