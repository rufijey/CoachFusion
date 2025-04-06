import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    const mockUsersService = {
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('should update user with image', async () => {
            const updateUserRequestDto: UpdateUserRequestDto = {
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            };

            const mockImage = [{ filename: 'profile.jpg' }] as Express.Multer.File[];

            const mockRequest: Partial<Request> = {
                protocol: 'http',
                host: 'localhost',
                user: { id: 1 },
            };

            const updateUserDto = new UpdateUserDto(
                mockRequest.user.id,
                'http',
                'localhost',
                updateUserRequestDto.email,
                updateUserRequestDto.password,
                updateUserRequestDto.name,
                mockImage[0]
            );

            jest.spyOn(usersService, 'update').mockResolvedValue(undefined);

            await expect(
                usersController.update(mockImage, updateUserRequestDto, mockRequest as Request)
            ).resolves.toBeUndefined();

            expect(mockUsersService.update).toHaveBeenCalledWith(updateUserDto);
        });

        it('should update user without image', async () => {
            const updateUserRequestDto: UpdateUserRequestDto = {
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            };

            const mockRequest: Partial<Request> = {
                protocol: 'http',
                host: 'localhost',
                user: { id: 1 },
            };

            const updateUserDto = new UpdateUserDto(
                mockRequest.user.id,
                'http',
                'localhost',
                updateUserRequestDto.email,
                updateUserRequestDto.password,
                updateUserRequestDto.name,
                undefined
            );

            jest.spyOn(usersService, 'update').mockResolvedValue(undefined);

            await expect(
                usersController.update([], updateUserRequestDto, mockRequest as Request)
            ).resolves.toBeUndefined();

            expect(mockUsersService.update).toHaveBeenCalledWith(updateUserDto);
        });
    });
});
