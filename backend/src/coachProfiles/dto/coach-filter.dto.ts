import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, IsEnum, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import {IsMaxGreaterThanMin} from "../validators/is-greater.validator";


export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class CoachFilterDto {
    @ApiPropertyOptional({ example: 1, description: 'Specialization ID' })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    specialization?: number;

    @ApiPropertyOptional({ description: 'Minimal experience', example: 3 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    minExperience?: number;

    @ApiPropertyOptional({ description: 'Maximal experience', example: 15 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    @Validate(IsMaxGreaterThanMin)
    maxExperience?: number;

    @ApiPropertyOptional({ description: 'Sort field', example: 'experience' })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({ description: 'Sort direction', enum: SortDirection, example: SortDirection.DESC })
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
