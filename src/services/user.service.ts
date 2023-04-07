
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from '@/dtos';
import { User } from '@/entities';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async createUser({
        email,
        password
    }:CreateUserDTO):Promise<User>{
        const id = randomUUID();
        const passCrypt = await bcrypt.hash(password,10);
        return await this.userRepository.save(
            this.userRepository.create({
                id: id,
                email,
                password: passCrypt
            })
        )
    }

    async deleteUser(id: string){
        return await this.userRepository.delete(id);
    }

    async getUsers():Promise<User[]>{
        return await this.userRepository.createQueryBuilder('users').getMany();
    }

    async getUserById(id: string):Promise<User>{
        const user = await this.userRepository.findOne({where: {id: id}});

        if(!user)
            throw new NotFoundException();
        
        return user;
    }
}
