import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as crypto from 'crypto';
import { TokensDto } from './dto/tokens.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {
    }

    async login(loginDto: LoginDto, fingerprint: string): Promise<TokensDto> {
        if (!fingerprint) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.validateUser(loginDto.email, loginDto.password);
        return this.generateTokens(user, fingerprint);
    }

    async register(registerDto: RegisterDto, fingerprint: string): Promise<TokensDto> {
        if (!fingerprint) {
            throw new UnauthorizedException();
        }
        if (await this.userService.isExists(registerDto.email)) {
            throw new HttpException('A user with this email exists', HttpStatus.BAD_REQUEST);
        }
        const userDto = new CreateUserDto(registerDto.email, registerDto.password, registerDto.name);
        const user = await this.userService.create(userDto);
        return this.generateTokens(user, fingerprint);
    }

    async refresh(oldRefreshToken: string, fingerprint: string): Promise<TokensDto> {
        if (!fingerprint) {
            throw new UnauthorizedException();
        }
        if (!oldRefreshToken) {
            throw new UnauthorizedException('no refreshToken');
        }

        const storedToken = await this.refreshTokenRepository.findOne(
            {
                where: { token: oldRefreshToken },
                relations: { user: true },
            });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const user = await this.userService.getById(storedToken.user.id);

        return this.generateTokens(user, fingerprint);
    }

    async logout(refreshToken: string, fingerprint: string): Promise<void> {
        if (!fingerprint) {
            throw new UnauthorizedException();
        }
        if (!refreshToken) {
            throw new UnauthorizedException('no refreshToken');
        }

        const storedToken = await this.refreshTokenRepository.findOne(
            {
                where: { token: refreshToken, fingerprint: fingerprint },
                relations: { user: true },
            });

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        await this.refreshTokenRepository.delete({
            user: { id: storedToken.user.id },
            fingerprint: storedToken.fingerprint,
        });
    }

    async me(decodedUser: any): Promise<UserDto> {
        if (!decodedUser) {
            throw new UnauthorizedException('unauthorized');
        }
        return await this.userService.getWithRelations(decodedUser.id);

    }

    private async generateTokens(user: UserDto, fingerprint: string): Promise<TokensDto> {

        const payload = {
            email: user.email,
            id: user.id,
            role: user.role,
            coachProfileId: user.coachProfile ? user.coachProfile.id : null,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = await this.createRefreshToken(user, fingerprint);

        return new TokensDto(accessToken, refreshToken, user.role);
    }

    private async createRefreshToken(user: UserDto, fingerprint: string): Promise<string> {
        await this.refreshTokenRepository.delete({ user: { id: user.id }, fingerprint: fingerprint });

        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const refreshTokenEntity = this.refreshTokenRepository.create(
            { user: { id: user.id }, token: refreshToken, expiresAt: expiresAt, fingerprint: fingerprint });
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return refreshToken;
    }
}