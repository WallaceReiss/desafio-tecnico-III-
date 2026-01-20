import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../services/confirm.service';
import { ToastService } from '../../services/toast.service';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  loginAt: Date;
}

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-list.html',
  styleUrls: ['./usuarios-list.scss']
})
export class UsuariosList implements OnInit {
  usuarios: Usuario[] = [];
  loading: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private confirm: ConfirmService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading = true;
    
    // Carregar usuários do localStorage
    const usuariosStr = localStorage.getItem('usuarios');
    if (usuariosStr) {
      this.usuarios = JSON.parse(usuariosStr);
      // Ordenar por login mais recente
      this.usuarios.sort((a, b) => new Date(b.loginAt).getTime() - new Date(a.loginAt).getTime());
    }
    
    this.loading = false;
    this.cdr.detectChanges();
  }

  async removerUsuario(id: string) {
    const confirmado = await this.confirm.confirmar('Deseja remover este usuário da lista?');
    if (confirmado) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      this.toast.sucesso('Usuário removido da lista!');
      this.cdr.detectChanges();
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }
}
