import { IsNotEmpty, IsUUID, IsEnum, IsString, IsOptional } from 'class-validator';
import { ModalidadeDicom } from '../enums/modalidade-dicom.enum';

export class CreateExameDto {
  @IsNotEmpty()
  @IsUUID()
  pacienteId: string;

  @IsNotEmpty()
  @IsEnum(ModalidadeDicom)
  modalidade: ModalidadeDicom;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsNotEmpty()
  @IsString()
  idempotencyKey: string;
}
