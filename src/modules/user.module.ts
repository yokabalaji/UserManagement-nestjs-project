import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { RoleModule } from 'src/modules/role.module';
import { Role } from 'src/models/role.entity';
import { Permission } from 'src/models/permission.entity';
import { PermissionModule } from 'src/modules/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
