import {UserDto} from "./user.dto";

export class UserListDto {
    constructor(
        readonly userDtos: UserDto[],
    ) {
    }
}