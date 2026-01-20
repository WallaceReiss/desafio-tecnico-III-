import { DataSource } from 'typeorm';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Exame } from '../exames/entities/exame.entity';
import { User } from '../auth/entities/user.entity';
import { ModalidadeDicom } from '../exames/enums/modalidade-dicom.enum';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'desafio_medico',
  entities: [Paciente, Exame, User],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  await AppDataSource.initialize();
  console.log('✅ Conectado ao banco');

  const pacienteRepo = AppDataSource.getRepository(Paciente);
  const exameRepo = AppDataSource.getRepository(Exame);
  const userRepo = AppDataSource.getRepository(User);

  // Limpar dados existentes
  await AppDataSource.query('TRUNCATE TABLE exames, pacientes, users RESTART IDENTITY CASCADE');
  console.log('🗑️  Dados antigos removidos');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = userRepo.create({
    email: 'admin@teste.com',
    password: hashedPassword,
    nome: 'Administrador',
  });
  await userRepo.save(user);
  console.log('✅ Usuário de teste criado (admin@teste.com / 123456)');


  // Criar pacientes com dados mais realistas
  const pacientes = [
    {
      nome: 'João Silva Santos',
      documento: '12345678901',
      dataNascimento: new Date('1985-03-15'),
    },
    {
      nome: 'Maria Oliveira Costa',
      documento: '98765432100',
      dataNascimento: new Date('1990-07-22'),
    },
    {
      nome: 'Pedro Almeida Souza',
      documento: '45678912345',
      dataNascimento: new Date('1978-11-30'),
    },
    {
      nome: 'Ana Paula Ferreira',
      documento: '78912345678',
      dataNascimento: new Date('1995-05-10'),
    },
    {
      nome: 'Carlos Eduardo Lima',
      documento: '32165498712',
      dataNascimento: new Date('1982-09-18'),
    },
    {
      nome: 'Juliana Mendes Rocha',
      documento: '15935745682',
      dataNascimento: new Date('1988-12-03'),
    },
    {
      nome: 'Roberto Carlos Souza',
      documento: '75395145682',
      dataNascimento: new Date('1970-04-18'),
    },
    {
      nome: 'Patricia Rodrigues Silva',
      documento: '95175385246',
      dataNascimento: new Date('1992-08-27'),
    },
  ];

  const pacientesCriados = await pacienteRepo.save(pacientes);
  console.log(`✅ ${pacientesCriados.length} pacientes criados`);

  // Criar exames com descrições mais detalhadas
  const exames = [
    // João Silva Santos - 4 exames
    {
      pacienteId: pacientesCriados[0].id,
      modalidade: ModalidadeDicom.CT,
      descricao: 'Tomografia computadorizada de tórax - investigação de nódulo pulmonar detectado em raio-x prévio',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[0].id,
      modalidade: ModalidadeDicom.MR,
      descricao: 'Ressonância magnética de crânio - avaliação de cefaleia persistente há 3 meses',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[0].id,
      modalidade: ModalidadeDicom.XA,
      descricao: 'Angiografia coronária - investigação de dor torácica aos esforços',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[0].id,
      modalidade: ModalidadeDicom.DX,
      descricao: 'Raio-X de tórax PA e perfil - controle pós-operatório de cirurgia torácica',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Maria Oliveira Costa - 3 exames
    {
      pacienteId: pacientesCriados[1].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ultrassonografia abdominal total - dor em hipocôndrio direito, suspeita de colelitíase',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[1].id,
      modalidade: ModalidadeDicom.MG,
      descricao: 'Mamografia bilateral digital - rastreamento anual, paciente sem queixas',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[1].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ultrassonografia obstétrica morfológica - 20 semanas de gestação',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Pedro Almeida Souza - 5 exames
    {
      pacienteId: pacientesCriados[2].id,
      modalidade: ModalidadeDicom.DX,
      descricao: 'Raio-X de coluna lombar AP e perfil - lombalgia crônica há 2 anos',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[2].id,
      modalidade: ModalidadeDicom.MR,
      descricao: 'Ressonância magnética de coluna lombar - investigação de hérnia de disco L4-L5',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[2].id,
      modalidade: ModalidadeDicom.CT,
      descricao: 'Tomografia de abdome e pelve com contraste - investigação de massa abdominal palpável',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[2].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ultrassonografia de próstata via abdominal - check-up preventivo, PSA elevado',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[2].id,
      modalidade: ModalidadeDicom.DX,
      descricao: 'Raio-X de joelho esquerdo - trauma esportivo, suspeita de lesão meniscal',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Ana Paula Ferreira - 2 exames
    {
      pacienteId: pacientesCriados[3].id,
      modalidade: ModalidadeDicom.MG,
      descricao: 'Mamografia bilateral digital - nódulo palpável em mama direita',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[3].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ultrassonografia de mamas - complementação da mamografia, caracterização de nódulo',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Carlos Eduardo Lima - 3 exames
    {
      pacienteId: pacientesCriados[4].id,
      modalidade: ModalidadeDicom.CR,
      descricao: 'Radiografia computadorizada de coluna cervical - cervicalgia pós acidente automobilístico',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[4].id,
      modalidade: ModalidadeDicom.CT,
      descricao: 'Tomografia de crânio sem contraste - investigação de tontura e desequilíbrio',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[4].id,
      modalidade: ModalidadeDicom.DX,
      descricao: 'Raio-X de tórax PA - rotina pré-operatória para colecistectomia',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Juliana Mendes Rocha - 2 exames
    {
      pacienteId: pacientesCriados[5].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ultrassonografia transvaginal - investigação de irregularidade menstrual',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[5].id,
      modalidade: ModalidadeDicom.MG,
      descricao: 'Mamografia digital bilateral - screening, histórico familiar de câncer de mama',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Roberto Carlos Souza - 4 exames
    {
      pacienteId: pacientesCriados[6].id,
      modalidade: ModalidadeDicom.CT,
      descricao: 'Tomografia de tórax de alta resolução - DPOC, avaliação de extensão da doença',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[6].id,
      modalidade: ModalidadeDicom.XA,
      descricao: 'Angiografia de membros inferiores - claudicação intermitente',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[6].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ecocardiograma transtorácico - avaliação de função cardíaca, paciente hipertenso',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    {
      pacienteId: pacientesCriados[6].id,
      modalidade: ModalidadeDicom.DX,
      descricao: 'Raio-X de tórax PA e perfil - controle trimestral de DPOC',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
    // Patricia Rodrigues Silva - 1 exame
    {
      pacienteId: pacientesCriados[7].id,
      modalidade: ModalidadeDicom.US,
      descricao: 'Ultrassonografia de abdome total - dor abdominal difusa há 1 semana',
      createdBy: 'Sistema',
      idempotencyKey: uuidv4(),
    },
  ];

  const examesCriados = await exameRepo.save(exames);
  console.log(`✅ ${examesCriados.length} exames criados`);

  await AppDataSource.destroy();
  console.log('🎉 Seed concluído com sucesso!');
}

seed().catch((error) => {
  console.error('❌ Erro ao executar seed:', error);
  process.exit(1);
});
