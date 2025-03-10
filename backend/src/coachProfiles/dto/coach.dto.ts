import {CoachProfileDto} from "./coach-profile.dto";
import {SpecializationDto} from "../../specializations/dto/specialization.dto";
import {PortfolioItemDto} from "../../portfolios/dto/portfolio-item.dto";
import {ApiProperty} from "@nestjs/swagger";

export class CoachDto extends CoachProfileDto{

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    readonly email: string;

    @ApiProperty({ example: 'username', description: 'Username' })
    readonly name: string;

    constructor(
        id: number,
        description:string,
        specializations:SpecializationDto[],
        portfolioItems:PortfolioItemDto[],
        experience:number,
        email:string,
        name:string,
    ) {
        super(id, description, specializations, portfolioItems, experience);
        this.email = email;
        this.name = name;
    }

    static create(item: any): CoachDto {
        return new CoachDto(
            item.id,
            item.description,
            item.specializations?.map((spec: any) => new SpecializationDto(spec.id, spec.title)) || [],
            item.portfolioItems?.map((pItem: any) => PortfolioItemDto.create(pItem)) || [],
            item.experience,
            item.user.email,
            item.user.name,
        );
    }
}