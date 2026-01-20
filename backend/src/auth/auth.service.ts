import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nome } = registerDto;

    const usuarioExiste = await this.userRepository.findOne({ where: { email } });
    if (usuarioExiste) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: senhaHash,
      nome,
    });

    await this.userRepository.save(user);
    return this.gerarToken(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.gerarToken(user);
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }

  private gerarToken(user: User) {
    const payload = { sub: user.id, email: user.email, nome: user.nome };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
      },
    };
  }
}
