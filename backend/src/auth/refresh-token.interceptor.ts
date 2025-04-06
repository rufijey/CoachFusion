import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { tap } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            tap((data) => {

                if (data?.refreshToken) {
                    res.cookie('refreshToken', data.refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        path: '/',
                    });

                    delete data.refreshToken;
                }
            }),
        );
    }
}
