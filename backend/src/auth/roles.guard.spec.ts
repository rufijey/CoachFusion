import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';


describe('RolesGuard', () => {
    let rolesGuard: RolesGuard;
    let reflector: Reflector;
    let jwtService: JwtService;

    beforeEach(() => {
        reflector = new Reflector();
        jwtService = new JwtService({ secret: 'test-secret' });
        rolesGuard = new RolesGuard(jwtService, reflector);
    });

    const mockContext = (authHeader?: string, role?: string) => {
        return {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: authHeader ? { authorization: authHeader } : {},
                    user: role ? { role } : undefined,
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as unknown as ExecutionContext;
    };

    it('should allow access if no role is required', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
        expect(rolesGuard.canActivate(mockContext('Bearer valid-token', 'admin'))).toBe(true);
    });

    it('should throw UnauthorizedException if no token provided', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue('admin');
        expect(() => rolesGuard.canActivate(mockContext(undefined))).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue('admin');
        jest.spyOn(jwtService, 'verify').mockImplementation(() => { throw new Error('Invalid token'); });

        expect(() => rolesGuard.canActivate(mockContext('Bearer invalid-token'))).toThrow(HttpException);
    });

    it('should allow access if user has required role', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue('admin');
        jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'admin' });
        expect(rolesGuard.canActivate(mockContext('Bearer valid-token', 'admin'))).toBe(true);
    });

    it('should deny access if user does not have required role', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue('admin');
        jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'user' });

        expect(rolesGuard.canActivate(mockContext('Bearer valid-token', 'user'))).toBe(false);
    });
});