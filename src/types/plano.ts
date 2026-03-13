export type Categoria = 'Corrida' | 'Musculação' | 'Descanso' | 'Longo';
export type Status = 'pendente' | 'concluido' | 'perdido';
export type DiaSemana = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SÁB' | 'DOM';

export interface Treino {
  id: string;
  data: string;
  dia: DiaSemana;
  categoria: Categoria;
  tipo: string;
  descricao: string;
  status: Status;
}

export interface Semana {
  semana: number;
  treinos: Treino[];
}

export interface PlanoInfo {
  nome: string;
  duracao_semanas: number;
}

export interface PlanoTreino {
  plano: PlanoInfo;
  semanas: Semana[];
}
