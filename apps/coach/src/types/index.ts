// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  institute_id?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'institute_owner' | 'teacher' | 'admin_staff' | 'parent';

export interface Institute {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  subscription_tier: SubscriptionTier;
  custom_domain?: string;
  branding: InstituteBranding;
  settings: InstituteSettings;
  created_at: string;
  updated_at: string;
}

export type SubscriptionTier = 'white_label' | 'integration' | 'basic';

export interface InstituteBranding {
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  custom_css?: string;
}

export interface InstituteSettings {
  timezone: string;
  academic_year_start: string;
  academic_year_end: string;
  default_batch_size: number;
  allow_parent_access: boolean;
  enable_notifications: boolean;
}

// Student Management Types
export interface Student {
  id: string;
  institute_id: string;
  registration_number: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  parent_contact: ParentContact;
  batch_id?: string;
  enrollment_date: string;
  status: StudentStatus;
  performance_metrics: StudentPerformanceMetrics;
  created_at: string;
  updated_at: string;
}

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'dropped_out';

export interface ParentContact {
  father_name?: string;
  father_phone?: string;
  father_email?: string;
  mother_name?: string;
  mother_phone?: string;
  mother_email?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
}

export interface StudentPerformanceMetrics {
  overall_score: number;
  physics_score: number;
  chemistry_score: number;
  biology_score: number;
  total_tests_taken: number;
  average_time_per_question: number;
  predicted_neet_score: number;
  last_test_date?: string;
}

// Batch and Teacher Types
export interface Batch {
  id: string;
  institute_id: string;
  name: string;
  description?: string;
  teacher_id: string;
  subject: Subject;
  schedule: BatchSchedule[];
  max_students: number;
  current_students: number;
  start_date: string;
  end_date: string;
  status: BatchStatus;
  created_at: string;
  updated_at: string;
}

export type Subject = 'physics' | 'chemistry' | 'biology' | 'all';
export type BatchStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface BatchSchedule {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  room?: string;
}

export interface Teacher {
  id: string;
  institute_id: string;
  user_id: string;
  employee_id: string;
  specialization: Subject[];
  qualifications: string;
  experience_years: number;
  bio?: string;
  contact_info: TeacherContact;
  performance_metrics: TeacherPerformanceMetrics;
  created_at: string;
  updated_at: string;
}

export interface TeacherContact {
  phone?: string;
  emergency_contact?: string;
  address?: string;
}

export interface TeacherPerformanceMetrics {
  average_student_rating: number;
  total_students_taught: number;
  average_student_improvement: number;
  classes_conducted: number;
  last_review_date?: string;
}

// Assessment and Test Types
export interface Test {
  id: string;
  institute_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  subject: Subject;
  difficulty_level: DifficultyLevel;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
  instructions?: string;
  scheduled_date?: string;
  status: TestStatus;
  questions: TestQuestion[];
  assigned_batches: string[];
  created_at: string;
  updated_at: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TestStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface TestQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  marks: number;
  difficulty: DifficultyLevel;
  topics: string[];
}

export interface TestAttempt {
  id: string;
  test_id: string;
  student_id: string;
  started_at: string;
  completed_at?: string;
  time_taken_minutes?: number;
  score: number;
  percentage: number;
  answers: TestAnswer[];
  status: AttemptStatus;
}

export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned';

export interface TestAnswer {
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
  time_taken_seconds: number;
}

// Analytics and Reporting Types
export interface AnalyticsData {
  student_performance: StudentAnalytics;
  batch_performance: BatchAnalytics;
  test_analytics: TestAnalytics;
  institute_metrics: InstituteMetrics;
}

export interface StudentAnalytics {
  total_students: number;
  active_students: number;
  average_performance: number;
  top_performers: StudentPerformanceMetrics[];
  improvement_trends: PerformanceTrend[];
}

export interface BatchAnalytics {
  total_batches: number;
  active_batches: number;
  batch_performance_comparison: BatchPerformance[];
  subject_wise_performance: SubjectPerformance[];
}

export interface TestAnalytics {
  total_tests_conducted: number;
  average_scores: number;
  question_difficulty_analysis: QuestionAnalysis[];
  time_spent_patterns: TimeSpentPattern[];
}

export interface InstituteMetrics {
  total_revenue: number;
  student_retention_rate: number;
  teacher_performance_rating: number;
  parent_satisfaction_score: number;
}

export interface PerformanceTrend {
  date: string;
  score: number;
  subject: Subject;
}

export interface BatchPerformance {
  batch_id: string;
  batch_name: string;
  average_score: number;
  total_students: number;
  completion_rate: number;
}

export interface SubjectPerformance {
  subject: Subject;
  average_score: number;
  total_tests: number;
  improvement_rate: number;
}

export interface QuestionAnalysis {
  question_id: string;
  difficulty: DifficultyLevel;
  success_rate: number;
  average_time_taken: number;
}

export interface TimeSpentPattern {
  hour_of_day: number;
  average_questions_answered: number;
  average_accuracy: number;
}

// Communication Types
export interface Notification {
  id: string;
  institute_id: string;
  recipient_id: string;
  recipient_type: 'student' | 'teacher' | 'parent' | 'all';
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  is_read: boolean;
  action_url?: string;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
}

export type NotificationType = 'announcement' | 'reminder' | 'alert' | 'achievement' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ParentCommunication {
  id: string;
  student_id: string;
  parent_contact_type: 'father' | 'mother' | 'guardian';
  subject: string;
  message: string;
  communication_type: CommunicationType;
  status: CommunicationStatus;
  scheduled_at?: string;
  sent_at?: string;
  response?: string;
  created_at: string;
}

export type CommunicationType = 'email' | 'sms' | 'whatsapp' | 'in_app';
export type CommunicationStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'failed' | 'replied';

// Content Management Types
export interface StudyMaterial {
  id: string;
  institute_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  content_type: ContentType;
  file_url: string;
  file_size: number;
  subject: Subject;
  topics: string[];
  difficulty_level: DifficultyLevel;
  assigned_batches: string[];
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type ContentType = 'pdf' | 'video' | 'audio' | 'image' | 'document';

// Billing and Subscription Types
export interface BillingInfo {
  id: string;
  institute_id: string;
  subscription_tier: SubscriptionTier;
  billing_cycle: BillingCycle;
  monthly_fee: number;
  setup_fee: number;
  current_period_start: string;
  current_period_end: string;
  status: BillingStatus;
  payment_method: PaymentMethod;
  next_billing_date: string;
  total_students: number;
  usage_metrics: UsageMetrics;
}

export type BillingCycle = 'monthly' | 'annual';
export type BillingStatus = 'active' | 'past_due' | 'cancelled' | 'trialing';
export type PaymentMethod = 'card' | 'bank_transfer' | 'upi' | 'wallet';

export interface UsageMetrics {
  api_calls_count: number;
  storage_used_gb: number;
  active_users_count: number;
  tests_conducted_count: number;
}

export interface Invoice {
  id: string;
  institute_id: string;
  invoice_number: string;
  billing_period_start: string;
  billing_period_end: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  due_date: string;
  paid_at?: string;
  payment_intent_id?: string;
  created_at: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

// Form Types
export interface InstituteRegistrationForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  admin_name: string;
  admin_email: string;
  subscription_tier: SubscriptionTier;
  branding: Partial<InstituteBranding>;
  settings: Partial<InstituteSettings>;
}

export interface StudentRegistrationForm {
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  parent_contact: ParentContact;
  batch_id?: string;
}

export interface TestCreationForm {
  title: string;
  description?: string;
  subject: Subject;
  difficulty_level: DifficultyLevel;
  duration_minutes: number;
  instructions?: string;
  scheduled_date?: string;
  assigned_batches: string[];
  questions: Omit<TestQuestion, 'id'>[];
}