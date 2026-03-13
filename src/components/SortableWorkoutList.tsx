import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { Treino, Status } from '../types/plano';
import { WorkoutCard } from './WorkoutCard';

interface SortableWorkoutListProps {
  treinos: Treino[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onStatusChange: (treinoId: string, status: Status) => void;
  onMove: (treinoId: string) => void;
}

export function SortableWorkoutList({ treinos, onReorder, onStatusChange, onMove }: SortableWorkoutListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = treinos.findIndex(t => t.id === active.id);
    const toIndex = treinos.findIndex(t => t.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      onReorder(fromIndex, toIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={treinos.map(t => t.id)} strategy={verticalListSortingStrategy}>
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
      </SortableContext>
    </DndContext>
  );
}
