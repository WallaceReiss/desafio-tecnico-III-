import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Pacientes e Exames (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

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

  describe('Autenticação', () => {
    const userTest = {
      nome: 'Usuario Teste',
      email: `teste${Date.now()}@exemplo.com`,
      password: 'senha123',
    };

    it('Cenário 1: Registrar usuário com dados válidos', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userTest)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe(userTest.email);
          expect(res.body.user.nome).toBe(userTest.nome);
        });
    });

    it('Cenário 2: Fazer login com credenciais válidas', async () => {
      const loginData = {
        email: userTest.email,
        password: userTest.password,
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('user');
      authToken = res.body.access_token;
    });

    it('Cenário 3: Fazer login com credenciais inválidas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userTest.email,
          password: 'senhaErrada',
        })
        .expect(401);
    });

    it('Cenário 4: Acessar rota protegida sem token', () => {
      return request(app.getHttpServer())
        .get('/pacientes')
        .expect(401);
    });

    it('Cenário 5: Acessar rota protegida com token válido', () => {
      return request(app.getHttpServer())
        .get('/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Pacientes', () => {
    it('Cenário 6: Criar paciente com dados válidos', () => {
      return request(app.getHttpServer())
        .post('/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'João Silva',
          documento: '12345678900',
          dataNascimento: '1990-01-15',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nome).toBe('João Silva');
        });
    });

    it('Cenário 7: Criar paciente com CPF já existente', async () => {
      const paciente = {
        nome: 'Maria Santos',
        documento: '98765432100',
        dataNascimento: '1985-05-20',
      };

      await request(app.getHttpServer())
        .post('/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paciente)
        .expect(201);

      return request(app.getHttpServer())
        .post('/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paciente)
        .expect(409);
    });

    it('Cenário 13: Listar pacientes com paginação', () => {
      return request(app.getHttpServer())
        .get('/pacientes?page=1&pageSize=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('pageSize');
          expect(res.body).toHaveProperty('totalPages');
        });
    });
  });

  describe('Exames', () => {
    let pacienteId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Paciente Teste Exames',
          documento: '11111111111',
          dataNascimento: '1980-03-10',
        });
      pacienteId = response.body.id;
    });

    it('Cenário 8: Criar exame com paciente existente e idempotencyKey nova', () => {
      return request(app.getHttpServer())
        .post('/exames')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          pacienteId,
          modalidade: 'CT',
          descricao: 'Tomografia de abdomen',
          idempotencyKey: `key-test-${Date.now()}`,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.modalidade).toBe('CT');
        });
    });

    it('Cenário 9: Reenviar exame com mesma idempotencyKey', async () => {
      const exameData = {
        pacienteId,
        modalidade: 'MR',
        descricao: 'Ressonancia',
        idempotencyKey: `key-test-idem-${Date.now()}`,
      };

      const res1 = await request(app.getHttpServer())
        .post('/exames')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exameData)
        .expect(201);

      const res2 = await request(app.getHttpServer())
        .post('/exames')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exameData)
        .expect(201);

      expect(res1.body.id).toBe(res2.body.id);
    });

    it('Cenário 10: Enviar múltiplas requisições simultâneas com mesma idempotencyKey', async () => {
      const exameData = {
        pacienteId,
        modalidade: 'US',
        descricao: 'Ultrassom',
        idempotencyKey: `key-test-simult-${Date.now()}`,
      };

      const promises = Array(5).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/exames')
          .set('Authorization', `Bearer ${authToken}`)
          .send(exameData)
      );

      const results = await Promise.all(promises);
      
      const ids = results.map(r => r.body.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(1);
      results.forEach(r => expect(r.status).toBe(201));
    });

    it('Cenário 11: Criar exame com paciente inexistente', () => {
      return request(app.getHttpServer())
        .post('/exames')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          pacienteId: '00000000-0000-0000-0000-000000000000',
          modalidade: 'US',
          idempotencyKey: `key-test-invalid-${Date.now()}`,
        })
        .expect(400);
    });

    it('Cenário 16: Enviar exame com modalidade inválida', () => {
      return request(app.getHttpServer())
        .post('/exames')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          pacienteId,
          modalidade: 'INVALIDA',
          descricao: 'Teste',
          idempotencyKey: `key-test-mod-${Date.now()}`,
        })
        .expect(400);
    });

    it('Cenário 12: Listar exames com paginação (10 por página)', () => {
      return request(app.getHttpServer())
        .get('/exames?page=1&pageSize=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('pageSize');
          expect(res.body.pageSize).toBe(10);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });
});
