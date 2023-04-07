import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Session, User } from '@/entities';
import { Error } from '@/interfaces';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async login(email: string, password: string): Promise<string | Error> {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.email = :email',{ email: email })
      .getOne();

    if (!user) {
      return { error : { message: 'Usuario não encontrado'}} as Error
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error : { message: 'Senha invalida'}} as Error
    }
    
    const session = await this.registerSession(user);
    return session.token;
  }

  async logout(token: string): Promise<{ logout: boolean } | Error> {
    const session = await this.sessionRepository.createQueryBuilder('session')
      .where('session.token = :token', { token: token})
      .getOne();

    if (!session) {
      return { error : { message: 'Session não encontrada'}} as Error
    }
    await this.sessionRepository.delete(session);

    return { logout: true };
  }

  async resetPassword(
    email: string,
    password: string,
    newPassword: string,
  ): Promise<{passwordChange: boolean} | Error> {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.email = :email',{ email: email })
      .getOne();
      
    if (!user) {
      return { error : { message: 'Usuario não encontrado'}} as Error
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error : { message: 'Senha invalida'}} as Error
    }
    
    user.password = await bcrypt.hash(newPassword, 10);

    const activeSession = await this.sessionRepository.findOne({where: {user_id: user.id}});
    if(activeSession)
      await this.sessionRepository.delete(activeSession);

    await this.userRepository.save(user);

    return { passwordChange: true }
  }


  async registerSession(user: User): Promise<Session>{
    const session = new Session();
    const userToSession = {
      user: {
        email: user.email
      }
    }
    session.token = await bcrypt.hash(JSON.stringify(userToSession), 10);
    session.user = user;
    await this.sessionRepository.save(session);

    return session;
  }
}