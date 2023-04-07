import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { TestBaseModule } from '../utils';

import { User } from '@/entities';
import { HttpStatus } from '@nestjs/common';

describe('User', () => {
    const testModule = new TestBaseModule();
    let userRepository: Repository<User>;

    beforeAll(async () => {
        await testModule.beforeAll();
        userRepository = testModule.module.get(getRepositoryToken(User));
    });

    afterAll(async()=>{
        await testModule.afterAll();
    })

    describe('/user', ()=>{
        const userId: string = randomUUID();

        beforeAll(async()=>{
            await userRepository.save(
                userRepository.create({
                    id: userId,
                    email: 'automaticTest@test.com',
                    password: 'test@123'
                })
            )
        });

        afterAll(async()=>{
            await userRepository.delete({id: userId});
        })
    
        it('GET -> should be able to list all users', async () => {
    
            const response = await testModule.httpRequest.get('/user');
    
            expect(response.status).toBe(HttpStatus.OK)
    
            const users = response.body as User[];
    
            expect(users).toHaveLength(1);
    
        });
    
        it('GET /:id ->  should be able to find a user by id', async () => {
    
            const response = await testModule.httpRequest.get(`/user/${userId}`);
    
            expect(response.status).toBe(HttpStatus.OK)
    
            const user = response.body as User;
    
            expect(user.id).toBe(userId);
            expect(user.email).toBe('automaticTest@test.com');
    
        });
    })
    
});
