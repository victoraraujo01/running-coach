import type { Categoria } from '../types/plano';

const CATEGORY_CONFIG: Record<Categoria, { bg: string; text: string; label: string }> = {
  'Corrida': { bg: 'bg-corrida/15', text: 'text-corrida', label: 'Corrida' },
  'Musculação': { bg: 'bg-musculacao/15', text: 'text-musculacao', label: 'Musculação' },
  'Descanso': { bg: 'bg-descanso/15', text: 'text-descanso', label: 'Descanso' },
  'Longo': { bg: 'bg-longo/15', text: 'text-longo', label: 'Longo' },
};

interface CategoryBadgeProps {
  categoria: Categoria;
}

export function CategoryBadge({ categoria }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[categoria];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
