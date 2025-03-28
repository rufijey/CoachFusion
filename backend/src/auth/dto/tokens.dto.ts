import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class TokensDto {

    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMj...', description: 'JWT token'})
    readonly accessToken: string;

    @ApiHideProperty()
    readonly refreshToken: string;

    @ApiProperty({example: 'user', description: 'role'})
    readonly role: string;

    constructor(
        accessToken: string,
        refreshToken: string,
        role: string,
    ) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.role = role;
    }
}