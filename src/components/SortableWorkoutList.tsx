import type { Treino, Status } from '../types/plano';
import { WorkoutCard } from './WorkoutCard';

interface SortableWorkoutListProps {
  treinos: Treino[];
  onStatusChange: (treinoId: string, status: Status) => void;
  onMove: (treinoId: string) => void;
}

export function SortableWorkoutList({ treinos, onStatusChange, onMove }: SortableWorkoutListProps) {
  return (
    <div className="flex flex-col gap-2">
      {treinos.map(treino => (
        <WorkoutCard
          key={treino.id}
          treino={treino}
          onStatusChange={(status) => onStatusChange(treino.id, status)}
          onMove={() => onMove(treino.id)}
        />
      ))}
    </div>
  );
}
