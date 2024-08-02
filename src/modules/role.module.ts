import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from '../controllers/role.controller';
import { RoleService } from '../services/role.service';
import { Role } from 'src/models/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../modules/permission.module';
import { Permission } from 'src/models/permission.entity';
import { AbilityModule } from '../modules/ability.module';
import { UserModule } from 'src/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    forwardRef(() => PermissionModule),
    AbilityModule,
    forwardRef(() => UserModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
