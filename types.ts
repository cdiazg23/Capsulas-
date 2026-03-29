
export type UserRole = 'admin' | 'user';
export type SubscriptionStatus = 'trialing' | 'active' | 'expired' | 'canceled';


export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email?: string;
  university?: string;
  studentLevel?: string;
  avatarUrl?: string;
  subscription_status?: SubscriptionStatus;
  trial_ends_at?: string;
  current_period_end?: string;
  plan_id?: string;
}


export interface LegalConcept {
  id: string;
  concept: string;
  category: string;
  subcategory: string;
  definitionSimple: string;
  realExample: string;
  regulation: string;
  videoUrl: string;
  keyPoints?: string[];
}

export interface RevisedJurisprudence {
  id: string;
  concept_id: string;
  concept_name: string;
  report: string;
  analysis: string;
  created_at: string;
}

export interface MasterClass {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: string;
  category?: string;
  professor?: string;
  created_at: string;
}

export type ViewType = 'landing' | 'dashboard' | 'explorer' | 'detail' | 'admin' | 'profile' | 'login' | 'library' | 'pricing' | 'flashcards' | 'community' | 'masterclasses';

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
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_end: string | null;
  plan_id: string | null;
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
