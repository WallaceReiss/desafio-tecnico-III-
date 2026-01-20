import { IsNotEmpty, IsString, Length, IsDateString } from 'class-validator';

export class CreatePacienteDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nome: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 14) // CPF com ou sem formatacao
  documento: string;

  @IsNotEmpty()
  @IsDateString()
  dataNascimento: string;
}
