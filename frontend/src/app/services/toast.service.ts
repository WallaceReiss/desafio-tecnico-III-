import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  duracao?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private contadorId = 0;

  mostrar(mensagem: string, tipo: 'success' | 'error' | 'warning' | 'info' = 'info', duracao: number = 4000) {
    const toast: Toast = {
      id: this.contadorId++,
      mensagem,
      tipo,
      duracao
    };

    const toastsAtuais = this.toastsSubject.value;
    this.toastsSubject.next([...toastsAtuais, toast]);

    if (duracao > 0) {
      setTimeout(() => this.remover(toast.id), duracao);
    }
  }

  sucesso(mensagem: string, duracao?: number) {
    this.mostrar(mensagem, 'success', duracao);
  }

  erro(mensagem: string, duracao?: number) {
    this.mostrar(mensagem, 'error', duracao);
  }

  aviso(mensagem: string, duracao?: number) {
    this.mostrar(mensagem, 'warning', duracao);
  }

  info(mensagem: string, duracao?: number) {
    this.mostrar(mensagem, 'info', duracao);
  }

  remover(id: number) {
    const toastsAtuais = this.toastsSubject.value;
    this.toastsSubject.next(toastsAtuais.filter(t => t.id !== id));
  }

  limparTodos() {
    this.toastsSubject.next([]);
  }
}
