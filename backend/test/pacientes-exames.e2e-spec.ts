import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Pacientes e Exames (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Pacientes', () => {
    it('POST /pacientes - deve criar um paciente', () => {
      return request(app.getHttpServer())
        .post('/pacientes')
        .send({
          nome: 'João Silva',
          documento: '12345678900',
          dataNascimento: '1990-01-15',
        })
        .expect(201);
    });

    it('POST /pacientes - não deve aceitar documento duplicado', async () => {
      const paciente = {
        nome: 'Maria Santos',
        documento: '98765432100',
        dataNascimento: '1985-05-20',
      };

      // primeiro cadastro
      await request(app.getHttpServer())
        .post('/pacientes')
        .send(paciente)
        .expect(201);

      // segundo cadastro com mesmo documento
      return request(app.getHttpServer())
        .post('/pacientes')
        .send(paciente)
        .expect(409);
    });

    it('GET /pacientes - deve listar com paginacao', () => {
      return request(app.getHttpServer())
        .get('/pacientes?page=1&pageSize=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
        });
    });
  });

  describe('Exames', () => {
    let pacienteId: string;

    beforeAll(async () => {
      // criar paciente para os testes de exame
      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send({
          nome: 'Paciente Teste',
          documento: '11111111111',
          dataNascimento: '1980-03-10',
        });
      pacienteId = response.body.id;
    });

    it('POST /exames - deve criar um exame', () => {
      return request(app.getHttpServer())
        .post('/exames')
        .send({
          pacienteId,
          modalidade: 'CT',
          descricao: 'Tomografia de abdomen',
          idempotencyKey: 'key-test-1',
        })
        .expect(201);
    });

    it('POST /exames - deve retornar mesmo exame com idempotencyKey duplicada', async () => {
      const exameData = {
        pacienteId,
        modalidade: 'MR',
        descricao: 'Ressonancia',
        idempotencyKey: 'key-test-2',
      };

      // primeira requisicao
      const res1 = await request(app.getHttpServer())
        .post('/exames')
        .send(exameData)
        .expect(201);

      // segunda requisicao com mesma idempotencyKey
      const res2 = await request(app.getHttpServer())
        .post('/exames')
        .send(exameData)
        .expect(201);

      expect(res1.body.id).toBe(res2.body.id);
    });

    it('POST /exames - não deve criar exame para paciente inexistente', () => {
      return request(app.getHttpServer())
        .post('/exames')
        .send({
          pacienteId: '00000000-0000-0000-0000-000000000000',
          modalidade: 'US',
          idempotencyKey: 'key-test-3',
        })
        .expect(400);
    });

    it('GET /exames - deve listar com paginacao', () => {
      return request(app.getHttpServer())
        .get('/exames?page=1&pageSize=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
        });
    });
  });
});
