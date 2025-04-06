import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsInt, IsOptional } from 'class-validator';

export class UpdatePortfolioRequestDto {

    @ApiProperty({ example: 'Its description of this...', description: 'description' })
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiProperty({ example: '[1,2,3,4]', description: 'image ids for delete' })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    @IsOptional()
    readonly imageIdsForDelete?: number[];
}