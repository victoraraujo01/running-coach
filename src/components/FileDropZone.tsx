import { useState, useRef, type DragEvent } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileDropZoneProps {
  onFileContent: (content: string) => void;
  error: string | null;
}

export function FileDropZone({ onFileContent, error }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-12
          flex flex-col items-center gap-4 transition-all duration-200
          ${isDragging
            ? 'border-corrida bg-corrida/10 scale-[1.02]'
            : 'border-surface-3 bg-surface/50 hover:border-label-secondary hover:bg-surface'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".yaml,.yml"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className={`
          rounded-full p-4 transition-colors duration-200
          ${isDragging ? 'bg-corrida/20' : 'bg-surface-2'}
        `}>
          {isDragging ? (
            <FileText size={32} className="text-corrida" />
          ) : (
            <Upload size={32} className="text-label-secondary" />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-label">
            {isDragging ? 'Solte o arquivo aqui' : 'Importar plano de treino'}
          </p>
          <p className="text-sm text-label-secondary mt-1">
            Arraste um arquivo .yaml ou clique para selecionar
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-longo/10 border border-longo/30 flex items-start gap-3">
          <AlertCircle size={20} className="text-longo shrink-0 mt-0.5" />
          <p className="text-sm text-longo">{error}</p>
        </div>
      )}
    </div>
  );
}
