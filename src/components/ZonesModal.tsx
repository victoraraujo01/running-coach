import type { Zona } from '../types/plano';

interface ZonesModalProps {
  isOpen: boolean;
  zonas?: Zona[];
  onClose: () => void;
}

export function ZonesModal({ isOpen, zonas, onClose }: ZonesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-2 rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-bold text-label mb-4">Zonas de pace</h3>

        {zonas?.length ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2 mb-1">
              <span className="text-xs font-semibold text-label-secondary uppercase tracking-wider">Zona</span>
              <span className="text-xs font-semibold text-label-secondary uppercase tracking-wider text-center">Mín</span>
              <span className="text-xs font-semibold text-label-secondary uppercase tracking-wider text-center">Máx</span>
            </div>
            {zonas.map((zona, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-surface rounded-xl">
                <span className="text-sm font-medium text-label">{zona.nome}</span>
                <span className="text-sm text-label-secondary text-center font-mono">{zona.pace_min}</span>
                <span className="text-sm text-label-secondary text-center font-mono">{zona.pace_max}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-label-secondary mb-2">
            Nenhuma zona definida neste plano. Para adicionar, inclua no YAML:
          </p>
        )}

        {!zonas?.length && (
          <pre className="text-xs bg-surface rounded-xl p-3 text-label-secondary overflow-x-auto mt-2">
{`zonas:
  - nome: "Z1 – Recuperação"
    pace_min: "6:30"
    pace_max: "7:30"
  - nome: "Z2 – Base aeróbica"
    pace_min: "5:45"
    pace_max: "6:30"`}
          </pre>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full px-4 py-2.5 rounded-xl bg-surface-3 text-label font-medium
                     hover:bg-separator transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
