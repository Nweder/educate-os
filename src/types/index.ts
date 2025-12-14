// User
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: 'User' | 'Admin';
  enabled: boolean;
  openAiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Roadmap
export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description: string;
  duration: number; // days
  createdAt: Date;
  updatedAt: Date;
}

export interface RoadmapDay {
  id: string;
  roadmapId: string;
  dayNumber: number;
  title: string;
  goals: string;
  topics: string[];
  expectedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: string[];
  notes: string;
  createdAt: Date;
}

// Skills
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  proficiencyLevel: number; // 0-100
  createdAt: Date;
}

export interface SkillDependency {
  id: string;
  skillId: string;
  dependsOnSkillId: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiencyLevel: number; // 0-100
  confidence: number; // 0-100
  reviewCount: number;
  lastReviewDate?: Date;
  updatedAt: Date;
}

// Exercises
export interface Exercise {
  id: string;
  roadmapDayId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  languages: ('python' | 'csharp')[];
  starterCode: {
    python?: string;
    csharp?: string;
  };
  createdAt: Date;
}

export interface ExerciseTestCase {
  id: string;
  exerciseId: string;
  name: string;
  visible: boolean;
  input?: string;
  expectedOutput: string;
  language: 'python' | 'csharp';
  createdAt: Date;
}

// Submissions
export interface CodeSubmission {
  id: string;
  userId: string;
  exerciseId: string;
  roadmapDayId: string;
  code: string;
  language: 'python' | 'csharp';
  status: 'submitted' | 'testing' | 'passed' | 'failed';
  submittedAt: Date;
}

export interface SubmissionResult {
  id: string;
  submissionId: string;
  testCaseId: string;
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number; // ms
}

// Study Sessions
export interface StudySession {
  id: string;
  userId: string;
  roadmapDayId: string;
  exerciseId?: string;
  startTime: Date;
  endTime?: Date;
  frictionReason?: 'too_hard' | 'unclear_next_step' | 'tired' | 'missing_resource';
  notes?: string;
}

// Evidence
export interface EvidenceItem {
  id: string;
  userId: string;
  skillId: string;
  roadmapDayId: string;
  submissionId: string;
  reflection: string;
  createdAt: Date;
}

// AI Response
export interface AITutorResponse {
  diagnosis: string;
  hint_level_1: string;
  hint_level_2: string;
  minimal_fix: string;
  concepts_to_review: string[];
  confidence: number;
}
