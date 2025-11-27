import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../database/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
      registerDto.displayName,
    );

    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.usersService.findById(userId);
  }

  private generateAuthResponse(user: UserDocument): AuthResponse {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
      },
    };
  }
}
