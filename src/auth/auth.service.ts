import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(loginDto: LoginDto) {
    const user = await this.userService.create(loginDto);
    return user;
  }

  async login(loginDto: LoginDto) {
    const { login, password: enteredPassword } = loginDto;
    const user = await this.userService.findOneByLogin(login);

    const passwordMatches = await bcrypt.compare(
      enteredPassword,
      user.password,
    );
    if (!passwordMatches) {
      throw new ForbiddenException(`Sorry, password doesn't match`);
    }

    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
