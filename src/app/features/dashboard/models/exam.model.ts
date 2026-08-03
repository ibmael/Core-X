export interface Exam {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number; // in minutes
  questionsCount: number;
  diplomaId: string;
  diploma?: {
    id: string;
    title: string;
  };
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // UI state extensions
  status?: 'new' | 'completed' | 'in-progress';
  score?: number;
}

export interface ExamResponsePayload {
  data: Exam[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ExamsApiResponse {
  status: boolean;
  code: number;
  payload: ExamResponsePayload;
}

export interface SingleExamApiResponse {
  exam: Exam;
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  text: string;
  examId: string;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  answers: AnswerOption[];
  exam?: {
    id: string;
    title: string;
  };
}

export interface QuestionsApiResponse {
  status: boolean;
  code: number;
  payload: {
    questions: Question[];
  };
}

export interface SubmitAnswerPayload {
  questionId: string;
  answerId: string;
}

export interface SubmitExamRequest {
  examId: string;
  answers: SubmitAnswerPayload[];
  startedAt: string;
}

export interface SubmissionAnalyticsItem {
  questionId: string;
  questionText: string;
  selectedAnswer: Partial<AnswerOption>;
  isCorrect: boolean;
  correctAnswer: Partial<AnswerOption>;
}

export interface SubmissionData {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  exam?: {
    id: string;
    title: string;
    duration: number;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionApiResponse {
  status: boolean;
  code: number;
  payload: {
    submission: SubmissionData;
    analytics: SubmissionAnalyticsItem[];
  };
}
