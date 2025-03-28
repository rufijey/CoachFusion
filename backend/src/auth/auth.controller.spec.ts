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
            const tokens = new TokensDto('access-token', 'refresh-token', UserRole.USER);

            mockAuthService.login.mockResolvedValue(tokens);

            expect(await authController.login(loginDto, fingerprint)).toEqual(tokens);
        });
    });

    describe('registration', () => {
        it('should return tokens', async () => {
            const registerDto: RegisterDto = { email: 'test@example.com', password: 'password', name: 'Test' };
            const fingerprint = 'test-fingerprint';
            const tokens = new TokensDto('access-token', 'refresh-token', UserRole.USER);

            mockAuthService.register.mockResolvedValue(tokens);

            expect(await authController.registration(registerDto, fingerprint)).toEqual(tokens);
        });
    });

    describe('refresh', () => {
        it('should return new tokens', async () => {
            const req: any = { cookies: { refreshToken: 'refresh-token' } };
            const fingerprint = 'test-fingerprint';
            const tokens = new TokensDto('new-access-token', 'new-refresh-token', UserRole.USER);

            mockAuthService.refresh.mockResolvedValue(tokens);

            expect(await authController.refresh(req, fingerprint)).toEqual(tokens);
        });
    });

    describe('logout', () => {
        it('should call logout and clear cookie', async () => {
            const req: any = { cookies: { refreshToken: 'refresh-token' } };
            const res: any = { clearCookie: jest.fn(), send: jest.fn() };
            const fingerprint = 'test-fingerprint';

            mockAuthService.logout.mockResolvedValue(undefined);

            await authController.logout(req, res, fingerprint);
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', { path: '/' });
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
