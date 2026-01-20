# 🚀 Setup do Projeto - Desafio Técnico

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm ou yarn

---

## 📦 Instalação

### 1. Subir o Banco de Dados (PostgreSQL)

**Opção A: Com Docker (Recomendado)**

```bash
# 1. Inicie o Docker Desktop
# 2. Na raiz do projeto:
docker-compose up -d

# 3. Aguarde o container estar saudável:
docker-compose ps
```

**Opção B: PostgreSQL Local (sem Docker)**

1. Instale PostgreSQL: https://www.postgresql.org/download/
2. Crie o banco de dados:
```bash
# No psql ou pgAdmin:
CREATE DATABASE desafio_medico;
```
3. Atualize o `.env` se necessário com suas credenciais

### 2. Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 3. Configurar Variáveis de Ambiente

O arquivo `.env` já está criado com as configurações padrão:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=desafio_medico
PORT=3000
NODE_ENV=development
```

### 4. Popular o Banco de Dados (Opcional)

```bash
cd backend
npm run seed
```

Isso criará:
- 5 pacientes de exemplo
- 7 exames vinculados aos pacientes

**Nota:** O TypeORM criará as tabelas automaticamente no primeiro start (modo desenvolvimento).

---

## ▶️ Executar o Backend

```bash
cd backend

# Modo desenvolvimento (com hot-reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod

# Popular banco com dados de exemplo
npm run seed
```

API disponível em: **http://localhost:3000**

---

## 🧪 Executar Testes

```bash
cd backend

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 🗄️ Comandos Úteis do Docker

```bash
# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Resetar banco de dados (CUIDADO: apaga todos os dados)
docker-compose down -v
docker-compose up -d

# Acessar psql
docker exec -it desafio-medico-db psql -U postgres -d desafio_medico
```

---

## 📋 Endpoints Disponíveis

- `POST /pacientes` - Criar paciente
- `GET /pacientes?page=1&pageSize=10` - Listar pacientes
- `POST /exames` - Criar exame (com idempotência)
- `GET /exames?page=1&pageSize=10` - Listar exames

---

## 🛠️ Troubleshooting

**Erro: "Connection refused" ao conectar no PostgreSQL**
- Verifique se o Docker está rodando: `docker ps`
- Reinicie o container: `docker-compose restart postgres`

**Porta 5432 já em uso**
- Mude a porta no `docker-compose.yml`: `"5433:5432"`
- Atualize o `.env`: `DB_PORT=5433`

---

## 📁 Estrutura do Projeto

```
desafio-tecnico-III-/
├── backend/          # API NestJS
├── frontend/         # App Angular
├── docker-compose.yml
└── README_SETUP.md
```

---

## 🎯 Fluxo Completo de Setup

```bash
# 1. Subir PostgreSQL
docker-compose up -d

# 2. Backend
cd backend
npm install
npm run seed          # Popular dados de exemplo
npm run start:dev     # Iniciar servidor (porta 3000)

# 3. Frontend (em outro terminal)
cd frontend
npm install
npm start             # Iniciar aplicação (porta 4200)

# 4. Acessar
# Frontend: http://localhost:4200
# API: http://localhost:3000
```
