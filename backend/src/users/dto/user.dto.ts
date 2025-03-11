import {User} from "../user.entity";
import {ApiProperty} from "@nestjs/swagger";
import {CoachProfileDto} from "../../coach-profiles/dto/coach-profile.dto";

export class UserDto {
    @ApiProperty({ example: '1', description: 'Id' })
    readonly id: number;

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    readonly email: string;

    @ApiProperty({ example: 'username', description: 'Username' })
    readonly name: string;

    @ApiProperty({ example: 'user', description: 'Role' })
    readonly role: string;

    @ApiProperty({ example: 'user', description: 'Role' })
    readonly coachProfile?: CoachProfileDto;

    constructor(
        id: number,
        email: string,
        name: string,
        role: string,
        coachProfile?: CoachProfileDto
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.coachProfile = coachProfile;
    }

    static create(item: any): UserDto {
        return new UserDto(
            item.id,
            item.email,
            item.name,
            item.role,
            item.coachProfile ? CoachProfileDto.create(item.coachProfile) : undefined,
        );
    }
}