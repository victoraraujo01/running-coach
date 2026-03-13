import { useState } from 'react';
import { FileDropZone } from './FileDropZone';
import { parseYaml } from '../utils/yaml-parser';
import type { PlanoTreino } from '../types/plano';

interface ImportScreenProps {
  onImport: (plano: PlanoTreino) => void;
}

export function ImportScreen({ onImport }: ImportScreenProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileContent = (content: string) => {
    try {
      setError(null);
      const plano = parseYaml(content);
      onImport(plano);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar o arquivo YAML.');
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-12 text-center">
        <div className="text-5xl mb-4">🏃</div>
        <h1 className="text-3xl font-bold tracking-tight text-label">
          Running Coach
        </h1>
        <p className="text-label-secondary mt-2">
          Gerencie sua preparação de corrida
        </p>
      </div>

      <FileDropZone onFileContent={handleFileContent} error={error} />

      <div className="mt-12 max-w-lg mx-auto">
        <p className="text-xs text-label-secondary text-center">
          O arquivo YAML deve conter a estrutura do plano de treino com semanas e treinos.
          Os dados serão armazenados localmente no navegador.
        </p>
      </div>
    </div>
  );
}
