import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TokensDto } from './dto/tokens.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../users/dto/user.dto';
import { UserRole } from '../users/user.entity';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
        refresh: jest.fn(),
        logout: jest.fn(),
        me: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return tokens', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
            const fingerprint = 'test-fingerprint';
            const tokens = new TokensDto('access-token', 'refresh-token');

            mockAuthService.login.mockResolvedValue(tokens);

            expect(await authController.login(loginDto, fingerprint)).toEqual(tokens);
        });
    });

    describe('registration', () => {
        it('should return tokens', async () => {
            const registerDto: RegisterDto = { email: 'test@example.com', password: 'password', name: 'Test' };
            const fingerprint = 'test-fingerprint';
            const tokens = new TokensDto('access-token', 'refresh-token');

            mockAuthService.register.mockResolvedValue(tokens);

            expect(await authController.registration(registerDto, fingerprint)).toEqual(tokens);
        });
    });

    describe('refresh', () => {
        it('should return new tokens', async () => {
            const req: any = { cookies: { refreshToken: 'refresh-token' } };
            const fingerprint = 'test-fingerprint';
            const tokens = new TokensDto('new-access-token', 'new-refresh-token');

            mockAuthService.refresh.mockResolvedValue(tokens);

            expect(await authController.refresh(req, fingerprint)).toEqual(tokens);
        });

        it('should throw UnauthorizedException if no refreshToken', async () => {
            const req: any = { cookies: {} };
            const fingerprint = 'test-fingerprint';

            await expect(authController.refresh(req, fingerprint)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should call logout and clear cookie', async () => {
            const req: any = { cookies: { refreshToken: 'refresh-token' } };
            const res: any = { clearCookie: jest.fn() };
            const fingerprint = 'test-fingerprint';

            mockAuthService.logout.mockResolvedValue(undefined);

            await authController.logout(req, res, fingerprint);
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', { path: '/api/auth/refresh' });
        });

        it('should throw BadRequestException if no refreshToken', async () => {
            const req: any = { cookies: {} };
            const res: any = { clearCookie: jest.fn() };
            const fingerprint = 'test-fingerprint';

            await expect(authController.logout(req, res, fingerprint)).rejects.toThrow(BadRequestException);
        });
    });

    describe('me', () => {
        it('should return user data', async () => {
            const req: any = { user: { id: 1, email: 'test@example.com', name: 'Test' } };
            const userDto: UserDto = { id: 1, email: 'test@example.com', name: 'Test', role: UserRole.USER };

            mockAuthService.me.mockResolvedValue(userDto);

            expect(await authController.me(req)).toEqual(userDto);
        });
    });
});
