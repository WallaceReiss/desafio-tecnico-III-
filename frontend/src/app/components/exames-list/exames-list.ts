import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExameService } from '../../services/exame.service';
import { Exame } from '../../models/paciente.model';
import { ExamesForm } from '../exames-form/exames-form';

@Component({
  selector: 'app-exames-list',
  imports: [CommonModule, ExamesForm],
  templateUrl: './exames-list.html',
  styleUrl: './exames-list.scss',
})
export class ExamesList implements OnInit {
  exames: Exame[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  
  currentPage = 1;
  pageSize = 10;
  totalExames = 0;
  totalPages = 0;

  constructor(
    private exameService: ExameService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ExamesList: Componente inicializado');
    this.loadExames();
  }

  loadExames() {
    console.log('Carregando exames - Página:', this.currentPage);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.exameService.buscarTodos(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Exames carregados:', response);
        this.exames = response.data || [];
        this.totalExames = response.total || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading finalizado. Total de exames:', this.exames.length);
      },
      error: (err) => {
        console.error('Erro ao carregar exames:', err);
        this.error = 'Erro ao carregar exames. Tente novamente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onExameSalvo() {
    this.showForm = false;
    this.loadExames();
  }

  changePage(page: number) {
    console.log('Mudando para página:', page);
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
      this.loadExames();
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
