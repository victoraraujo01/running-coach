import { Upload, RotateCcw, Gauge } from 'lucide-react';
import type { PlanoTreino } from '../types/plano';
import { getOverallStats } from '../utils/stats';
import { ProgressRing } from './ProgressRing';
import { OverflowMenu } from './OverflowMenu';

interface HeaderProps {
  plano: PlanoTreino;
  onReset: () => void;
  onEditPlan: () => void;
  onShowZones: () => void;
}

export function Header({ plano, onReset, onEditPlan, onShowZones }: HeaderProps) {
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
      <OverflowMenu items={[
        {
          label: 'Importar novo YAML',
          icon: <Upload size={15} />,
          onClick: onEditPlan,
        },
        {
          label: 'Zonas de pace',
          icon: <Gauge size={15} />,
          onClick: onShowZones,
        },
        {
          label: 'Resetar plano',
          icon: <RotateCcw size={15} />,
          onClick: onReset,
          danger: true,
        },
      ]} />
    </div>
  );
}
