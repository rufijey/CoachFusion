import {User} from "../user.entity";

export class UserDto {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: string
    ) {
    }

    static fromEntity(user: User): UserDto {
        return new UserDto(user.id, user.name, user.email, user.role);
    }
}