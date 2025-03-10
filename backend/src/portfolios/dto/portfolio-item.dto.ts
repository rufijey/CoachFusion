import {ApiProperty} from "@nestjs/swagger";
import {ImageDto} from "../../images/dto/image.dto";
import {PortfolioItem} from "../portfolio-item.entity";

export class PortfolioItemDto {

    @ApiProperty({example: '1', description: 'id'})
    readonly id: number;

    @ApiProperty({example: 'Its description of this...', description: 'description'})
    readonly description: string;

    @ApiProperty({description: 'images'})
    readonly images: ImageDto[];

    constructor(id: number, description: string, images: ImageDto[]) {
        this.id = id;
        this.description = description;
        this.images = images;
    }


    static create(item: any): PortfolioItemDto {
        return new PortfolioItemDto(
            item.id,
            item.description,
            item.images.map((image: any)=> ImageDto.create(image)))
    }
}