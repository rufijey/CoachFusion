import {UserDto} from "./user.dto";
import {ApiProperty} from "@nestjs/swagger";

export class UserListDto {

    readonly userDtos: UserDto[]

    constructor(
        userDtos: UserDto[],
    ) {
        this.userDtos = userDtos;
    }
}