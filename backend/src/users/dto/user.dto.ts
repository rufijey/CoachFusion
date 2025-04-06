import {User} from "../user.entity";
import {ApiProperty} from "@nestjs/swagger";
import {CoachProfileDto} from "../../coach-profiles/dto/coach-profile.dto";
import { ImageDto } from '../../images/dto/image.dto';

export class UserDto {
    @ApiProperty({ example: '1', description: 'Id' })
    readonly id: number;

    @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
    readonly email: string;

    @ApiProperty({ example: 'username', description: 'Username' })
    readonly name: string;

    @ApiProperty({ example: 'user', description: 'Role' })
    readonly role: string;

    @ApiProperty({ example: CoachProfileDto, description: 'coach profile' })
    readonly coachProfile?: CoachProfileDto;

    @ApiProperty({ example: ImageDto, description: 'profile image' })
    readonly profileImage?: ImageDto;

    constructor(
        id: number,
        email: string,
        name: string,
        role: string,
        coachProfile?: CoachProfileDto,
        profileImage?: ImageDto,
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.coachProfile = coachProfile;
        this.profileImage = profileImage;
    }

    static create(item: any): UserDto {
        return new UserDto(
            item.id,
            item.email,
            item.name,
            item.role,
            item.coachProfile ? CoachProfileDto.create(item.coachProfile) : undefined,
            item.profileImage ? ImageDto.create(item.profileImage) : undefined,
        );
    }
}