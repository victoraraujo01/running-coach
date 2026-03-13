import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Treino, Status } from '../types/plano';
import { CategoryBadge } from './CategoryBadge';
import { StatusToggle } from './StatusToggle';

interface WorkoutCardProps {
  treino: Treino;
  onStatusChange: (status: Status) => void;
}

export function WorkoutCard({ treino, onStatusChange }: WorkoutCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: treino.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-3 p-4 rounded-2xl bg-surface
        border border-separator/50 transition-all duration-200
        ${isDragging ? 'opacity-50 scale-[1.02] shadow-lg shadow-black/50 z-10' : ''}
        ${treino.status === 'concluido' ? 'opacity-80' : ''}
        ${treino.status === 'perdido' ? 'opacity-50' : ''}
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 -ml-1 text-surface-3 hover:text-label-secondary transition-colors"
        aria-label="Arrastar para reordenar"
      >
        <GripVertical size={18} />
      </button>

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
    </div>
  );
}
