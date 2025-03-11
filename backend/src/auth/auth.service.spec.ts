import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import {User, UserRole} from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { TokensDto } from './dto/tokens.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UsersService;
    let refreshTokenRepository: Repository<RefreshToken>;
    let jwtService: JwtService;

    const mockUserService = {
        validateUser: jest.fn(),
        isExists: jest.fn(),
        create: jest.fn(),
        getById: jest.fn(),
        getWithRelations: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    const mockRefreshTokenRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUserService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: getRepositoryToken(RefreshToken),
                    useValue: mockRefreshTokenRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        refreshTokenRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return tokens when credentials are valid', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
            const fingerprint = 'some-fingerprint';
            const user = { id: 1, email: 'test@example.com', name: 'username', role: UserRole.USER };
            const userDto = new UserDto(user.id, user.email, user.name, user.role);

            mockUserService.validateUser.mockResolvedValue(userDto);
            mockJwtService.sign.mockReturnValue('accessToken');
            mockRefreshTokenRepository.create.mockReturnValue({ token: 'refreshToken' });
            mockRefreshTokenRepository.save.mockResolvedValue(undefined);

            const result = await service.login(loginDto, fingerprint);

            expect(mockUserService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
            expect(mockJwtService.sign).toHaveBeenCalled();
            expect(mockRefreshTokenRepository.create).toHaveBeenCalled();
            expect(mockRefreshTokenRepository.save).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if user is not found', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
            const fingerprint = 'some-fingerprint';

            mockUserService.validateUser.mockRejectedValue(new UnauthorizedException());

            await expect(service.login(loginDto, fingerprint)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should register a new user and return tokens', async () => {
            const registerDto: RegisterDto = { email: 'newuser@example.com', password: 'password123', name: 'New User' };
            const fingerprint = 'some-fingerprint';
            const userDto = new UserDto(1, 'test@example.com', 'username', UserRole.USER);

            mockUserService.isExists.mockResolvedValue(false);
            mockUserService.create.mockResolvedValue(userDto);
            mockJwtService.sign.mockReturnValue('accessToken');
            mockRefreshTokenRepository.create.mockReturnValue({ token: 'refreshToken' });
            mockRefreshTokenRepository.save.mockResolvedValue(undefined);

            const result = await service.register(registerDto, fingerprint);

            expect(mockUserService.isExists).toHaveBeenCalledWith(registerDto.email);
            expect(mockUserService.create).toHaveBeenCalledWith(expect.objectContaining(registerDto));
            expect(mockJwtService.sign).toHaveBeenCalled();
            expect(mockRefreshTokenRepository.create).toHaveBeenCalled();
            expect(mockRefreshTokenRepository.save).toHaveBeenCalled();
        });

        it('should throw HttpException if user already exists', async () => {
            const registerDto: RegisterDto = { email: 'existing@example.com', password: 'password123', name: 'Existing User' };
            const fingerprint = 'some-fingerprint';

            mockUserService.isExists.mockResolvedValue(true);

            await expect(service.register(registerDto, fingerprint)).rejects.toThrow(HttpException);
            expect(mockUserService.isExists).toHaveBeenCalledWith(registerDto.email);
        });
    });

    describe('refresh', () => {
        it('should return new tokens if refresh token is valid', async () => {
            const oldRefreshToken = 'old-refresh-token';
            const fingerprint = 'some-fingerprint';
            const storedToken = { token: oldRefreshToken, expiresAt: new Date(new Date().getTime() + 1000), user: { id: 1 } };
            const userDto = new UserDto(1, 'test@example.com', 'username', UserRole.USER);

            mockRefreshTokenRepository.findOne.mockResolvedValue(storedToken);
            mockUserService.getById.mockResolvedValue(userDto);
            mockJwtService.sign.mockReturnValue('accessToken');
            mockRefreshTokenRepository.create.mockReturnValue({ token: 'refreshToken' });
            mockRefreshTokenRepository.save.mockResolvedValue(undefined);

            const result = await service.refresh(oldRefreshToken, fingerprint);

            expect(mockRefreshTokenRepository.findOne).toHaveBeenCalledWith({
                where: { token: oldRefreshToken },
                relations: { user: true },
            });
            expect(mockJwtService.sign).toHaveBeenCalled();
            expect(mockRefreshTokenRepository.create).toHaveBeenCalled();
            expect(mockRefreshTokenRepository.save).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if refresh token is expired', async () => {
            const oldRefreshToken = 'old-refresh-token';
            const fingerprint = 'some-fingerprint';
            const storedToken = { token: oldRefreshToken, expiresAt: new Date(new Date().getTime() - 1000) };

            mockRefreshTokenRepository.findOne.mockResolvedValue(storedToken);

            await expect(service.refresh(oldRefreshToken, fingerprint)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if refresh token is not found', async () => {
            const oldRefreshToken = 'old-refresh-token';
            const fingerprint = 'some-fingerprint';

            mockRefreshTokenRepository.findOne.mockResolvedValue(null);

            await expect(service.refresh(oldRefreshToken, fingerprint)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should remove refresh token from repository', async () => {
            const refreshToken = 'refresh-token';
            const fingerprint = 'some-fingerprint';
            const storedToken = { user: { id: 1 }, fingerprint };

            mockRefreshTokenRepository.findOne.mockResolvedValue(storedToken);

            await service.logout(refreshToken, fingerprint);

            expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith({
                user: { id: storedToken.user.id },
                fingerprint: storedToken.fingerprint,
            });
        });

        it('should throw UnauthorizedException if refresh token is not found', async () => {
            const refreshToken = 'refresh-token';
            const fingerprint = 'some-fingerprint';

            mockRefreshTokenRepository.findOne.mockResolvedValue(null);

            await expect(service.logout(refreshToken, fingerprint)).rejects.toThrow(UnauthorizedException);
        });
    });
    
    describe('me', () => {
        it('should throw UnauthorizedException if decoded user not found ', async () => {
            await expect(service.me(undefined)).rejects.toThrow(UnauthorizedException);
        });
    })
});
