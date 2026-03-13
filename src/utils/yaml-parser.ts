import yaml from 'js-yaml';
import type { PlanoTreino, Semana, Treino, Categoria, DiaSemana } from '../types/plano';

interface RawTreino {
  data: string;
  dia: string;
  categoria: string;
  tipo?: string;
  descricao: string;
}

interface RawSemana {
  semana: number;
  treinos: RawTreino[];
}

interface RawPlano {
  plano: {
    nome: string;
    duracao_semanas: number;
  };
  semanas: RawSemana[];
}

const CATEGORIAS_VALIDAS: Categoria[] = ['Corrida', 'Musculação', 'Descanso', 'Longo'];
const DIAS_VALIDOS: DiaSemana[] = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

export function parseYaml(content: string): PlanoTreino {
  const raw = yaml.load(content) as RawPlano;

  if (!raw?.plano?.nome || !raw?.semanas?.length) {
    throw new Error('YAML inválido: campos "plano.nome" e "semanas" são obrigatórios.');
  }

  const semanas: Semana[] = raw.semanas.map((rawSemana) => {
    if (!rawSemana.semana || !rawSemana.treinos?.length) {
      throw new Error(`Semana inválida: cada semana precisa de "semana" e "treinos".`);
    }

    const treinos: Treino[] = rawSemana.treinos.map((rawTreino, idx) => {
      const categoria = rawTreino.categoria as Categoria;
      if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        throw new Error(
          `Categoria inválida "${rawTreino.categoria}" na semana ${rawSemana.semana}. ` +
          `Use: ${CATEGORIAS_VALIDAS.join(', ')}`
        );
      }

      const dia = rawTreino.dia as DiaSemana;
      if (!DIAS_VALIDOS.includes(dia)) {
        throw new Error(
          `Dia inválido "${rawTreino.dia}" na semana ${rawSemana.semana}. ` +
          `Use: ${DIAS_VALIDOS.join(', ')}`
        );
      }

      return {
        id: `s${rawSemana.semana}-${idx}`,
        data: rawTreino.data,
        dia,
        categoria,
        tipo: rawTreino.tipo || '',
        descricao: rawTreino.descricao,
        status: 'pendente' as const,
      };
    });

    return {
      semana: rawSemana.semana,
      treinos,
    };
  });

  return {
    plano: {
      nome: raw.plano.nome,
      duracao_semanas: raw.plano.duracao_semanas || semanas.length,
    },
    semanas,
  };
}
