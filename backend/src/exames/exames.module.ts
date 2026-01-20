import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamesService } from './exames.service';
import { ExamesController } from './exames.controller';
import { Exame } from './entities/exame.entity';
import { PacientesModule } from '../pacientes/pacientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exame]),
    PacientesModule,
  ],
  controllers: [ExamesController],
  providers: [ExamesService],
})
export class ExamesModule {}
