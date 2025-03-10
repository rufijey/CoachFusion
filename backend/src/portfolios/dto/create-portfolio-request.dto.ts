import {ApiProperty} from "@nestjs/swagger";

export class CreatePortfolioRequestDto {

    @ApiProperty({example: 'Its description of this...', description: 'description'})
    readonly description: string;

}