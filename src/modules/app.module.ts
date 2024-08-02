import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../modules/user.module';
import { User } from '../models/user.entity';
import { AuthenticationModule } from './authentication.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { EmailModule } from './email.module';
import { Role } from '../models/role.entity';
import { Permission } from '../models/permission.entity';
import { RoleModule } from './role.module';
import { PermissionModule } from './permission.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'usermanagementcheck',
      entities: [User, Role, Permission],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
    UserModule,
    AuthenticationModule,
    EmailModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
