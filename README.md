📝 **Task: Cadastro de Pacientes e Exames Médicos com Modalidades DICOM**

🎯 **Descrição**

Como usuário da plataforma médica,  
Quero registrar e consultar pacientes e seus exames de forma segura, consistente e com boa experiência de navegação,  
Para que eu tenha controle sobre o histórico clínico mesmo em situações de reenvio de requisição ou acessos simultâneos.

⸻

🔧 **Escopo da Task**

- Implementar endpoints REST para cadastro e consulta de pacientes e exames.
- Garantir idempotência no cadastro de exames.
- Criar estrutura segura para suportar requisições concorrentes.
- Implementar paginação para consultas.
- Integrar com front-end Angular.
- Criar componentes Angular para cadastro e listagem de pacientes e exames.
- Utilizar práticas RESTful, transações ACID e código modular.

⸻

✅ **Regras de Validações**

- O `documento` do paciente deve ser único.
- A `idempotencyKey` do exame deve garantir que requisições duplicadas não criem múltiplos registros.
- Não é permitido cadastrar exame para paciente inexistente.
- Campos obrigatórios devem ser validados (nome, data de nascimento, modalidade, etc).

⸻

📦 **Saída Esperada**

- Endpoints criados:
  - `POST /auth/register` - Registro de novos usuários
  - `POST /auth/login` - Autenticação com JWT
  - `POST /pacientes`
  - `GET /pacientes?page=x&pageSize=y`
  - `POST /exames`
  - `GET /exames?page=x&pageSize=y`
- Dados persistidos de forma segura e idempotente.
- Sistema de autenticação JWT com bcrypt.
- Front-end com:
  - Login com autenticação JWT.
  - Rotas protegidas com AuthGuard.
  - Listagem paginada de pacientes e exames.
  - Cadastro funcional via formulários.
  - UI amigável com mensagens de erro e loading.

⸻

🔥 **Critérios de Aceite**

- **Dado** que um paciente válido foi cadastrado,  
  **Quando** for enviado um novo exame com `idempotencyKey` única,  
  **Então** o exame deverá ser criado com sucesso.

- **Dado** que um exame com `idempotencyKey` já existe,  
  **Quando** for enviada uma nova requisição com os mesmos dados,  
  **Então** o sistema deverá retornar HTTP 200 com o mesmo exame, sem recriá-lo.

- **Dado** que múltiplas requisições simultâneas com mesma `idempotencyKey` são feitas,  
  **Quando** processadas,  
  **Então** apenas um exame deverá ser persistido.

- **Dado** que o front-end está carregando dados,  
  **Quando** houver erro de rede,  
  **Então** deve ser exibida mensagem de erro com botão "Tentar novamente".

⸻

👥 **Dependências**

- Banco de dados com suporte a transações (PostgreSQL, MySQL ou similar).
- Integração REST entre backend (Node.js/NestJS ou similar) e frontend (Angular).
- Validação de campos no front-end e back-end.
- Definição do enum de modalidades DICOM:
  - `CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA`
- Sistema de autenticação JWT com bcrypt para hash de senhas.

⸻

🔐 **Autenticação e Segurança**

**Sistema implementado:**
- Autenticação baseada em JWT (JSON Web Tokens)
- Hash de senhas com bcrypt (10 rounds)
- Tokens com validade de 7 dias
- Rotas protegidas no frontend com AuthGuard
- HTTP Interceptor para injeção automática do token

**Credenciais de Teste:**
- Email: `admin@teste.com`
- Senha: `123456`

**Endpoints de Autenticação:**
- `POST /auth/register` - Registro de novos usuários
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "nome": "Nome do Usuário"
  }
  ```
  
- `POST /auth/login` - Login e obtenção do token JWT
  ```json
  {
    "email": "admin@teste.com",
    "password": "123456"
  }
  ```
  
**Resposta de Login:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "admin@teste.com",
    "nome": "Administrador"
  }
}
```

**Usando o Token:**
- O token deve ser enviado no header `Authorization: Bearer {token}`
- No frontend, o token é armazenado no localStorage
- O HTTP Interceptor adiciona automaticamente o token em todas as requisições
- Rotas protegidas redirecionam para `/login` se não houver token válido

⸻

🧪 **Cenários de Teste**

| Cenário | Descrição | Resultado Esperado |
|--------|-----------|--------------------|
| 1 | Registrar usuário com dados válidos | Usuário criado com JWT retornado |
| 2 | Fazer login com credenciais válidas | JWT token e dados do usuário retornados |
| 3 | Fazer login com credenciais inválidas | Erro 401 - credenciais inválidas |
| 4 | Acessar rota protegida sem token | Redirecionamento para /login |
| 5 | Acessar rota protegida com token válido | Acesso permitido |
| 6 | Criar paciente com dados válidos | Paciente salvo com UUID único |
| 7 | Criar paciente com CPF já existente | Erro de validação 409 - duplicidade |
| 8 | Criar exame com paciente existente e idempotencyKey nova | HTTP 201 e exame salvo |
| 9 | Reenviar exame com mesma idempotencyKey | HTTP 200 e retorno do mesmo exame |
| 10 | Enviar múltiplas requisições simultâneas com mesma idempotencyKey | Apenas um exame persistido |
| 11 | Criar exame com paciente inexistente | Erro 400 - paciente não encontrado |
| 12 | Listar exames com paginação (10 por página) | Retorno paginado corretamente |
| 13 | Listar pacientes com paginação | Lista retornada corretamente |
| 14 | Frontend mostra loading durante chamada | Spinner visível enquanto carrega |
| 15 | Frontend exibe erro de rede e botão "Tentar novamente" | Mensagem visível e reenvio possível |
| 11 | Enviar exame com modalidade inválida | Erro 400 - enum inválido |
| 12 | Validação visual dos campos obrigatórios no formulário | Campos com feedback de erro |
| 13 | Cobertura mínima de 80% nos testes unitários e integração | Relatório de cobertura válido |

⸻

🧪 **Testes de Integração (Requisito Obrigatório)**

- Devem ser implementados utilizando ferramentas como:
  - `Supertest` ou `jest` com `NestJS TestingModule` (backend)
  - `TestBed`, `HttpClientTestingModule` (frontend Angular)
- Devem cobrir pelo menos:
  - Fluxo de criação completo (Paciente → Exame)
  - Validações de regra de negócio
  - Idempotência em requisições simultâneas
  - Respostas corretas de erro
  - Listagem paginada
