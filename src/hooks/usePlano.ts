import { useState, useCallback, useEffect } from 'react';
import type { PlanoTreino, Status } from '../types/plano';
import { loadPlano, savePlano, clearPlano } from '../utils/storage';

function findCurrentWeekIndex(plano: PlanoTreino): number {
  const today = new Date();
  const todayVal = (today.getMonth() + 1) * 100 + today.getDate();

  const parseDate = (d: string) => {
    const [day, month] = d.split('/').map(Number);
    return month * 100 + day;
  };

  for (let i = 0; i < plano.semanas.length; i++) {
    const dates = plano.semanas[i].treinos.map(t => parseDate(t.data));
    const maxDate = Math.max(...dates);
    if (maxDate >= todayVal) return i;
  }
  return plano.semanas.length - 1;
}

export function usePlano() {
  const [plano, setPlano] = useState<PlanoTreino | null>(() => loadPlano());
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const saved = loadPlano();
    return saved ? findCurrentWeekIndex(saved) : 0;
  });

  useEffect(() => {
    if (plano) {
      savePlano(plano);
    }
  }, [plano]);

  const importPlano = useCallback((newPlano: PlanoTreino) => {
    setPlano(newPlano);
    setSelectedWeek(findCurrentWeekIndex(newPlano));
  }, []);

  const updatePlano = useCallback((newPlano: PlanoTreino) => {
    setSelectedWeek(findCurrentWeekIndex(newPlano));
    setPlano(prev => {
      if (!prev) return newPlano;
      // Build map of date -> status from current plan to preserve progress
      const statusMap = new Map<string, Status>();
      for (const semana of prev.semanas) {
        for (const treino of semana.treinos) {
          statusMap.set(treino.data, treino.status);
        }
      }
      // Merge: apply preserved statuses to matching dates in new plan
      const merged = structuredClone(newPlano);
      for (const semana of merged.semanas) {
        for (const treino of semana.treinos) {
          const prevStatus = statusMap.get(treino.data);
          if (prevStatus !== undefined) treino.status = prevStatus;
        }
      }
      return merged;
    });
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

  const moveTreino = useCallback((sourceTreinoId: string, targetTreinoId: string, swap: boolean) => {
    setPlano(prev => {
      if (!prev) return prev;
      const next = structuredClone(prev);

      let srcSem = -1, srcIdx = -1, tgtSem = -1, tgtIdx = -1;
      for (let i = 0; i < next.semanas.length; i++) {
        for (let j = 0; j < next.semanas[i].treinos.length; j++) {
          const id = next.semanas[i].treinos[j].id;
          if (id === sourceTreinoId) { srcSem = i; srcIdx = j; }
          if (id === targetTreinoId) { tgtSem = i; tgtIdx = j; }
        }
      }
      if (srcSem === -1 || tgtSem === -1) return prev;

      const src = next.semanas[srcSem].treinos[srcIdx];
      const tgt = next.semanas[tgtSem].treinos[tgtIdx];

      if (swap) {
        // Swap dates and day-of-week
        [src.data, tgt.data] = [tgt.data, src.data];
        [src.dia, tgt.dia] = [tgt.dia, src.dia];
        // Swap positions across weeks if different
        if (srcSem !== tgtSem) {
          next.semanas[srcSem].treinos[srcIdx] = tgt;
          next.semanas[tgtSem].treinos[tgtIdx] = src;
        }
      } else {
        // Move source to target's date (two activities on same day)
        src.data = tgt.data;
        src.dia = tgt.dia;
        if (srcSem !== tgtSem) {
          next.semanas[srcSem].treinos.splice(srcIdx, 1);
          next.semanas[tgtSem].treinos.splice(tgtIdx + 1, 0, src);
        }
      }

      // Sort treinos by date within affected weeks
      const parseDate = (d: string) => {
        const [day, month] = d.split('/').map(Number);
        return month * 100 + day;
      };
      const sortByDate = (treinos: (typeof src)[]) => treinos.sort((a, b) => parseDate(a.data) - parseDate(b.data));
      sortByDate(next.semanas[srcSem].treinos);
      if (tgtSem !== srcSem) sortByDate(next.semanas[tgtSem].treinos);

      return next;
    });
  }, []);

  return {
    plano,
    selectedWeek,
    setSelectedWeek,
    importPlano,
    updatePlano,
    resetPlano,
    updateTreinoStatus,
    moveTreino,
  };
}
