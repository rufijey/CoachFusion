import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNumber, IsArray, ArrayNotEmpty, Min, IsInt, IsOptional, IsEnum} from 'class-validator';
import {WorkMode} from "../coach-profile.entity";

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

    @ApiProperty({ example: 'New York', description: 'City where the coach is located' })
    @IsOptional()
    @IsString()
    readonly city?: string;

    @ApiProperty({ example: 'both', enum: WorkMode, description: 'Coach work mode: online, offline, or both' })
    @IsOptional()
    @IsEnum(WorkMode)
    readonly workMode?: WorkMode;
}
