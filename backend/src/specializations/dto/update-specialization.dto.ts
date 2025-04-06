import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class UpdateSpecializationDto {
    @ApiProperty({example: 'bodybuilding', description: 'specialization title'})
    @IsString()
    @IsOptional()
    title: string;
}
