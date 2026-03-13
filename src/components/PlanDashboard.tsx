import { useState } from 'react';
import type { PlanoTreino, Treino, Status } from '../types/plano';
import { getWeekStats } from '../utils/stats';
import { Header } from './Header';
import { WeekNavigation } from './WeekNavigation';
import { SortableWorkoutList } from './SortableWorkoutList';
import { StatsBar } from './StatsBar';
import { ConfirmDialog } from './ConfirmDialog';
import { MoveModal } from './MoveModal';

interface PlanDashboardProps {
  plano: PlanoTreino;
  selectedWeek: number;
  onSelectWeek: (index: number) => void;
  onReset: () => void;
  onStatusChange: (semanaIdx: number, treinoId: string, status: Status) => void;
  onReorder: (semanaIdx: number, fromIndex: number, toIndex: number) => void;
  onMoveTreino: (sourceTreinoId: string, targetTreinoId: string, swap: boolean) => void;
}

export function PlanDashboard({
  plano,
  selectedWeek,
  onSelectWeek,
  onReset,
  onStatusChange,
  onReorder,
  onMoveTreino,
}: PlanDashboardProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [moveTarget, setMoveTarget] = useState<Treino | null>(null);
  const currentSemana = plano.semanas[selectedWeek];
  const weekStats = getWeekStats(currentSemana);

  const handleMoveRequest = (treinoId: string) => {
    const treino = currentSemana.treinos.find(t => t.id === treinoId);
    if (treino) setMoveTarget(treino);
  };

  return (
    <div className="min-h-dvh pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <Header plano={plano} onReset={() => setShowResetConfirm(true)} />

        <WeekNavigation
          semanas={plano.semanas}
          selectedWeek={selectedWeek}
          onSelectWeek={onSelectWeek}
        />

        <StatsBar stats={weekStats} />

        <div>
          <h2 className="text-sm font-semibold text-label-secondary uppercase tracking-wider mb-3">
            Semana {currentSemana.semana}
          </h2>
          <SortableWorkoutList
            treinos={currentSemana.treinos}
            onReorder={(from, to) => onReorder(selectedWeek, from, to)}
            onStatusChange={(treinoId, status) => onStatusChange(selectedWeek, treinoId, status)}
            onMove={handleMoveRequest}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Resetar plano"
        message="Isso irá apagar todo o progresso e voltar à tela de importação. Tem certeza?"
        confirmLabel="Resetar"
        onConfirm={() => {
          setShowResetConfirm(false);
          onReset();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      <MoveModal
        isOpen={moveTarget !== null}
        sourceTreino={moveTarget}
        semanas={plano.semanas}
        onConfirm={(targetTreinoId, swap) => {
          if (moveTarget) {
            onMoveTreino(moveTarget.id, targetTreinoId, swap);
          }
          setMoveTarget(null);
        }}
        onCancel={() => setMoveTarget(null)}
      />
    </div>
  );
}
