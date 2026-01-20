import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div 
          class="toast show" 
          [class.toast-success]="toast.tipo === 'success'"
          [class.toast-error]="toast.tipo === 'error'"
          [class.toast-warning]="toast.tipo === 'warning'"
          [class.toast-info]="toast.tipo === 'info'"
          role="alert">
          <div class="toast-header">
            <strong class="me-auto">
              @if (toast.tipo === 'success') { ✓ Sucesso }
              @if (toast.tipo === 'error') { ✕ Erro }
              @if (toast.tipo === 'warning') { ⚠ Atenção }
              @if (toast.tipo === 'info') { ℹ Info }
            </strong>
            <button type="button" class="btn-close" (click)="fechar(toast.id)"></button>
          </div>
          <div class="toast-body">
            {{ toast.mensagem }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #28a745;
      background-color: #d4edda;
    }

    .toast-success .toast-header {
      background-color: #c3e6cb;
      color: #155724;
    }

    .toast-error {
      border-left-color: #dc3545;
      background-color: #f8d7da;
    }

    .toast-error .toast-header {
      background-color: #f5c6cb;
      color: #721c24;
    }

    .toast-warning {
      border-left-color: #ffc107;
      background-color: #fff3cd;
    }

    .toast-warning .toast-header {
      background-color: #ffeaa7;
      color: #856404;
    }

    .toast-info {
      border-left-color: #17a2b8;
      background-color: #d1ecf1;
    }

    .toast-info .toast-header {
      background-color: #bee5eb;
      color: #0c5460;
    }

    .toast-header {
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .btn-close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.5;
    }

    .btn-close:hover {
      opacity: 1;
    }
  `]
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });
  }

  fechar(id: number) {
    this.toastService.remover(id);
  }
}
