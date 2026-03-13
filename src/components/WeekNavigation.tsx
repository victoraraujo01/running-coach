import { useRef, useEffect } from 'react';
import type { Semana } from '../types/plano';
import { getWeekStats } from '../utils/stats';

interface WeekNavigationProps {
  semanas: Semana[];
  selectedWeek: number;
  onSelectWeek: (index: number) => void;
}

export function WeekNavigation({ semanas, selectedWeek, onSelectWeek }: WeekNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [selectedWeek]);

  return (
    <div ref={scrollRef} className="hide-scrollbar overflow-x-auto -mx-4 px-4">
      <div className="flex gap-2 pb-1">
        {semanas.map((semana, idx) => {
          const stats = getWeekStats(semana);
          const isSelected = idx === selectedWeek;
          const isComplete = stats.percentual === 100;

          return (
            <button
              key={semana.semana}
              ref={isSelected ? selectedRef : undefined}
              onClick={() => onSelectWeek(idx)}
              className={`
                shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl
                transition-all duration-200 min-w-[4.5rem]
                ${isSelected
                  ? 'bg-corrida text-black'
                  : isComplete
                    ? 'bg-corrida/15 text-corrida'
                    : 'bg-surface text-label-secondary hover:bg-surface-2'
                }
              `}
            >
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Sem</span>
              <span className="text-lg font-bold">{semana.semana}</span>
              {stats.total > 0 && (
                <div className="flex gap-0.5">
                  {semana.treinos.map(t => (
                    <div
                      key={t.id}
                      className={`w-1 h-1 rounded-full ${
                        t.status === 'concluido'
                          ? isSelected ? 'bg-black/60' : 'bg-corrida'
                          : t.status === 'perdido'
                            ? isSelected ? 'bg-black/30' : 'bg-longo/60'
                            : isSelected ? 'bg-black/20' : 'bg-surface-3'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
