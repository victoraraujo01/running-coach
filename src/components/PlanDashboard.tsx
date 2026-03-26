import { useState, useRef } from 'react';
import type { PlanoTreino, Treino, Status } from '../types/plano';
import { getWeekStats } from '../utils/stats';
import { parseYaml } from '../utils/yaml-parser';
import { Header } from './Header';
import { WeekNavigation } from './WeekNavigation';
import { SortableWorkoutList } from './SortableWorkoutList';
import { StatsBar } from './StatsBar';
import { ConfirmDialog } from './ConfirmDialog';
import { MoveModal } from './MoveModal';
import { ZonesModal } from './ZonesModal';

interface PlanDashboardProps {
  plano: PlanoTreino;
  selectedWeek: number;
  onSelectWeek: (index: number) => void;
  onReset: () => void;
  onUpdatePlan: (plano: PlanoTreino) => void;
  onStatusChange: (semanaIdx: number, treinoId: string, status: Status) => void;
  onMoveTreino: (sourceTreinoId: string, targetTreinoId: string, swap: boolean) => void;
}

export function PlanDashboard({
  plano,
  selectedWeek,
  onSelectWeek,
  onReset,
  onUpdatePlan,
  onStatusChange,
  onMoveTreino,
}: PlanDashboardProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [moveTarget, setMoveTarget] = useState<Treino | null>(null);
  const [pendingPlan, setPendingPlan] = useState<PlanoTreino | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSemana = plano.semanas[selectedWeek];
  const weekStats = getWeekStats(currentSemana);

  const handleMoveRequest = (treinoId: string) => {
    const treino = currentSemana.treinos.find(t => t.id === treinoId);
    if (treino) setMoveTarget(treino);
  };

  const handleEditPlan = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so same file can be re-selected if needed
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const parsed = parseYaml(content);
        setPendingPlan(parsed);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Erro ao processar o arquivo YAML.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-dvh pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <Header
          plano={plano}
          onReset={() => setShowResetConfirm(true)}
          onEditPlan={handleEditPlan}
          onShowZones={() => setShowZones(true)}
        />

        <WeekNavigation
          semanas={plano.semanas}
          selectedWeek={selectedWeek}
          onSelectWeek={onSelectWeek}
        />

        <StatsBar stats={weekStats} />

        <div>
          <h2 className="text-sm font-semibold text-label-secondary uppercase tracking-wider mb-3">
            Semana {currentSemana.semana}
          </h2>
          <SortableWorkoutList
            treinos={currentSemana.treinos}
            onStatusChange={(treinoId, status) => onStatusChange(selectedWeek, treinoId, status)}
            onMove={handleMoveRequest}
          />
        </div>
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

      <ConfirmDialog
        isOpen={pendingPlan !== null}
        title="Importar novo plano"
        message={pendingPlan ? `Importar "${pendingPlan.plano.nome}"? O status dos dias já preenchidos (feito/não feito) será mantido para as datas em comum.` : ''}
        confirmLabel="Importar"
        onConfirm={() => {
          if (pendingPlan) onUpdatePlan(pendingPlan);
          setPendingPlan(null);
        }}
        onCancel={() => setPendingPlan(null)}
      />

      <ConfirmDialog
        isOpen={importError !== null}
        title="Erro ao importar"
        message={importError ?? ''}
        confirmLabel="OK"
        onConfirm={() => setImportError(null)}
        onCancel={() => setImportError(null)}
      />

      <ZonesModal
        isOpen={showZones}
        zonas={plano.zonas}
        onClose={() => setShowZones(false)}
      />

      <MoveModal
        isOpen={moveTarget !== null}
        sourceTreino={moveTarget}
        semanas={plano.semanas}
        onConfirm={(targetTreinoId, swap) => {
          if (moveTarget) {
            onMoveTreino(moveTarget.id, targetTreinoId, swap);
          }
          setMoveTarget(null);
        }}
        onCancel={() => setMoveTarget(null)}
      />
    </div>
  );
}
