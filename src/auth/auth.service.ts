import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  signup(createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    return 'This is signup';
  }

  login(createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    return 'This is login';
  }
}
