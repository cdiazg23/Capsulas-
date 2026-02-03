
export type UserRole = 'admin' | 'founder' | 'user';

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

export type ViewType = 'landing' | 'dashboard' | 'explorer' | 'detail' | 'admin' | 'profile' | 'login' | 'library' | 'pricing' | 'flashcards' | 'community';

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  points: number;
  streak: number;
  learnedConcepts: number;
  completedQuizzes: number;
  consultationsToday: number;
  consultationsMonth: number;
  lastConsultationAt?: string;
}

export interface ActivityLog {
  id?: string;
  user_id?: string;
  type: 'level_up' | 'concept' | 'quiz' | 'achievement';
  description: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserMastery {
  user_id: string;
  concept_id: string;
  mastered_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  level: number;
  xp: number;
  next_level_xp: number;
  points: number;
  streak: number;
  learned_concepts: number;
  completed_quizzes: number;
  consultations_today: number;
  consultations_month: number;
  last_consultation_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunitySubmission {
  id: string;
  user_id: string;
  type: 'inquiry' | 'feedback' | 'suggestion';
  title: string;
  content: string;
  country: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}
