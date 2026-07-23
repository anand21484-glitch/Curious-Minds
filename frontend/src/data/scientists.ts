import raw from './scientists.json';

export type Scientist = {
  id: string;
  name: string;
  field: string;
  years: string;
  region: string;
  tagline: string;
  story: string;
  fun_fact: string;
  achievement: string;
  quote: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export const scientists = raw as Scientist[];

export function getScientist(id: string): Scientist | undefined {
  return scientists.find((s) => s.id === id);
}

export function getScientistsByField(fieldId: string): Scientist[] {
  return scientists.filter((s) => s.field === fieldId);
}
