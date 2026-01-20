import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent, ConfirmDialogComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout {
  userName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {
    const user = this.authService.currentUser;
    this.userName = user?.nome || 'Usuário';
  }

  async logout() {
    const confirmado = await this.confirm.confirmar('Deseja realmente sair?');
    if (confirmado) {
      this.authService.logout();
    }
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
