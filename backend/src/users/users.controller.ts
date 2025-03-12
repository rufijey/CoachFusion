import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {UserDto} from "./dto/user.dto";
import {User} from "./user.entity";

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles('admin')
    @UseGuards(RolesGuard)
    getAll(): Promise<UserDto[]> {
        return this.usersService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id:number):Promise<UserDto> {
        return this.usersService.getById(id);
    }
}
