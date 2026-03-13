import { useState } from 'react';
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
import type { PlanoTreino, Status } from '../types/plano';
import { getWeekStats } from '../utils/stats';
import { Header } from './Header';
import { WeekNavigation } from './WeekNavigation';
import { WorkoutCard } from './WorkoutCard';
import { StatsBar } from './StatsBar';
import { ConfirmDialog } from './ConfirmDialog';

interface DndItem {
  id: string;
  semanaIdx: number;
  treinoIdx: number;
  isAdjacent: boolean;
}

interface PlanDashboardProps {
  plano: PlanoTreino;
  selectedWeek: number;
  onSelectWeek: (index: number) => void;
  onReset: () => void;
  onStatusChange: (semanaIdx: number, treinoId: string, status: Status) => void;
  onReorder: (semanaIdx: number, fromIndex: number, toIndex: number) => void;
  onMoveTreino: (fromSemana: number, treinoId: string, toSemana: number, toIndex: number) => void;
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
  const currentSemana = plano.semanas[selectedWeek];
  const weekStats = getWeekStats(currentSemana);

  const prevSemana = selectedWeek > 0 ? plano.semanas[selectedWeek - 1] : null;
  const nextSemana = selectedWeek < plano.semanas.length - 1 ? plano.semanas[selectedWeek + 1] : null;

  // Build flat DnD item list with boundary treinos
  const dndItems: DndItem[] = [];

  if (prevSemana) {
    const lastIdx = prevSemana.treinos.length - 1;
    dndItems.push({
      id: prevSemana.treinos[lastIdx].id,
      semanaIdx: selectedWeek - 1,
      treinoIdx: lastIdx,
      isAdjacent: true,
    });
  }

  currentSemana.treinos.forEach((t, i) => {
    dndItems.push({
      id: t.id,
      semanaIdx: selectedWeek,
      treinoIdx: i,
      isAdjacent: false,
    });
  });

  if (nextSemana) {
    dndItems.push({
      id: nextSemana.treinos[0].id,
      semanaIdx: selectedWeek + 1,
      treinoIdx: 0,
      isAdjacent: true,
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = dndItems.find(d => d.id === active.id);
    const overItem = dndItems.find(d => d.id === over.id);
    if (!activeItem || !overItem) return;

    if (activeItem.semanaIdx === overItem.semanaIdx) {
      // Same week reorder
      const treinos = plano.semanas[activeItem.semanaIdx].treinos;
      const fromIndex = treinos.findIndex(t => t.id === active.id);
      const toIndex = treinos.findIndex(t => t.id === over.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        onReorder(activeItem.semanaIdx, fromIndex, toIndex);
      }
    } else {
      // Cross-week move
      onMoveTreino(
        activeItem.semanaIdx,
        String(active.id),
        overItem.semanaIdx,
        overItem.treinoIdx,
      );
    }
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={dndItems.map(d => d.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {prevSemana && (
                <div className="opacity-40">
                  <p className="text-[10px] font-semibold text-label-secondary uppercase tracking-wider mb-1 ml-1">
                    Semana {prevSemana.semana}
                  </p>
                  <WorkoutCard
                    treino={prevSemana.treinos[prevSemana.treinos.length - 1]}
                    onStatusChange={(status) =>
                      onStatusChange(selectedWeek - 1, prevSemana.treinos[prevSemana.treinos.length - 1].id, status)
                    }
                  />
                </div>
              )}

              <h2 className="text-sm font-semibold text-label-secondary uppercase tracking-wider mt-1">
                Semana {currentSemana.semana}
              </h2>
              {currentSemana.treinos.map(treino => (
                <WorkoutCard
                  key={treino.id}
                  treino={treino}
                  onStatusChange={(status) => onStatusChange(selectedWeek, treino.id, status)}
                />
              ))}

              {nextSemana && (
                <div className="opacity-40 mt-1">
                  <p className="text-[10px] font-semibold text-label-secondary uppercase tracking-wider mb-1 ml-1">
                    Semana {nextSemana.semana}
                  </p>
                  <WorkoutCard
                    treino={nextSemana.treinos[0]}
                    onStatusChange={(status) =>
                      onStatusChange(selectedWeek + 1, nextSemana.treinos[0].id, status)
                    }
                  />
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
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
    </div>
  );
}
