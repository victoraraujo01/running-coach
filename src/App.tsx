import { usePlano } from './hooks/usePlano';
import { ImportScreen } from './components/ImportScreen';
import { PlanDashboard } from './components/PlanDashboard';

function App() {
  const {
    plano,
    selectedWeek,
    setSelectedWeek,
    importPlano,
    resetPlano,
    updateTreinoStatus,
    moveTreino,
  } = usePlano();

  if (!plano) {
    return <ImportScreen onImport={importPlano} />;
  }

  return (
    <PlanDashboard
      plano={plano}
      selectedWeek={selectedWeek}
      onSelectWeek={setSelectedWeek}
      onReset={resetPlano}
      onStatusChange={updateTreinoStatus}
      onMoveTreino={moveTreino}
    />
  );
}

export default App;
