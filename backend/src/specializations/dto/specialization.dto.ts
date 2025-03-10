import {Specialization} from "../specialization.entity";
import {ApiProperty} from "@nestjs/swagger";

export class SpecializationDto {

    @ApiProperty({example: '123', description: 'specialization id'})
    id: number;
    @ApiProperty({example: 'bodybuilding', description: 'specialization title'})
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }
}
