import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateExameDto } from './dto/create-exame.dto';
import { Exame } from './entities/exame.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PacientesService } from '../pacientes/pacientes.service';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private exameRepository: Repository<Exame>,
    private pacientesService: PacientesService,
    private dataSource: DataSource,
  ) {}

  async create(createExameDto: CreateExameDto) {
    const jaExiste = await this.exameRepository.findOne({
      where: { idempotencyKey: createExameDto.idempotencyKey },
    });

    if (jaExiste) {
      return jaExiste;
    }

    const descricaoNormalizada = createExameDto.descricao?.trim().toLowerCase() || '';

    const trintaMinutosAtras = new Date();
    trintaMinutosAtras.setMinutes(trintaMinutosAtras.getMinutes() - 30);

    const exameDuplicado = await this.exameRepository
      .createQueryBuilder('exame')
      .where('exame.pacienteId = :pacienteId', { pacienteId: createExameDto.pacienteId })
      .andWhere('exame.modalidade = :modalidade', { modalidade: createExameDto.modalidade })
      .andWhere('LOWER(TRIM(exame.descricao)) = :descricao', { descricao: descricaoNormalizada })
      .andWhere('exame.createdAt >= :dataLimite', { dataLimite: trintaMinutosAtras })
      .getOne();

    if (exameDuplicado) {
      throw new ConflictException(
        'Já existe um exame igual nos últimos 30 minutos',
      );
    }

    const paciente = await this.pacientesService.findOne(createExameDto.pacienteId);
    if (!paciente) {
      throw new BadRequestException('Paciente não encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exame = this.exameRepository.create(createExameDto);
      const resultado = await queryRunner.manager.save(exame);
      
      await queryRunner.commitTransaction();
      return resultado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error.code === '23505') {
        const exameJaSalvo = await this.exameRepository.findOne({
          where: { idempotencyKey: createExameDto.idempotencyKey },
        });
        return exameJaSalvo;
      }
      
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, pageSize = 10 } = paginationDto;

    const [data, total] = await this.exameRepository.findAndCount({
      relations: ['paciente'],
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
    return await this.exameRepository.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  async remove(id: string) {
    const exame = await this.exameRepository.findOne({ where: { id } });
    if (!exame) {
      throw new NotFoundException('Exame não encontrado');
    }
    await this.exameRepository.remove(exame);
  }
}
