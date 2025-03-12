import {
    Body,
    Controller,
    Post,
    Get,
    Res,
    Req,
    UnauthorizedException,
    Headers,
    UseGuards,
    BadRequestException, UseInterceptors
} from '@nestjs/common';
import {Response, Request} from 'express';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import {RegisterDto} from './dto/register.dto';
import {TokensDto} from './dto/tokens.dto';
import {ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {UserTokenDto} from "./dto/user-token.dto";
import {UserDto} from "../users/dto/user.dto";
import {RefreshTokenInterceptor} from "./refresh-token.interceptor";

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    @UseInterceptors(RefreshTokenInterceptor)
    @ApiHeader({
        name: 'fingerprint',
        description: 'User device fingerprint',
        required: true,
        example: 'device-fingerprint-12345',
    })
    @ApiOperation({summary: 'Login user'})
    @ApiResponse({status: 200, type: UserTokenDto})
    async login(@Body() loginDto: LoginDto,
                @Headers('fingerprint') fingerprint: string): Promise<TokensDto> {

        const tokens = await this.authService.login(loginDto, fingerprint);

        return new TokensDto(tokens.accessToken, tokens.refreshToken);
    }

    @Post('registration')
    @UseInterceptors(RefreshTokenInterceptor)
    @ApiHeader({
        name: 'fingerprint',
        description: 'User device fingerprint',
        required: true,
        example: 'device-fingerprint-12345',
    })
    @ApiOperation({summary: 'Register user'})
    @ApiResponse({status: 200, type: UserTokenDto})
    async registration(@Body() registerDto: RegisterDto,
                       @Headers('fingerprint') fingerprint: string): Promise<TokensDto> {

        const tokens = await this.authService.register(registerDto, fingerprint);

        return new TokensDto(tokens.accessToken, tokens.refreshToken);
    }

    @Post('refresh')
    @UseInterceptors(RefreshTokenInterceptor)
    @ApiHeader({
        name: 'fingerprint',
        description: 'User device fingerprint',
        required: true,
        example: 'device-fingerprint-12345',
    })
    @ApiOperation({summary: 'Refresh tokens'})
    @ApiResponse({status: 200, type: UserTokenDto})
    async refresh(@Req() req: Request,
                  @Headers('fingerprint') fingerprint: string):Promise<TokensDto> {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('no refreshToken');
        }

        const tokens = await this.authService.refresh(refreshToken, fingerprint);

        return new TokensDto(tokens.accessToken, tokens.refreshToken);
    }

    @Post('logout')
    @ApiHeader({
        name: 'fingerprint',
        description: 'User device fingerprint',
        required: true,
        example: 'device-fingerprint-12345',
    })
    @ApiOperation({summary: 'logout user'})
    @ApiResponse({status: 200})
    async logout(@Req() req: Request,
                 @Res() res: Response,
                 @Headers('fingerprint') fingerprint: string): Promise<void> {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new BadRequestException('no refreshToken');
        }

        await this.authService.logout(refreshToken, fingerprint);

        res.clearCookie('refreshToken', {path: '/api/auth/refresh'});
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Get user data'})
    @ApiResponse({status: 200, type: UserDto})
    async me(@Req() req: Request):Promise<UserDto> {
        return this.authService.me(req.user);
    }
}
