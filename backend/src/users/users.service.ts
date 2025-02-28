import { Injectable } from '@nestjs/common';
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserDto} from "./dto/user.dto";
import {UserListDto} from "./dto/user-list.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const newUser = this.usersRepository.create(createUserDto);
        const user = await this.usersRepository.save(newUser);

        return UserDto.fromEntity(user);
    }

    async getAll(): Promise<UserListDto> {
        const users = await this.usersRepository.find();
        const userDtos = users.map(user => UserDto.fromEntity(user));
        return new UserListDto(userDtos);
    }
}
