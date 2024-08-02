import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user-dtos';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user-dtos';
import { Role } from 'src/models/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createUser(createUserdto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserdto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (createUserdto.password !== createUserdto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    createUserdto.password = await bcrypt.hash(createUserdto.password, 10);
    const { confirmPassword, ...updateData } = createUserdto;
    console.log(confirmPassword);
    const roless = await createUserdto.role.map((role) => ({
      name: role,
    }));

    const roles = await this.roleRepository.find({ where: roless });
    if (!roles) {
      return 'This role is not Available';
    }
    const user = new User();
    user.email = updateData.email;
    user.name = updateData.name;
    user.password = updateData.password;
    user.roles = roles;
    return await this.usersRepository.save(user);
  }

  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const id = userId;
    const roless = await updateUserDto.role.map((role) => ({
      name: role,
    }));

    const roles = await this.roleRepository.find({ where: roless });
    if (!roles) {
      return 'This role is not Available';
    }
    if (updateUserDto.password !== updateUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    const { confirmPassword, role: roleIds, ...updateData } = updateUserDto;
    console.log(confirmPassword);
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.roles = await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(user)
      .loadMany();

    user.email = updateData.email;
    user.name = updateData.name;
    user.password = updateData.password;
    user.roles = roles;
    return await this.usersRepository.save(user);
  }

  async getUser(userId: number) {
    return await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async deleteUser(userId: number) {
    return await this.usersRepository.delete(userId);
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['roles', 'roles.permissions'],
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
