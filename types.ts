
export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  role: UserRole;
  name: string;
  university?: string;
  studentLevel?: string;
  avatarUrl?: string;
}

export interface LegalConcept {
  id: string;
  concept: string;
  category: string;
  subcategory: string;
  definitionSimple: string;
  realExample: string;
  regulation: string;
  jurisprudence: string;
  videoUrl: string;
}

export type ViewType = 'landing' | 'dashboard' | 'explorer' | 'detail' | 'admin' | 'profile' | 'login' | 'library' | 'pricing';

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  points: number;
  streak: number;
  learnedConcepts: number;
  completedQuizzes: number;
}
