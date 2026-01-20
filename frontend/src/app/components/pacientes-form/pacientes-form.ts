import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-pacientes-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pacientes-form.html',
  styleUrl: './pacientes-form.scss',
})
export class PacientesForm {
  @Output() pacienteSalvo = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      documento: ['', [Validators.required, Validators.minLength(11)]],
      dataNascimento: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      // limpar formatacao do CPF
      const formValue = {
        ...this.form.value,
        documento: this.form.value.documento.replace(/\D/g, '')
      };

      this.pacienteService.criar(formValue).subscribe({
        next: () => {
          this.successMessage = 'Paciente cadastrado com sucesso!';
          this.loading = false;
          this.form.reset();
          setTimeout(() => this.pacienteSalvo.emit(), 1500);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 409) {
            this.errorMessage = 'CPF já cadastrado no sistema.';
          } else {
            this.errorMessage = 'Erro ao cadastrar paciente. Tente novamente.';
          }
        }
      });
    }
  }

  onCancel() {
    this.form.reset();
    this.cancelar.emit();
  }
}
