import { ArrowUpDown } from 'lucide-react';
import type { Treino, Status } from '../types/plano';
import { CategoryBadge } from './CategoryBadge';
import { StatusToggle } from './StatusToggle';

interface WorkoutCardProps {
  treino: Treino;
  onStatusChange: (status: Status) => void;
  onMove: () => void;
}

export function WorkoutCard({ treino, onStatusChange, onMove }: WorkoutCardProps) {
  return (
    <div
      className={`
        group flex items-center gap-3 p-4 rounded-2xl bg-surface
        border border-separator/50 transition-all duration-200
        ${treino.status === 'concluido' ? 'opacity-80' : ''}
        ${treino.status === 'perdido' ? 'opacity-50' : ''}
      `}
    >
      <StatusToggle status={treino.status} onToggle={onStatusChange} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-label-secondary font-medium">
            {treino.dia} · {treino.data}
          </span>
          <CategoryBadge categoria={treino.categoria} />
          {treino.tipo && (
            <span className="text-xs text-label-secondary">{treino.tipo}</span>
          )}
        </div>
        <p className={`text-sm font-medium truncate ${
          treino.status === 'concluido' ? 'line-through text-label-secondary' : 'text-label'
        }`}>
          {treino.descricao}
        </p>
      </div>

      <button
        onClick={onMove}
        className="p-1.5 rounded-lg text-surface-3 hover:text-label-secondary hover:bg-surface-3/50 transition-colors shrink-0"
        aria-label="Mover atividade"
      >
        <ArrowUpDown size={16} />
      </button>
    </div>
  );
}
