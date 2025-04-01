import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { ProfileImagesService } from '../images/profile-images.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SaveProfileImageDto } from '../images/dto/save-profile-image.dto';
import { ImageDto } from '../images/dto/image.dto';
import { CoachProfile } from '../coach-profiles/coach-profile.entity';
import { ProfileImage } from '../images/profile-image.entity';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;
    let imagesService: ProfileImagesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: ProfileImagesService,
                    useValue: {
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        imagesService = module.get<ProfileImagesService>(ProfileImagesService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const hashPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = { ...createUserDto, password: hashPassword, id: 1 };
            const userDto = UserDto.create(user);

            jest.spyOn(userRepository, 'create').mockReturnValue(user as User);
            jest.spyOn(userRepository, 'save').mockResolvedValue(user as User);

            const result = await service.create(createUserDto);

            expect(userRepository.create).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
            expect(result).toEqual(userDto);
        });
    });


    describe('update', () => {
        it('should throw UnauthorizedException if user is not found', async () => {
            const updateUserDto: UpdateUserDto = { id: 1, name: 'Updated User', protocol: 'http', host: 'localhost' };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.update(updateUserDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should update user without changing profile image', async () => {
            const updateUserDto: UpdateUserDto = { id: 1, name: 'Updated User', protocol: 'http', host: 'localhost' };
            const user = {
                id: 1,
                name: 'Test User',
                email: '123@gmail.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                password: 'password123',
                role: UserRole.USER,
                profileImage: { id: 1 },
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(userRepository, 'create').mockReturnValue(user as User);
            jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
            jest.spyOn(imagesService, 'delete');
            jest.spyOn(imagesService, 'save');

            await service.update(updateUserDto);

            expect(imagesService.delete).not.toHaveBeenCalledWith(user.profileImage.id);
            expect(imagesService.save).not.toHaveBeenCalledWith(expect.any(SaveProfileImageDto));
            expect(userRepository.update).toHaveBeenCalled();
        });

        it('should update user and replace profile image', async () => {
            const updateUserDto: UpdateUserDto = {
                id: 1,
                name: 'Updated User',
                imageFile: { filename: '123.jpg' },
                protocol: 'http',
                host: 'localhost',
            };
            const user = {
                id: 1,
                name: 'Test User',
                email: '123@gmail.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                password: 'password123',
                role: UserRole.USER,
                profileImage: { id: 2 }
            };
            const newImage: ImageDto = { id: 3, url: 'url', path: 'path' };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(userRepository, 'create').mockReturnValue({ ...user, profileImage: { id: newImage.id } } as User);
            jest.spyOn(imagesService, 'delete').mockResolvedValue();
            jest.spyOn(imagesService, 'save').mockResolvedValue(newImage);
            jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

            await service.update(updateUserDto);

            expect(imagesService.delete).toHaveBeenCalledWith(user.profileImage.id);
            expect(imagesService.save).toHaveBeenCalledWith(expect.any(SaveProfileImageDto));
            expect(userRepository.update).toHaveBeenCalled();
        });
    });

    describe('getAll', () => {
        it('should return an array of UserDto', async () => {
            const users = [
                { id: 1, email: 'test1@example.com', name: 'Test User 1', role: 'USER' },
                { id: 2, email: 'test2@example.com', name: 'Test User 2', role: 'USER' },
            ];
            const userDtos = users.map(user => new UserDto(user.id, user.email, user.name, user.role));

            jest.spyOn(userRepository, 'find').mockResolvedValue(users as User[]);

            const result = await service.getAll();

            expect(userRepository.find).toHaveBeenCalled();
            expect(result).toEqual(userDtos);
        });
    });

    describe('validateUser', () => {
        it('should return a UserDto if credentials are valid', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const user = { id: 1, email, password: await bcrypt.hash(password, 10), name: 'Test User', role: 'USER' };
            const userDto = UserDto.create(user);

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

            const result = await service.validateUser(email, password);

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email },
                relations: { coachProfile: true },
            });
            expect(result).toEqual(userDto);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            const email = 'test@example.com';
            const password = 'wrongpassword';
            const user = {
                id: 1,
                email,
                password: await bcrypt.hash('password123', 10),
                name: 'Test User',
                role: 'USER',
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

            await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw HttpException if user is not found', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.validateUser(email, password)).rejects.toThrow(HttpException);
        });
    });

    describe('isExists', () => {
        it('should return true if user exists', async () => {
            const email = 'test@example.com';
            const user = { id: 1, email, name: 'Test User', role: 'USER' };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

            const result = await service.isExists(email);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toBe(true);
        });

        it('should return false if user does not exist', async () => {
            const email = 'test@example.com';

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            const result = await service.isExists(email);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toBe(false);
        });
    });

    describe('getWithRelations', () => {
        it('should return a UserDto with relations', async () => {
            const id = 1;
            const user = {
                id,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
            };
            const userDto = UserDto.create(user);

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

            const result = await service.getWithRelations(id);

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: {id},
                relations:{
                    coachProfile: {
                        specializations: true,
                        portfolioItems: {
                            images: true
                        }
                    },
                    profileImage: true
                }
            });
            expect(result).toEqual(userDto);
        });

        it('should throw HttpException if user is not found', async () => {
            const id = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.getWithRelations(id)).rejects.toThrow(HttpException);
        });
    });

    describe('getById', () => {
        it('should return a UserDto', async () => {
            const id = 1;
            const user = { id, email: 'test@example.com', name: 'Test User', role: 'USER' };
            const userDto = UserDto.create(user);

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

            const result = await service.getById(id);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(result).toEqual(userDto);
        });

        it('should throw HttpException if user is not found', async () => {
            const id = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.getById(id)).rejects.toThrow(HttpException);
        });
    });

    describe('makeCoach', () => {
        it('should update user role to COACH', async () => {
            const id = 1;
            const user = { id, email: 'test@example.com', name: 'Test User', role: 'USER' };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

            await service.makeCoach(id);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(userRepository.update).toHaveBeenCalledWith(user.id, { ...user, role: UserRole.COACH });
        });

        it('should throw HttpException if user is not found', async () => {
            const id = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.makeCoach(id)).rejects.toThrow(HttpException);
        });
    });

    describe('makeAdmin', () => {
        it('should update user role to ADMIN', async () => {
            const id = 1;
            const user = { id, email: 'test@example.com', name: 'Test User', role: 'USER' };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
            jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

            await service.makeAdmin(id);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(userRepository.update).toHaveBeenCalledWith(user.id, { ...user, role: UserRole.ADMIN });
        });

        it('should throw HttpException if user is not found', async () => {
            const id = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.makeCoach(id)).rejects.toThrow(HttpException);
        });
    });
});
