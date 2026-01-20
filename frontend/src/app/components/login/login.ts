import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email: string = '';
  senha: string = '';
  loading: boolean = false;
  error: string = '';
  returnUrl: string = '/pacientes';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pacientes';
  }

  login() {
    if (!this.email || !this.senha) {
      this.error = 'Preencha email e senha';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      }
    });
  }
}
