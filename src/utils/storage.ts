import type { PlanoTreino } from '../types/plano';

const STORAGE_KEY = 'running-coach-plano';

export function loadPlano(): PlanoTreino | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as PlanoTreino;
  } catch {
    return null;
  }
}

export function savePlano(plano: PlanoTreino): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plano));
}

export function clearPlano(): void {
  localStorage.removeItem(STORAGE_KEY);
}
