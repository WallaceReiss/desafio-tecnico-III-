import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { PacientesList } from './components/pacientes-list/pacientes-list';
import { PacienteDetalhes } from './components/paciente-detalhes/paciente-detalhes';
import { ExamesList } from './components/exames-list/exames-list';
import { UsuariosList } from './components/usuarios-list/usuarios-list';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { 
    path: '', 
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
      { path: 'pacientes', component: PacientesList },
      { path: 'pacientes/:id', component: PacienteDetalhes },
      { path: 'exames', component: ExamesList },
      { path: 'usuarios', component: UsuariosList },
    ]
  },
];
