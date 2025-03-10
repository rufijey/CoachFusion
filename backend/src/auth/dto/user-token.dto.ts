import {ApiProperty} from "@nestjs/swagger";

export class UserTokenDto {

    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
        description: 'JWT token'})
    readonly accessToken: string;

    constructor(
        accessToken: string,
    ) {
      this.accessToken = accessToken;
    }
}