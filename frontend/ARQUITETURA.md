# Arquitetura Modular Frontend

## 📁 Estrutura de Pastas

```
frontend/src/app/
├── core/                    # Módulo Core (Singleton)
│   ├── layout/             # Layout principal da aplicação
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── index.ts            # Barrel export
│
├── features/               # Módulos de Features (Domínio)
│   ├── auth/              # Autenticação e Usuários
│   │   ├── components/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── pacientes/         # Gestão de Pacientes
│   │   ├── components/
│   │   ├── services/
│   │   └── index.ts
│   │
│   └── exames/            # Gestão de Exames
│       ├── components/
│       ├── services/
│       └── index.ts
│
├── shared/                 # Módulo Compartilhado
│   ├── components/        # Componentes reutilizáveis
│   ├── models/            # Interfaces e Types
│   ├── pipes/             # Pipes customizados
│   ├── directives/        # Diretivas customizadas
│   └── index.ts           # Barrel export
│
└── app.routes.ts          # Configuração de rotas
```

## 🎯 Princípios da Arquitetura

### **1. Core Module**
- **Propósito**: Serviços singleton, guards, interceptors
- **Regra**: Importado **apenas uma vez** no AppModule
- **Conteúdo**: Layout, autenticação global, configurações

### **2. Feature Modules**
- **Propósito**: Encapsular funcionalidades de domínio
- **Regra**: Cada feature é **independente e autossuficiente**
- **Benefícios**: 
  - Lazy loading (carregamento sob demanda)
  - Separação clara de responsabilidades
  - Fácil manutenção e testes

#### Features implementadas:
- **auth**: Login, usuários e controle de acesso
- **pacientes**: CRUD completo de pacientes  
- **exames**: CRUD completo de exames médicos

### **3. Shared Module**
- **Propósito**: Código reutilizável entre features
- **Regra**: **Sem dependências** de features específicas
- **Conteúdo**: Models, componentes genéricos, pipes, utils

## 📦 Barrel Exports (index.ts)

Cada módulo possui um arquivo `index.ts` que exporta seus recursos públicos:

```typescript
// features/pacientes/index.ts
export * from './components/pacientes-list/pacientes-list';
export * from './services/paciente.service';
```

**Benefícios:**
- ✅ Imports mais limpos: `from './features/pacientes'`
- ✅ Encapsulamento: controla o que é exposto
- ✅ Refatoração fácil: mudanças internas não afetam consumers

## 🔄 Fluxo de Dados

```
Components → Services → HTTP Client → Backend
     ↓
  Models (Shared)
```

## 🚀 Lazy Loading (Futuro)

Com essa estrutura, é fácil implementar lazy loading:

```typescript
const routes: Routes = [
  {
    path: 'pacientes',
    loadChildren: () => import('./features/pacientes').then(m => m.PacientesModule)
  }
];
```

## ✅ Vantagens desta Arquitetura

1. **Escalabilidade**: Fácil adicionar novas features
2. **Manutenibilidade**: Código organizado por domínio
3. **Testabilidade**: Módulos isolados facilitam testes
4. **Performance**: Possibilidade de lazy loading
5. **Reutilização**: Shared module centraliza código comum
6. **Colaboração**: Times podem trabalhar em features diferentes

## 📝 Convenções de Nomenclatura

- **Pastas**: kebab-case (`pacientes-list`)
- **Classes**: PascalCase (`PacientesList`)
- **Arquivos**: kebab-case com sufixo (`paciente.service.ts`)
- **Barrel exports**: sempre `index.ts`

## 🎓 Boas Práticas Implementadas

- ✅ Single Responsibility Principle (SRP)
- ✅ Don't Repeat Yourself (DRY)
- ✅ Separation of Concerns (SoC)
- ✅ Dependency Injection
- ✅ Standalone Components (Angular 15+)
- ✅ Reactive Programming (RxJS)
