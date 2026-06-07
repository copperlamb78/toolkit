import { UserRepository } from './users.repository';
import { Users } from './users.schema';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { cloudinaryHelper } from 'src/providers/cloudinary/cloudinary.helper';
import { WorkAreasService } from '../workAreas/workAreas.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private readonly cloudinaryHelper: cloudinaryHelper,
    private readonly workAreasService: WorkAreasService,
  ) {}

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

  async updateUser(id: string, data: UpdateUserDto, file: any) {
    if (!id) {
      throw new BadRequestException('ID do usuário não informado');
    }
    let avatar: any;
    if (file) {
      avatar = await this.cloudinaryHelper.uploadFiles(
        [file].map((file) => {
          return {
            buffer: file.buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
          };
        }),
        'users',
      );
    }

    const existingUsers = await this.userRepository
      .findAll()
      .then((users) => users.find((u) => u.id === id));

    if (!existingUsers) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.userRepository.updateUser(id, {
      ...data,
      avatar: avatar[0].url,
    });
  }
}
