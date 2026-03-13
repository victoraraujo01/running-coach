import { useState, useCallback, useEffect } from 'react';
import type { PlanoTreino, Status } from '../types/plano';
import { loadPlano, savePlano, clearPlano } from '../utils/storage';

export function usePlano() {
  const [plano, setPlano] = useState<PlanoTreino | null>(() => loadPlano());
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    if (plano) {
      savePlano(plano);
    }
  }, [plano]);

  const importPlano = useCallback((newPlano: PlanoTreino) => {
    setPlano(newPlano);
    setSelectedWeek(0);
  }, []);

  const resetPlano = useCallback(() => {
    clearPlano();
    setPlano(null);
    setSelectedWeek(0);
  }, []);

  const updateTreinoStatus = useCallback((semanaIdx: number, treinoId: string, status: Status) => {
    setPlano(prev => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const treino = next.semanas[semanaIdx].treinos.find(t => t.id === treinoId);
      if (treino) treino.status = status;
      return next;
    });
  }, []);

  const reorderTreinos = useCallback((semanaIdx: number, fromIndex: number, toIndex: number) => {
    setPlano(prev => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const treinos = next.semanas[semanaIdx].treinos;
      const [moved] = treinos.splice(fromIndex, 1);
      treinos.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const moveTreino = useCallback((fromSemana: number, treinoId: string, toSemana: number, toIndex: number) => {
    setPlano(prev => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const fromTreinos = next.semanas[fromSemana].treinos;
      const fromIndex = fromTreinos.findIndex(t => t.id === treinoId);
      if (fromIndex === -1) return prev;
      const [moved] = fromTreinos.splice(fromIndex, 1);
      next.semanas[toSemana].treinos.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  return {
    plano,
    selectedWeek,
    setSelectedWeek,
    importPlano,
    resetPlano,
    updateTreinoStatus,
    reorderTreinos,
    moveTreino,
  };
}
