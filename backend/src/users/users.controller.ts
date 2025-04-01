import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post, Req, UploadedFile, UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageSaveOptions } from '../images/image-save.options';
import { Request } from 'express';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(
        FilesInterceptor('image', 1, imageSaveOptions)
    )
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiConsumes('multipart/form-data')
    update(
        @UploadedFiles() image: Express.Multer.File[],
        @Body() updateUserRequestDto: UpdateUserRequestDto,
        @Req() req: Request
    ) {

        const protocol = req.protocol;
        const host = req.host;
        const updateDto = new UpdateUserDto(
            req.user.id,
            protocol,
            host,
            updateUserRequestDto.email,
            updateUserRequestDto.password,
            updateUserRequestDto.name,
            image[0]
        );
        return this.usersService.update(updateDto);
    }

}
