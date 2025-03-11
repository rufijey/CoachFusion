import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsOptional,
    IsString,
    IsNumber,
    Min,
    IsEnum,
    Validate
} from 'class-validator';
import { IsMaxGreaterThanMin } from "../validators/is-greater.validator";
import { WorkMode } from "../coach-profile.entity";

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum SortByField {
    EXPERIENCE = 'experience',
    NAME = 'name',
    CREATED_AT = 'createdAt',
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

    @ApiPropertyOptional({ example: 'New York', description: 'Coach city' })
    @IsOptional()
    @IsString()
    readonly city?: string;

    @ApiPropertyOptional({ example: 'both', enum: WorkMode, description: 'Coach work mode: online, offline, or both' })
    @IsOptional()
    @IsEnum(WorkMode)
    readonly workMode?: WorkMode;

    @ApiPropertyOptional({ description: 'Sort field', enum: SortByField, example: SortByField.CREATED_AT })
    @IsOptional()
    @IsEnum(SortByField)
    sortBy?: SortByField;

    @ApiPropertyOptional({ description: 'Sort direction', enum: SortDirection, example: SortDirection.DESC })
    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
