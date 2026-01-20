import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { ExameService } from '../../services/exame.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Paciente, Exame } from '../../models/paciente.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-paciente-detalhes',
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-detalhes.html',
  styleUrl: './paciente-detalhes.scss'
})
export class PacienteDetalhes implements OnInit {
  paciente: Paciente | null = null;
  exames: Exame[] = [];
  loading = true;
  error: string | null = null;
  showFormExame = false;
  salvandoExame = false;
  novoExame = {
    modalidade: '',
    descricao: ''
  };
  modalidades = [
    { valor: 'CR', nome: 'Raio-X Computadorizado' },
    { valor: 'CT', nome: 'Tomografia Computadorizada' },
    { valor: 'DX', nome: 'Radiografia Digital' },
    { valor: 'MG', nome: 'Mamografia' },
    { valor: 'MR', nome: 'Ressonância Magnética' },
    { valor: 'NM', nome: 'Medicina Nuclear' },
    { valor: 'OT', nome: 'Outras Modalidades' },
    { valor: 'PT', nome: 'Tomografia por Emissão de Pósitrons' },
    { valor: 'RF', nome: 'Fluoroscopia' },
    { valor: 'US', nome: 'Ultrassonografia' },
    { valor: 'XA', nome: 'Angiografia por Raio-X' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private exameService: ExameService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarDados(id);
    }
  }

  carregarDados(id: string) {
    console.log('Carregando dados do paciente:', id);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.pacienteService.buscarPorId(id).subscribe({
      next: (paciente) => {
        console.log('Paciente recebido:', paciente);
        this.paciente = paciente;
        this.cdr.detectChanges();
        this.carregarExames();
      },
      error: (err) => {
        console.error('Erro ao carregar paciente:', err);
        this.error = 'Erro ao carregar dados do paciente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  carregarExames() {
    console.log('Carregando exames do paciente...');
    this.exameService.buscarTodos(1, 100).subscribe({
      next: (response) => {
        console.log('Exames recebidos:', response);
        this.exames = response.data.filter(
          exame => exame.pacienteId === this.paciente?.id
        );
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading finalizado. Exames:', this.exames.length);
      },
      error: (err) => {
        console.error('Erro ao carregar exames:', err);
        this.error = 'Erro ao carregar exames do paciente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  voltar() {
    this.router.navigate(['/pacientes']);
  }

  formatarDocumento(doc: string): string {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  getModalidadeNome(modalidade: string): string {
    const modalidades: { [key: string]: string } = {
      'CR': 'Raio-X Computadorizado',
      'CT': 'Tomografia Computadorizada',
      'DX': 'Radiografia Digital',
      'MG': 'Mamografia',
      'MR': 'Ressonância Magnética',
      'NM': 'Medicina Nuclear',
      'OT': 'Outras Modalidades',
      'PT': 'Tomografia por Emissão de Pósitrons',
      'RF': 'Fluoroscopia',
      'US': 'Ultrassonografia',
      'XA': 'Angiografia por Raio-X'
    };
    return modalidades[modalidade] || modalidade;
  }

  calcularIdade(dataNascimento: string | Date): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  getModalidadesUnicas(): number {
    const modalidades = new Set(this.exames.map(e => e.modalidade));
    return modalidades.size;
  }

  getUltimoExame(): Date | null {
    if (this.exames.length === 0) return null;
    
    const ultimoExame = this.exames.reduce((ultimo, atual) => {
      const dataAtual = new Date(atual.createdAt!);
      const dataUltimo = new Date(ultimo.createdAt!);
      return dataAtual > dataUltimo ? atual : ultimo;
    });
    
    return new Date(ultimoExame.createdAt!);
  }

  salvarExame() {
    if (!this.novoExame.modalidade || !this.paciente?.id || this.salvandoExame) return;

    // Normalizar descrição para comparação
    const descricaoNormalizada = this.novoExame.descricao.trim().toLowerCase();

    // Verificar se já existe um exame idêntico recente (últimos 30 minutos)
    const trintaMinutosAtras = new Date();
    trintaMinutosAtras.setMinutes(trintaMinutosAtras.getMinutes() - 30);

    const examesDuplicados = this.exames.filter(e => {
      const exameCriado = new Date(e.createdAt!);
      return e.modalidade === this.novoExame.modalidade &&
             e.descricao?.trim().toLowerCase() === descricaoNormalizada &&
             exameCriado >= trintaMinutosAtras;
    });

    if (examesDuplicados.length > 0) {
      const minutos = Math.floor((new Date().getTime() - new Date(examesDuplicados[0].createdAt!).getTime()) / 60000);
      this.toast.aviso(
        `Já existe um exame igual criado há ${minutos} minuto(s). Aguarde 30 minutos ou mude a descrição.`,
        5000
      );
      return;
    }

    this.salvandoExame = true;

    const userName = localStorage.getItem('userName') || 'Usuário';

    const exame: Exame = {
      pacienteId: this.paciente.id,
      modalidade: this.novoExame.modalidade as any,
      descricao: this.novoExame.descricao.trim(),
      createdBy: userName,
      idempotencyKey: uuidv4()
    };

    this.exameService.criar(exame).subscribe({
      next: (exameCreated) => {
        console.log('Exame criado:', exameCreated);
        this.exames.unshift(exameCreated);
        this.showFormExame = false;
        this.novoExame = { modalidade: '', descricao: '' };
        this.salvandoExame = false;
        this.toast.sucesso('Exame cadastrado com sucesso!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao criar exame:', err);
        this.salvandoExame = false;
        
        if (err.status === 409) {
          this.toast.aviso('Este exame já foi registrado recentemente.');
        } else {
          this.toast.erro('Erro ao criar exame. Tente novamente.');
        }
        this.cdr.detectChanges();
      }
    });
  }

  cancelarNovoExame() {
    this.showFormExame = false;
    this.novoExame = { modalidade: '', descricao: '' };
  }

  async removerExame(exameId: string) {
    const confirmado = await this.confirm.confirmar('Deseja realmente remover este exame?');
    if (!confirmado) {
      return;
    }

    this.exameService.deletar(exameId).subscribe({
      next: () => {
        this.exames = this.exames.filter(e => e.id !== exameId);
        this.toast.sucesso('Exame removido com sucesso!');
        this.cdr.detectChanges();
        console.log('Exame removido com sucesso');
      },
      error: (err) => {
        console.error('Erro ao remover exame:', err);
        this.toast.erro('Erro ao remover exame. Tente novamente.');
      }
    });
  }
}
