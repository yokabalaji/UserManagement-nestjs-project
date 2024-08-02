import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { jwtConstants } from 'src/config/constants/jwtConstants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/services/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto) {
    const checkUser = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!checkUser) {
      throw new UnauthorizedException();
    } else {
      if (
        checkUser &&
        (await bcrypt.compare(loginDto.password, (await checkUser).password))
      ) {
        const payload = {
          username: (await checkUser).email,
          sub: (await checkUser).id,
        };

        const access_token = this.jwtService.sign(payload);
        const referenceToken = this.jwtService.sign(payload, {
          secret: jwtConstants.referSec,
          expiresIn: '7d',
        });
        await this.usersRepository.update(payload.sub, {
          rToken: referenceToken,
        });
        return {
          access_token,
          referenceToken,
        };
      } else {
        return 'password is incorrect';
      }
    }
  }

  async refreshToken(userId: number, rt: string) {
    console.log('user id    ' + userId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('access denied');
    if (user.rToken === rt) {
      const payload = { username: user.email, sub: user.id };

      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } else {
      throw new ForbiddenException('access denies');
    }
  }

  async sendResetLink(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = crypto.randomBytes(4).toString('hex');
    user.resetToken = token;
    user.tokenExpiry = new Date(Date.now() + 60 * 1 * 1000); // Token expires in 1 hour

    await this.usersRepository.save(user);

    const resetLink = `http://localhost:3000/authentication/reset-password?token=${token}`;

    await this.emailService.sendMail(
      user.email,
      'Reset Password',
      `Click here to reset your password: ${resetLink}`,
    );

    return 'password reset link is send your email please check your email ';
  }

  async validateToken(token: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { resetToken: token },
    });
    if (!user || user.tokenExpiry < new Date()) {
      throw new NotFoundException('Invalid or expired token');
    }
    return user;
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.validateToken(token);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.tokenExpiry = null;

    await this.usersRepository.save(user);

    return 'your password is reseted';
  }
}
