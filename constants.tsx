
import { House, HouseName, ScoringCategory, User } from './types';

export const INITIAL_HOUSES: House[] = [
  { id: 'st', name: HouseName.SantaTerezinha, color: '#ef4444', icon: '🌹' },
  { id: 'sf', name: HouseName.SaoFrancisco, color: '#8b4513', icon: '🐾' },
  { id: 'sa', name: HouseName.SantoAgostinho, color: '#3b82f6', icon: '📖' },
  { id: 'sr', name: HouseName.SantaRita, color: '#a855f7', icon: '🐝' },
];

export const INITIAL_SCORING_CATEGORIES: ScoringCategory[] = [
  { id: 'task-complete', label: 'Tarefa Completa', defaultPoints: 10 },
  { id: 'participation', label: 'Participação em Aula', defaultPoints: 5 },
  { id: 'cleaning', label: 'Ajuda na Limpeza', defaultPoints: 15 },
  { id: 'delay', label: 'Atraso', defaultPoints: -5 },
  { id: 'uniform', label: 'Uniforme Incompleto', defaultPoints: -5 },
  { id: 'behavior', label: 'Mau Comportamento', defaultPoints: -10 },
];

export const USER_ROLES = {
  ADMIN: 'Administrador',
  COORDINATOR: 'Coordenador',
  COORD_TEAM: 'Equipe de Coordenação',
  TEACHER: 'Professor',
  INSPECTOR: 'Inspetor'
} as const;

export const TEACHER_ROLES = Object.values(USER_ROLES);

// Usuários iniciais
export const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Administrador Geral', 
    email: 'admin@escola.com', 
    role: USER_ROLES.ADMIN, 
    password: '123' 
  },
  { 
    id: 'u2', 
    name: 'Rui Palomares', 
    email: 'rui.palomares@hisbsb.pro.br', 
    role: USER_ROLES.ADMIN, 
    password: '123' 
  },
  { 
    id: 'u3', 
    name: 'Coordenação Pedagógica', 
    email: 'coordenador@escola.com', 
    role: USER_ROLES.COORDINATOR, 
    password: '123' 
  },
  
  // Novos Coordenadores
  { id: 'c1', name: 'Ms. Talita Costa', email: 'talita.spindola@hisbsb.com.br', role: USER_ROLES.COORDINATOR, password: 'talita.spindola48' },
  { id: 'c2', name: 'Ms. Berta Biondi', email: 'berta.biondi@hisbsb.com.br', role: USER_ROLES.COORDINATOR, password: 'berta.biondi72' },
  { id: 'c3', name: 'Mr. Carlos Alberto', email: 'carlos.teles@hisbsb.com.br', role: USER_ROLES.COORDINATOR, password: 'carlos.teles16' },

  // Professores Cadastrados
  { id: 't1', name: 'Ms. Ávanny Dalmaschio', email: 'avanny.buzaid@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'avanny.buzaid42' },
  { id: 't2', name: 'Mr. Cadu Nerosky', email: 'carlos.nerosky@hisbsb.g12.br', role: USER_ROLES.TEACHER, password: 'carlos.nerosky87' },
  { id: 't3', name: 'Ms. Débora Rodrigues', email: 'debora.rodrigues@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'debora.rodrigues15' },
  { id: 't4', name: 'Mr. Caio Silvestre', email: 'caio.melo@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'caio.melo63' },
  { id: 't5', name: 'Ms. Giovanna Otero', email: 'giovanna.otero@hisbsb.com.br', role: USER_ROLES.TEACHER, password: 'giovanna.otero29' },
  { id: 't6', name: 'Ms. Jéssica Germano', email: 'jessica.germano@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'jessica.germano74' },
  { id: 't7', name: 'Mr. Jota', email: 'jose.junior@hisbsb.com.br', role: USER_ROLES.TEACHER, password: 'jose.junior51' },
  { id: 't8', name: 'Ms. Lídice Rodrigues', email: 'lidice.martins@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'lidice.martins36' },
  { id: 't9', name: 'Ms. Maíra Oliveira', email: 'maira.cordeiro@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'maira.cordeiro92' },
  { id: 't10', name: 'Ms. Duda Freitas', email: 'maria.freitas@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'maria.freitas18' },
  { id: 't11', name: 'Mr. Matheus Batista', email: 'matheus.machado@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'matheus.machado55' },
  { id: 't12', name: 'Mr. Nathan Simoes', email: 'nathan.castro@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'nathan.castro70' },
  { id: 't13', name: 'Mr. Octávio Augusto', email: 'octavio.ribeiro@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'octavio.ribeiro23' },
  { id: 't14', name: 'Mr. Olavo Carvalho', email: 'olavo.neves@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'olavo.neves81' },
  { id: 't15', name: 'Ms. Patricia Alonso', email: 'patricia.alonso@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'patricia.alonso47' },
  { id: 't16', name: 'Mr. Rodolfo Araya', email: 'rodolfo.araya@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'rodolfo.araya66' },
  { id: 't17', name: 'Ms. Sarah Isidório', email: 'sarah.isidorio@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'sarah.isidorio12' },
  { id: 't18', name: 'Mr. Sidnei Félix', email: 'sidnei.felix@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'sidnei.felix39' },
  { id: 't19', name: 'Ms. Tatiane Luiza da Silva', email: 'tatiane.silva@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'tatiane.silva84' },
  { id: 't20', name: 'Mr. Marlon Florencio', email: 'marlon.florencio@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'marlon.florencio27' },
  { id: 't21', name: 'Mr. Galileu Henrique', email: 'galileu.henrique@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'galileu.henrique58' },
  { id: 't22', name: 'Ms. Raquel Santos', email: 'raquel.bracarense@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'raquel.bracarense31' },
  { id: 't23', name: 'Mr. Hudá Augusto', email: 'huda.cardoso@hisbsb.pro.br', role: USER_ROLES.TEACHER, password: 'huda.cardoso95' }
];
