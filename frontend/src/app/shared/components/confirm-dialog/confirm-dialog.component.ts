import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService, ConfirmDialog } from '../../../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dialog) {
      <div class="modal-overlay" (click)="cancelar()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h5>{{ dialog.titulo || 'Confirmação' }}</h5>
          </div>
          <div class="modal-body">
            <p>{{ dialog.mensagem }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancelar()">
              Cancelar
            </button>
            <button class="btn btn-danger" (click)="confirmar()">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-dialog {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #dee2e6;
    }

    .modal-header h5 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .modal-body {
      padding: 24px 20px;
    }

    .modal-body p {
      margin: 0;
      color: #555;
      line-height: 1.5;
    }

    .modal-footer {
      padding: 16px 20px;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 8px 20px;
      border-radius: 6px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }
  `]
})
export class ConfirmDialogComponent {
  dialog: ConfirmDialog | null = null;

  constructor(private confirmService: ConfirmService) {
    this.confirmService.dialog$.subscribe((dialog: ConfirmDialog | null) => {
      this.dialog = dialog;
    });
  }

  confirmar() {
    if (this.dialog) {
      this.dialog.callback(true);
    }
  }

  cancelar() {
    if (this.dialog) {
      this.dialog.callback(false);
    }
  }
}
