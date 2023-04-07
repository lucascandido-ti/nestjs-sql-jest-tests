import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { UserService } from '@/services';
import { CreateUserDTO } from '@/dtos';
import { User } from '@/entities';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getUsers(): Promise<User[]>{
        return await this.userService.getUsers();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserByID(@Param('id') id: string): Promise<User>{
        return await this.userService.getUserById(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: string){
        return await this.userService.deleteUser(id);
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    async postCreateUser(@Body() createUser: CreateUserDTO): Promise<User>{
        return await this.userService.createUser(createUser);
    }
}
