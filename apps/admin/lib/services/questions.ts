import { supabase } from '@neet/database'
import type { Database } from '@neet/database/types'

type Question = Database['public']['Tables']['neet_questions']['Row']
type QuestionInsert = Database['public']['Tables']['neet_questions']['Insert']
type QuestionUpdate = Database['public']['Tables']['neet_questions']['Update']

export interface QuestionFilters {
  subject?: 'Physics' | 'Chemistry' | 'Biology'
  year?: number
  difficulty?: number
  search?: string
  status?: 'pending' | 'approved' | 'rejected'
  limit?: number
  offset?: number
}

export interface QuestionStats {
  total: number
  bySubject: Record<string, number>
  byDifficulty: Record<string, number>
  byYear: Record<string, number>
  averageSuccessRate: number
}

export class QuestionsService {
  static async getQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
    let query = supabase
      .from('neet_questions')
      .select('*')

    // Apply filters
    if (filters.subject) {
      query = query.eq('subject', filters.subject)
    }

    if (filters.year) {
      query = query.eq('year', filters.year)
    }

    if (filters.difficulty) {
      query = query.eq('difficulty->level', filters.difficulty)
    }

    if (filters.search) {
      query = query.ilike('question_text', `%${filters.search}%`)
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
    }

    // Order by creation date
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`)
    }

    return data || []
  }

  static async getQuestionById(id: string): Promise<Question | null> {
    const { data, error } = await supabase
      .from('neet_questions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Question not found
      }
      throw new Error(`Failed to fetch question: ${error.message}`)
    }

    return data
  }

  static async createQuestion(question: QuestionInsert): Promise<Question> {
    const { data, error } = await supabase
      .from('neet_questions')
      .insert(question)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create question: ${error.message}`)
    }

    return data
  }

  static async updateQuestion(id: string, updates: QuestionUpdate): Promise<Question> {
    const { data, error } = await supabase
      .from('neet_questions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update question: ${error.message}`)
    }

    return data
  }

  static async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase
      .from('neet_questions')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete question: ${error.message}`)
    }
  }

  static async getQuestionStats(): Promise<QuestionStats> {
    const { data, error } = await supabase
      .from('neet_questions')
      .select('subject, year, difficulty, analytics')

    if (error) {
      throw new Error(`Failed to fetch question stats: ${error.message}`)
    }

    const questions = data || []

    // Calculate statistics
    const bySubject = questions.reduce((acc, q) => {
      acc[q.subject] = (acc[q.subject] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byDifficulty = questions.reduce((acc, q) => {
      const level = q.difficulty?.level || 1
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byYear = questions.reduce((acc, q) => {
      acc[q.year] = (acc[q.year] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalSuccessRate = questions.reduce((sum, q) => {
      return sum + (q.analytics?.global_success_rate || 0)
    }, 0)

    return {
      total: questions.length,
      bySubject,
      byDifficulty,
      byYear,
      averageSuccessRate: questions.length > 0 ? totalSuccessRate / questions.length : 0,
    }
  }

  static async searchQuestions(query: string, limit = 10): Promise<Question[]> {
    const { data, error } = await supabase
      .from('neet_questions')
      .select('*')
      .or(`question_text.ilike.%${query}%, concept_tags.cs.{${query}}`)
      .limit(limit)
      .order('trending_score', { ascending: false })

    if (error) {
      throw new Error(`Failed to search questions: ${error.message}`)
    }

    return data || []
  }

  // Batch operations for OCR processing
  static async createQuestionsFromOCR(questions: QuestionInsert[]): Promise<Question[]> {
    const { data, error } = await supabase
      .from('neet_questions')
      .insert(questions)
      .select()

    if (error) {
      throw new Error(`Failed to bulk create questions: ${error.message}`)
    }

    return data || []
  }

  static async updateQuestionAnalytics(
    id: string,
    analytics: Partial<Question['analytics']>
  ): Promise<Question> {
    const { data: existing } = await supabase
      .from('neet_questions')
      .select('analytics')
      .eq('id', id)
      .single()

    const mergedAnalytics = {
      ...existing?.analytics,
      ...analytics,
    }

    const { data, error } = await supabase
      .from('neet_questions')
      .update({
        analytics: mergedAnalytics,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update question analytics: ${error.message}`)
    }

    return data
  }

  // Get questions for review (pending approval)
  static async getPendingQuestions(limit = 50): Promise<Question[]> {
    // For now, we'll consider questions without proper analytics as pending
    const { data, error } = await supabase
      .from('neet_questions')
      .select('*')
      .or('analytics.is.null,analytics->global_success_rate.is.null')
      .limit(limit)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch pending questions: ${error.message}`)
    }

    return data || []
  }

  // Approve a question (update analytics to mark as reviewed)
  static async approveQuestion(id: string): Promise<Question> {
    const { data, error } = await supabase
      .from('neet_questions')
      .update({
        analytics: {
          average_solve_time: 0,
          global_success_rate: 0,
          attempt_count: 0,
          common_mistakes: [],
          expert_insights: ['Approved by admin'],
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to approve question: ${error.message}`)
    }

    return data
  }
}