import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExameService } from '../../services/exame.service';
import { PacienteService } from '../../services/paciente.service';
import { Paciente, ModalidadeDicom } from '../../models/paciente.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-exames-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exames-form.html',
  styleUrl: './exames-form.scss',
})
export class ExamesForm implements OnInit {
  @Output() exameSalvo = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  pacientes: Paciente[] = [];
  
  modalidades = [
    { value: 'CR', label: 'Computed Radiography' },
    { value: 'CT', label: 'Computed Tomography' },
    { value: 'DX', label: 'Digital Radiography' },
    { value: 'MG', label: 'Mammography' },
    { value: 'MR', label: 'Magnetic Resonance' },
    { value: 'NM', label: 'Nuclear Medicine' },
    { value: 'OT', label: 'Other' },
    { value: 'PT', label: 'Positron Emission Tomography' },
    { value: 'RF', label: 'Radio Fluoroscopy' },
    { value: 'US', label: 'Ultrasound' },
    { value: 'XA', label: 'X-Ray Angiography' },
  ];

  constructor(
    private fb: FormBuilder,
    private exameService: ExameService,
    private pacienteService: PacienteService
  ) {
    this.form = this.fb.group({
      pacienteId: ['', Validators.required],
      modalidade: ['', Validators.required],
      descricao: ['']
    });
  }

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.pacienteService.buscarTodos(1, 100).subscribe({
      next: (response) => {
        this.pacientes = response.data;
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const exameData = {
        ...this.form.value,
        idempotencyKey: uuidv4() // gera uma chave unica
      };

      this.exameService.criar(exameData).subscribe({
        next: () => {
          this.successMessage = 'Exame cadastrado com sucesso!';
          this.loading = false;
          this.form.reset();
          setTimeout(() => this.exameSalvo.emit(), 1500);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 400) {
            this.errorMessage = 'Paciente não encontrado.';
          } else {
            this.errorMessage = 'Erro ao cadastrar exame. Tente novamente.';
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
