import {ApiProperty} from "@nestjs/swagger";
import { IsString } from 'class-validator';

export class CreatePortfolioRequestDto {

    @ApiProperty({example: 'Its description of this...', description: 'description'})
    @IsString()
    readonly description: string;

}