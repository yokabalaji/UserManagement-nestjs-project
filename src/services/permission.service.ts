import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/models/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '../dtos/create-permission-dto';
import { UpdatePermissionDto } from '../dtos/update-permission-dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}
  async createPermission(createPermissionDto: CreatePermissionDto) {
    const { action, model } = createPermissionDto;

    const permission = new Permission();
    permission.action = action;
    permission.model = model;

    return this.permissionRepo.save(permission);
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepo.update(id, updatePermissionDto);
  }

  async deletePermission(id: number) {
    return await this.permissionRepo.delete(id);
  }
}
