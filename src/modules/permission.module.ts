import { Module, forwardRef } from '@nestjs/common';
import { PermissionController } from '../controllers/permission.controller';
import { PermissionService } from '../services/permission.service';
import { Permission } from 'src/models/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from 'src/modules/role.module';
import { Role } from 'src/models/role.entity';
import { AbilityModule } from 'src/modules/ability.module';
import { UserModule } from 'src/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, Role]),
    forwardRef(() => RoleModule),
    AbilityModule,
    forwardRef(() => UserModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
