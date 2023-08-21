import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  refreshOptions;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.refreshOptions = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    };
  }

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
    // const refreshOptions: JwtModuleOptions = {
    //   secret: process.env.JWT_SECRET_REFRESH_KEY,
    //   signOptions: { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME },
    // };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(
        payload,
        this.refreshOptions,
      ),
    };
  }

  async refresh(refreshDto: RefreshDto) {
    console.log(refreshDto);

    if (!refreshDto.hasOwnProperty('refreshToken')) {
      throw new UnauthorizedException(
        'Sorry, body must contain refreshToken property',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        refreshDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );

      const userId = payload.sub;
      const login = payload.username;

      const updatedPayload = { sub: userId, username: login };

      return {
        accessToken: await this.jwtService.signAsync(updatedPayload),
        refreshToken: await this.jwtService.signAsync(updatedPayload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(`Refresh token is invalid or expired`);
    }
  }
}
