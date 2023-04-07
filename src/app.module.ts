import { UserModule } from './modules/user.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, User } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      logging: true,
      entities: [User, Session],
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule { }
