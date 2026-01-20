export interface Paciente {
  id?: string;
  nome: string;
  documento: string;
  dataNascimento: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Exame {
  id?: string;
  pacienteId: string;
  modalidade: ModalidadeDicom;
  descricao?: string;
  idempotencyKey: string;
  createdBy?: string;
  createdAt?: Date;
  paciente?: Paciente;
}

export enum ModalidadeDicom {
  CR = 'CR',
  CT = 'CT',
  DX = 'DX',
  MG = 'MG',
  MR = 'MR',
  NM = 'NM',
  OT = 'OT',
  PT = 'PT',
  RF = 'RF',
  US = 'US',
  XA = 'XA',
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
