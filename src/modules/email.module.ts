import { Module } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
