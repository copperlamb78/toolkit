import { UserRepository } from './users.repository';
import { Users } from './users.schema';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<Partial<Users>> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }
    const existingUser = await this.userRepository
      .findAll()
      .then((users) => users.find((user) => user.email === data.email));

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = data;
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      confirmPassword: '',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    return result;
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async updateUser(id: string, data: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException('ID do usuário não informado');
    }

    const existingUsers = this.findAll().then((users) => {
      return users.find((users) => users.id === id);
    });

    if (!existingUsers) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.userRepository.updateUser(id, data);
  }
}
