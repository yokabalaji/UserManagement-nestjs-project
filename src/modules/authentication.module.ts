import { Module } from '@nestjs/common';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { jwtConstants } from 'src/config/constants/jwtConstants';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/stratigies/jwt.strategies';
import { RtStrategy } from 'src/stratigies/refreshToken-strategies';
import { EmailModule } from 'src/modules/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    EmailModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, RtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
