import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialog {
  titulo?: string;
  mensagem: string;
  callback: (confirmado: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private dialogSubject = new Subject<ConfirmDialog | null>();
  public dialog$ = this.dialogSubject.asObservable();

  confirmar(mensagem: string, titulo?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogSubject.next({
        titulo,
        mensagem,
        callback: (confirmado) => {
          resolve(confirmado);
          this.dialogSubject.next(null);
        }
      });
    });
  }

  fechar() {
    this.dialogSubject.next(null);
  }
}
