import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

import { TestBaseModule } from '../utils';

import { User, Session } from '@/entities';
import { HttpStatus } from '@nestjs/common';

describe('Auth', () => {
    const testModule = new TestBaseModule();
    let userRepository: Repository<User>;
    let sessionRepository: Repository<Session>;

    beforeAll(async () => {
        await testModule.beforeAll();
        userRepository = testModule.module.get(getRepositoryToken(User));
        sessionRepository = testModule.module.get(getRepositoryToken(Session));
    });

    afterAll(async()=>{
        await testModule.afterAll();
    })

    describe('/login', ()=>{
        const userId: string = randomUUID();
        let session: string = '';

        beforeAll(async()=>{
            const password = await bcrypt.hash('pwd123',10);
            await userRepository.save(
                userRepository.create({
                    id: userId,
                    email: 'user@test.com',
                    password: password
                })
            )
        });

        afterAll(async()=>{
            await userRepository.delete({id: userId});
            await sessionRepository.delete({});
        })
    
        it('POST /login | Positive -> should be able to allow user access and receved a session token', async () => {
    
            const response = await testModule.httpRequest
                .post('/login')
                .send({
                    email: 'user@test.com',
                    password: 'pwd123'
                });
    
            expect(response.status).toBe(HttpStatus.ACCEPTED)
    
            const sessionToken = response.text;
    
            expect(sessionToken).toBeDefined();

            
            const userToSession = JSON.stringify({
                user: {
                    email: 'user@test.com'
                }
            })
            const resultSession =  await bcrypt.compare(userToSession, sessionToken)

            expect(resultSession).toBe(true);
            
            session = sessionToken;
    
        });
    
        it('POST /login | Negative -> should get an error message saying that the password is invalid', async () => {
    
            const response = await testModule.httpRequest
                .post('/login')
                .send({
                    email: 'user@test.com',
                    password: 'pwd12345'
                });
    
            expect(response.status).toBe(HttpStatus.ACCEPTED)
    
            const result = response.body as { error: { message : string } }
    
            expect(result.error.message).toBe('Senha invalida');

        });

        
        it('POST /reset-password | Negative -> should be able to change the password', async () => {
    
            const response = await testModule.httpRequest
                .post('/reset-password')
                .send({
                    email: 'user@test.com',
                    password: 'pwd12345',
                    newPassword: 'pwd1234'
                });
    
            expect(response.status).toBe(HttpStatus.ACCEPTED)
    
            const result = response.body as { error: { message : string } }
    
            expect(result.error.message).toBe('Senha invalida');
    
        });

        it('POST /reset-password | Positive -> should be able to change the password', async () => {
    
            const response = await testModule.httpRequest
                .post('/reset-password')
                .send({
                    email: 'user@test.com',
                    password: 'pwd123',
                    newPassword: 'pwd1234'
                });
    
            expect(response.status).toBe(HttpStatus.ACCEPTED)
    
            const result = response.body as {passwordChange: boolean};
    
            expect(result.passwordChange).toBe(true);
    
        });

        
        it('POST /login -> should be able to allow user access after change password', async () => {
    
            const response = await testModule.httpRequest
                .post('/login')
                .send({
                    email: 'user@test.com',
                    password: 'pwd1234'
                });
    
            expect(response.status).toBe(HttpStatus.ACCEPTED)
    
            const sessionToken = response.text;
    
            expect(sessionToken).toBeDefined();

            const userToSession = JSON.stringify({
                user: {
                    email: 'user@test.com'
                }
            })
            const resultSession =  await bcrypt.compare(userToSession, sessionToken)

            expect(resultSession).toBe(true);
            
            session = sessionToken;
    
        });
    
        it('POST /logout -> should be able to log out user', async () => {
    
            expect(session).toBeDefined();
            
            const response = await testModule.httpRequest
                .post('/logout')
                .send({
                    token: session
                });
    
            expect(response.status).toBe(HttpStatus.ACCEPTED)
    
            const result = response.body as {logout: boolean};
    
            expect(result.logout).toBe(true);
    
        });

    
    })
    
});
