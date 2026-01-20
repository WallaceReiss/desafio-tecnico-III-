import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto) {
    const jaExiste = await this.pacienteRepository.findOne({
      where: { documento: createPacienteDto.documento },
    });

    if (jaExiste) {
      throw new ConflictException('Documento já cadastrado');
    }

    const paciente = this.pacienteRepository.create(createPacienteDto);
    return await this.pacienteRepository.save(paciente);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, pageSize = 10 } = paginationDto;

    const [data, total] = await this.pacienteRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    return await this.pacienteRepository.findOne({
      where: { id },
      relations: ['exames'],
    });
  }
}
