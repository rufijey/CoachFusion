import { RefreshTokenInterceptor } from './refresh-token.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';


describe('RefreshTokenInterceptor', () => {
    let interceptor: RefreshTokenInterceptor;
    let mockExecutionContext: ExecutionContext;
    let mockCallHandler: CallHandler;

    beforeEach(() => {
        interceptor = new RefreshTokenInterceptor();

        const response = { cookie: jest.fn() };

        mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({}),
                getResponse: () => response,
            }),
        } as ExecutionContext;

        mockCallHandler = { handle: jest.fn().mockReturnValue(of(
            { refreshToken: 'new-refresh-token', accessToken: 'new-access-token' })) };
    });


    it('should set refreshToken as cookie and remove from response body', (done) => {
        const response = mockExecutionContext.switchToHttp().getResponse();

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
            expect(response.cookie).toHaveBeenCalledWith(
                'refreshToken',
                'new-refresh-token',
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/api/auth/refresh',
                },
            );
            expect(result).not.toHaveProperty('refreshToken');
            done();
        });
    });
});
