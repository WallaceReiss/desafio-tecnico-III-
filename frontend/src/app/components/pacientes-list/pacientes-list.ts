import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';
import { PacientesForm } from '../pacientes-form/pacientes-form';

@Component({
  selector: 'app-pacientes-list',
  imports: [CommonModule, FormsModule, PacientesForm],
  templateUrl: './pacientes-list.html',
  styleUrl: './pacientes-list.scss',
})
export class PacientesList implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  
  filtroNome = '';
  filtroCpf = '';
  
  currentPage = 1;
  pageSize = 10;
  totalPacientes = 0;
  totalPages = 0;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('PacientesList: Componente inicializado');
    this.loadPacientes();
  }

  verDetalhes(id: string) {
    console.log('Navegando para detalhes do paciente:', id);
    this.router.navigate(['/pacientes', id]);
  }

  loadPacientes() {
    console.log('Carregando pacientes...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.pacienteService.buscarTodos(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Pacientes carregados:', response);
        this.pacientes = response.data || [];
        this.pacientesFiltrados = [...this.pacientes];
        this.totalPacientes = response.total || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading finalizado:', this.loading);
      },
      error: (err) => {
        console.error('Erro ao carregar pacientes:', err);
        this.error = 'Erro ao carregar pacientes. Tente novamente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPacienteSalvo() {
    this.showForm = false;
    this.loadPacientes();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPacientes();
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatarDocumento(doc: string): string {
    // formata CPF: 123.456.789-00
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  aplicarFiltros() {
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      const nomeMatch = paciente.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      const cpfMatch = paciente.documento.includes(this.filtroCpf.replace(/\D/g, ''));
      return nomeMatch && cpfMatch;
    });
  }

  limparFiltros() {
    this.filtroNome = '';
    this.filtroCpf = '';
    this.aplicarFiltros();
  }
}
