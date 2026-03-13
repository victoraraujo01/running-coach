import { useState, useEffect, useRef, useCallback } from 'react';
import type { Treino, Semana, Categoria } from '../types/plano';

interface MoveModalProps {
  isOpen: boolean;
  sourceTreino: Treino | null;
  semanas: Semana[];
  onConfirm: (targetTreinoId: string, swap: boolean) => void;
  onCancel: () => void;
}

const CATEGORY_COLORS: Record<Categoria, string> = {
  Corrida: 'bg-corrida',
  Musculação: 'bg-musculacao',
  Descanso: 'bg-descanso',
  Longo: 'bg-longo',
};

export function MoveModal({ isOpen, sourceTreino, semanas, onConfirm, onCancel }: MoveModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [swap, setSwap] = useState(true);
  const sourceWeekRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const sourceWeekIdx = sourceTreino
    ? semanas.findIndex(s => s.treinos.some(t => t.id === sourceTreino.id))
    : -1;

  const sourceWeekCallback = useCallback((node: HTMLDivElement | null) => {
    sourceWeekRef.current = node;
    if (node && scrollContainerRef.current) {
      node.scrollIntoView({ block: 'start' });
    }
  }, []);

  useEffect(() => {
    setSelectedId(null);
    setSwap(true);
  }, [sourceTreino?.id]);

  if (!isOpen || !sourceTreino) return null;

  const handleConfirm = () => {
    if (selectedId) {
      onConfirm(selectedId, swap);
      setSelectedId(null);
    }
  };

  const handleCancel = () => {
    setSelectedId(null);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCancel} />
      <div className="relative bg-surface-2 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-separator">
          <h3 className="text-lg font-bold text-label">Mover Atividade</h3>
          <p className="text-xs text-label-secondary mt-1 truncate">
            {sourceTreino.dia} · {sourceTreino.data} — {sourceTreino.descricao}
          </p>
        </div>

        {/* Calendar grid */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
          {semanas.map((semana, semIdx) => (
            <div key={semIdx} ref={semIdx === sourceWeekIdx ? sourceWeekCallback : undefined} className="mb-4 last:mb-0">
              <h4 className="text-xs font-semibold text-label-secondary uppercase tracking-wider mb-2">
                Semana {semana.semana}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {semana.treinos.map(treino => {
                  const isSource = treino.id === sourceTreino.id;
                  const isSelected = treino.id === selectedId;
                  return (
                    <button
                      key={treino.id}
                      disabled={isSource}
                      onClick={() => setSelectedId(treino.id)}
                      className={`
                        flex flex-col items-start p-2 rounded-xl transition-all min-w-[72px]
                        ${isSource
                          ? 'bg-surface-3/50 opacity-40 cursor-not-allowed'
                          : isSelected
                            ? 'ring-2 ring-corrida bg-corrida/15'
                            : 'bg-surface hover:bg-surface-3'
                        }
                      `}
                    >
                      <span className="text-[10px] font-medium text-label-secondary leading-tight">
                        {treino.dia}
                      </span>
                      <span className="text-sm font-bold text-label leading-tight">
                        {treino.data}
                      </span>
                      <div className={`w-full h-1 rounded-full mt-1.5 ${CATEGORY_COLORS[treino.categoria]}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-separator">
          <label className="flex items-center gap-2.5 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={swap}
              onChange={(e) => setSwap(e.target.checked)}
              className="w-4 h-4 rounded accent-corrida shrink-0"
            />
            <span className="text-sm text-label">
              Trocar atividades (troca com a do destino)
            </span>
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-3 text-label font-medium
                         hover:bg-separator transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className="flex-1 px-4 py-2.5 rounded-xl bg-corrida text-white font-medium
                         hover:bg-corrida/80 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
