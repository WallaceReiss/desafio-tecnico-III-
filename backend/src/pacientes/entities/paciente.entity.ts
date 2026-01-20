import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exame } from '../../exames/entities/exame.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true, length: 14 })
  documento: string; // CPF

  @Column({ type: 'date' })
  dataNascimento: Date;

  @OneToMany(() => Exame, (exame) => exame.paciente)
  exames: Exame[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
