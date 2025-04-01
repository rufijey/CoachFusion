import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { ProfileImagesService } from '../images/profile-images.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavePortfolioImagesDto } from '../images/dto/save-portfolio-images.dto';
import { SaveProfileImageDto } from '../images/dto/save-profile-image.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly imagesService: ProfileImagesService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.userRepository.create({ ...createUserDto, password: hashPassword });

        const savedUser = await this.userRepository.save(user);

        return UserDto.create(savedUser);

    }

    async update(updateUserDto: UpdateUserDto): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: updateUserDto.id },
            relations: {
                profileImage: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        if (updateUserDto.imageFile) {

            if (user.profileImage) await this.imagesService.delete(user.profileImage.id);

            const saveImageDto = new SaveProfileImageDto(
                updateUserDto.imageFile,
                updateUserDto.protocol,
                updateUserDto.host,
                updateUserDto.id);
            const image = await this.imagesService.save(saveImageDto);
        }

        const password = updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : undefined;
        const savedUser = this.userRepository.create({
            ...updateUserDto,
            password: password,
        });
        await this.userRepository.update(savedUser.id, savedUser);
    }

    async getAll(): Promise<UserDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => new UserDto(user.id, user.email, user.name, user.role));
    }

    async validateUser(email: string, password: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: {
                coachProfile: true,
            },
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        const passwordEquals = await bcrypt.compare(password, user.password);
        if (passwordEquals) {
            return UserDto.create(user);
        }
        throw new UnauthorizedException({ message: 'Incorrect e-mail or password' });
    }

    async isExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });

        return !!user;
    }

    async getWithRelations(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOne(
            {
                where: { id },
                relations: {
                    coachProfile: {
                        specializations: true,
                        portfolioItems: {
                            images: true,
                        },
                    },
                    profileImage: true,
                },
            });
        if (user) {
            return UserDto.create(user);
        }
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    async getById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOne(
            {
                where: { id },
            });
        if (user) {
            return UserDto.create(user);
        }
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    async makeCoach(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        user.role = UserRole.COACH;

        await this.userRepository.update(user.id, user);
    }

    async makeAdmin(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        user.role = UserRole.ADMIN;

        await this.userRepository.update(user.id, user);
    }
}
