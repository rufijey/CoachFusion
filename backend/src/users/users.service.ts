import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {User, UserRole} from "./user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserDto} from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import {isLocalFile} from "@swc/core/spack";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.userRepository.create({...createUserDto, password: hashPassword})

        const savedUser = await this.userRepository.save(user);

        return UserDto.create(savedUser);

    }

    async getAll(): Promise<UserDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => new UserDto(user.id, user.email, user.name, user.role));
    }

    async validateUser(email: string, password: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({
            where: {email},
            relations: {
                coachProfile: true
            },
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        const passwordEquals = await bcrypt.compare(password, user.password);
        if (passwordEquals) {
            return UserDto.create(user);
        }
        throw new UnauthorizedException({message: 'Incorrect e-mail or password'});
    }

    async getByEmail(email: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({where: {email}});
        if (user) {
            return UserDto.create(user);
        }
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    async isExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({where: {email}});

        return !!user;
    }

    async getWithRelations(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOne(
            {
                where: {id},
                relations:{
                    coachProfile: {
                        specializations: true,
                        portfolioItems: {
                            images: true
                        }
                    }
                }
            });
        if (user) {
            return UserDto.create(user);
        }
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    async getById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOne(
            {
                where: {id},
            });
        if (user) {
            return UserDto.create(user);
        }
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    async makeCoach(id: number): Promise<void> {
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        user.role = UserRole.COACH;

        await this.userRepository.update(user.id, user);
    }
}
