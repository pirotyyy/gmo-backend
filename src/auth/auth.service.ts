import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(dto: LoginDto) {
    let user: User;

    try {
      user = await this.userService.getById(dto.userId);
    } catch (error) {
      throw new ForbiddenException('ユーザーIDまたはパスワードが異なります。');
    }

    const isValid = await bcrypt.compare(dto.password, user.hashedPassword);

    if (!isValid) {
      throw new ForbiddenException('ユーザーIDまたはパスワードが異なります。');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    if (user) {
      const payload = { sub: user.userId, name: user.name };
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token,
      };
    }
  }
}
