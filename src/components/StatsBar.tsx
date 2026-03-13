import type { Stats } from '../utils/stats';
import { CircleCheck, CircleX, CircleDashed } from 'lucide-react';

interface StatsBarProps {
  stats: Stats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex items-center gap-2 bg-surface rounded-xl p-3">
        <div className="w-8 h-8 rounded-full bg-corrida/15 flex items-center justify-center">
          <CircleCheck size={16} className="text-corrida" />
        </div>
        <div>
          <p className="text-lg font-bold text-corrida">{stats.concluidos}</p>
          <p className="text-[10px] text-label-secondary uppercase tracking-wider">Concluídos</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-surface rounded-xl p-3">
        <div className="w-8 h-8 rounded-full bg-longo/15 flex items-center justify-center">
          <CircleX size={16} className="text-longo" />
        </div>
        <div>
          <p className="text-lg font-bold text-longo">{stats.perdidos}</p>
          <p className="text-[10px] text-label-secondary uppercase tracking-wider">Perdidos</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-surface rounded-xl p-3">
        <div className="w-8 h-8 rounded-full bg-descanso/15 flex items-center justify-center">
          <CircleDashed size={16} className="text-descanso" />
        </div>
        <div>
          <p className="text-lg font-bold text-descanso">{stats.pendentes}</p>
          <p className="text-[10px] text-label-secondary uppercase tracking-wider">Pendentes</p>
        </div>
      </div>
    </div>
  );
}
