import { RotateCcw } from 'lucide-react';
import type { PlanoTreino } from '../types/plano';
import { getOverallStats } from '../utils/stats';
import { ProgressRing } from './ProgressRing';

interface HeaderProps {
  plano: PlanoTreino;
  onReset: () => void;
}

export function Header({ plano, onReset }: HeaderProps) {
  const stats = getOverallStats(plano);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <ProgressRing percentage={stats.percentual} />
        <div>
          <h1 className="text-xl font-bold text-label tracking-tight">{plano.plano.nome}</h1>
          <p className="text-sm text-label-secondary">
            {stats.concluidos} de {stats.total} treinos concluídos
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="p-2.5 rounded-xl bg-surface hover:bg-surface-2 text-label-secondary
                   hover:text-label transition-all"
        title="Resetar plano"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
