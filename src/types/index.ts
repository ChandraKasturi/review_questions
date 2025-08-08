// Authentication types
export interface LoginRequest {
  mobilenumberoremail: string;
  password: string;
}

export interface LoginResponse {
  Message: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  sessionToken: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

// Question types
export interface Question {
  _id: string;
  question: string;
  model_answer: string;
  grading_criteria: string;
  explaination: string;
  question_image: string;
  explaination_image: string;
  question_type: 'SHORT_ANSWER' | 'LONG_ANSWER' | 'VERY_SHORT_ANSWER' | 'MCQ' | 'TRUEFALSE' | 'CASE_STUDY';
  subject: string;
  topic: string;
  subtopic: string;
  level: number;
  questionset: string;
  marks: number;
  created_at: string;
  updated_at?: string; // Format: 2025-01-31T07:15:30.123+05:30
  ignore: boolean;
  source_image_url: string;
  source_image_view_url: string;
  source_image_name: string;
  source_folder_name: string;
  source_directory_url: string;
  // MCQ specific fields
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctanswer?: string; // "option1", "option2", "option3", or "option4"
}

export interface FetchQuestionsRequest {
  subject: string;
  topic: string;
}

export interface FetchQuestionsResponse {
  questions: Question[];
  total_count: number;
  subject: string;
  topic: string;
}

export interface UpdateQuestionRequest {
  question_data: Question;
}

export interface UpdateQuestionResponse {
  success: boolean;
  message: string;
  document_id: string;
  updated_at?: string;
}

// UI types
export interface QuestionSelectionForm {
  subject: string;
  topic: string;
}

export interface ImageCropData {
  x: number;
  y: number;
  width: number;
  height: number;
}