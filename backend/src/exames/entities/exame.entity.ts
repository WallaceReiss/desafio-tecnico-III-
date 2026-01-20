import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { ModalidadeDicom } from '../enums/modalidade-dicom.enum';

@Entity('exames')
@Index(['idempotencyKey'], { unique: true })
export class Exame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  pacienteId: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.exames)
  @JoinColumn({ name: 'pacienteId' })
  paciente: Paciente;

  @Column({
    type: 'enum',
    enum: ModalidadeDicom,
  })
  modalidade: ModalidadeDicom;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  // chave para garantir idempotencia
  @Column({ unique: true, length: 255 })
  idempotencyKey: string;

  @CreateDateColumn()
  createdAt: Date;
}
