import {ApiProperty} from "@nestjs/swagger";

export class UserTokenDto {

    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMj...', description: 'JWT token'})
    readonly accessToken: string;

    constructor(
        accessToken: string,
    ) {
      this.accessToken = accessToken;
    }
}