import {ApiProperty} from "@nestjs/swagger";
import {Specialization} from "../../specializations/specialization.entity";
import {Column} from "typeorm";
import {SpecializationDto} from "../../specializations/dto/specialization.dto";
import {UserDto} from "../../users/dto/user.dto";
import {PortfolioItemDto} from "../../portfolios/dto/portfolio-item.dto";

export class CoachProfileDto {

    @ApiProperty({ example: '1', description: 'Id' })
    readonly id: number;

    @ApiProperty({example: 'I am coach, I have...', description: 'description where coach tell about himself'})
    readonly description: string;

    @ApiProperty({example: '[{id: 1, title: bodybuilding}]', description: 'coach specializations'})
    readonly specializations: SpecializationDto[];

    @ApiProperty({example: '[PortfolioItemDto]', description: 'portfolio items'})
    readonly portfolioItems: PortfolioItemDto[];

    @ApiProperty({example: '3.0', description: 'coach experience'})
    readonly experience: number;

    constructor(
        id: number,
        description:string,
        specializations:SpecializationDto[],
        portfolioItems:PortfolioItemDto[],
        experience:number) {
        this.id = id;
        this.description = description;
        this.specializations = specializations;
        this.portfolioItems = portfolioItems;
        this.experience = experience;
    }

    static create(item: any): CoachProfileDto {
        return new CoachProfileDto(
            item.id,
            item.description,
            item.specializations?.map((spec: any) => new SpecializationDto(spec.id, spec.title)) || [],
            item.portfolioItems?.map((pItem: any) => PortfolioItemDto.create(pItem)) || [],
            item.experience
        );
    }

}
