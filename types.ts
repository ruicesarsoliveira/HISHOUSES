
export enum HouseName {
  SantaTerezinha = 'Casa Santa Terezinha',
  SaoFrancisco = 'Casa São Francisco',
  SantoAgostinho = 'Casa Santo Agostinho',
  SantaRita = 'Casa Santa Rita'
}

export interface House {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ScoringCategory {
  id: string;
  label: string;
  defaultPoints: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string; // Opcional apenas para compatibilidade visual, mas obrigatório no cadastro
}

export interface PointRecord {
  id: string;
  houseId: string;
  studentName?: string;
  points: number;
  reason: string;
  teacherName: string;
  teacherRole: string;
  timestamp: number;
}

export type View = 'scoring' | 'transparency' | 'dashboard' | 'settings';
