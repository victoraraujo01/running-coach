import { Check, X, Circle } from 'lucide-react';
import type { Status } from '../types/plano';

interface StatusToggleProps {
  status: Status;
  onToggle: (newStatus: Status) => void;
}

const NEXT_STATUS: Record<Status, Status> = {
  pendente: 'concluido',
  concluido: 'perdido',
  perdido: 'pendente',
};

const STATUS_CONFIG: Record<Status, { icon: typeof Check; className: string; label: string }> = {
  pendente: {
    icon: Circle,
    className: 'text-label-secondary hover:text-label border-surface-3 hover:border-label-secondary',
    label: 'Pendente',
  },
  concluido: {
    icon: Check,
    className: 'text-corrida border-corrida bg-corrida/10',
    label: 'Concluído',
  },
  perdido: {
    icon: X,
    className: 'text-longo border-longo bg-longo/10',
    label: 'Perdido',
  },
};

export function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <button
      onClick={() => onToggle(NEXT_STATUS[status])}
      title={config.label}
      className={`
        w-9 h-9 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 shrink-0
        ${config.className}
      `}
    >
      <Icon size={16} />
    </button>
  );
}
