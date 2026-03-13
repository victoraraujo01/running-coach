import type { Treino, Semana, PlanoTreino } from '../types/plano';

export interface Stats {
  total: number;
  concluidos: number;
  perdidos: number;
  pendentes: number;
  percentual: number;
}

function calcStats(treinos: Treino[]): Stats {
  const total = treinos.length;
  const concluidos = treinos.filter(t => t.status === 'concluido').length;
  const perdidos = treinos.filter(t => t.status === 'perdido').length;
  const pendentes = total - concluidos - perdidos;
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return { total, concluidos, perdidos, pendentes, percentual };
}

export function getWeekStats(semana: Semana): Stats {
  return calcStats(semana.treinos);
}

export function getOverallStats(plano: PlanoTreino): Stats {
  const allTreinos = plano.semanas.flatMap(s => s.treinos);
  return calcStats(allTreinos);
}
