import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ArrayNotEmpty, Min, IsInt, IsEnum } from 'class-validator';
import {WorkMode} from "../coach-profile.entity";

export class CreateProfileDto {

    @ApiProperty({ example: 'I am coach, I have...', description: 'description where coach tells about himself' })
    @IsString()
    readonly description: string;

    @ApiProperty({ example: '[1, 2, 3]', description: 'coach specialization ids' })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    readonly specializationIds: number[];

    @ApiProperty({ example: '3.0', description: 'coach experience' })
    @IsNumber()
    @Min(0)
    readonly experience: number;

    @ApiProperty({ example: 'New York', description: 'City where the coach is located' })
    @IsString()
    readonly city: string;

    @ApiProperty({ example: 'both', enum: WorkMode, description: 'Coach work mode: online, offline, or both' })
    @IsEnum(WorkMode)
    readonly workMode: WorkMode;
}
