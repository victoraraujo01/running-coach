import type { Stats } from '../utils/stats';
import { Check, X, Clock } from 'lucide-react';

interface StatsBarProps {
  stats: Stats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex items-center gap-2 bg-surface rounded-xl p-3">
        <div className="w-10 h-10 min-w-10 rounded-full bg-corrida/20 flex items-center justify-center">
          <Check size={18} className="text-corrida" />
        </div>
        <div>
          <p className="text-lg font-bold text-corrida">{stats.concluidos}</p>
          <p className="text-[10px] text-label-secondary uppercase tracking-wider">Concluídos</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-surface rounded-xl p-3">
        <div className="w-10 h-10 min-w-10 rounded-full bg-longo/20 flex items-center justify-center">
          <X size={18} className="text-longo" />
        </div>
        <div>
          <p className="text-lg font-bold text-longo">{stats.perdidos}</p>
          <p className="text-[10px] text-label-secondary uppercase tracking-wider">Perdidos</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-surface rounded-xl p-3">
        <div className="w-10 h-10 min-w-10 rounded-full bg-descanso/20 flex items-center justify-center">
          <Clock size={18} className="text-descanso" />
        </div>
        <div>
          <p className="text-lg font-bold text-descanso">{stats.pendentes}</p>
          <p className="text-[10px] text-label-secondary uppercase tracking-wider">Pendentes</p>
        </div>
      </div>
    </div>
  );
}
