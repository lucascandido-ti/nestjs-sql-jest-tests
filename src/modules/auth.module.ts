import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session, User } from '@/entities';

import { AuthController } from './../controllers/auth.controller';
import { AuthService } from './../services/auth.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Session])
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
