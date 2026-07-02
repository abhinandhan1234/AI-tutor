export interface UserProfile {
  name: string;
  email: string;
  streak: number;
  loggedIn: boolean;
  overallProgress: number; // percentage
  modulesCompleted: number;
  totalModules: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isVisual?: boolean; // True for the special visualization card in tutor chat
}

export type ModuleStatus = 'completed' | 'active' | 'locked';

export interface CourseModule {
  id: string;
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  status: ModuleStatus;
  info?: string;
  completedDate?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  level: string;
  hint: string;
}

export interface RecentActivity {
  id: string;
  type: 'quiz' | 'chat' | 'module';
  title: string;
  detail: string;
  time: string;
}
