import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateSpecializationDto {
    @ApiProperty({example: 'bodybuilding', description: 'specialization title'})
    @IsString()
    title: string;
}
