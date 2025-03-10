import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNumber, IsArray, ArrayNotEmpty, Min, IsInt, IsOptional} from 'class-validator';

export class UpdateProfileDto {

    @ApiProperty({ example: 'I am coach, I have...', description: 'description where coach tells about himself' })
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiProperty({ example: '[1, 2, 3]', description: 'coach specialization ids' })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    readonly specializationIds?: number[];

    @ApiProperty({ example: '3.0', description: 'coach experience' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly experience?: number;
}
