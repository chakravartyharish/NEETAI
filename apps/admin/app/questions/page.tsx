'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { QuestionsService, type QuestionFilters } from '../../lib/services/questions';
import type { Database } from '@neet/database/types';

type Question = Database['public']['Tables']['neet_questions']['Row'];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState<QuestionFilters & { status: string }>({
    subject: undefined,
    year: undefined,
    difficulty: undefined,
    search: '',
    status: 'all'
  });

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert UI filters to API filters
        const apiFilters: QuestionFilters = {
          subject: filters.subject,
          year: filters.year,
          difficulty: filters.difficulty,
          search: filters.search || undefined,
          limit: 50,
        };

        const data = await QuestionsService.getQuestions(apiFilters);
        setQuestions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [filters]);

  // Since filtering is now done on the backend, we use questions directly
  const filteredQuestions = questions;

  const stats = useMemo(() => {
    return {
      total: questions.length,
      approved: questions.filter(q => q.analytics?.expert_insights?.includes('Approved by admin')).length,
      pending: questions.filter(q => !q.analytics || !q.analytics.expert_insights).length,
      needsReview: questions.filter(q => q.analytics?.expert_insights?.includes('Needs review')).length,
      rejected: questions.filter(q => q.analytics?.expert_insights?.includes('Rejected')).length,
    };
  }, [questions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'needs_review': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const updateQuestionStatus = async (questionId: string, action: 'approve' | 'reject' | 'review') => {
    try {
      let insights: string[] = [];

      switch (action) {
        case 'approve':
          insights = ['Approved by admin'];
          break;
        case 'reject':
          insights = ['Rejected'];
          break;
        case 'review':
          insights = ['Needs review'];
          break;
      }

      await QuestionsService.updateQuestion(questionId, {
        analytics: {
          average_solve_time: 0,
          global_success_rate: 0,
          attempt_count: 0,
          common_mistakes: [],
          expert_insights: insights,
        }
      });

      // Reload questions
      const apiFilters: QuestionFilters = {
        subject: filters.subject,
        year: filters.year,
        difficulty: filters.difficulty,
        search: filters.search || undefined,
        limit: 50,
      };
      const data = await QuestionsService.getQuestions(apiFilters);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to update question status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update question');
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      await QuestionsService.deleteQuestion(questionId);

      // Remove from local state
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
    } catch (err) {
      console.error('Failed to delete question:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  ← Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Question Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Export Questions
              </Button>
              <Button size="sm">
                Add Question
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.needsReview}</p>
            <p className="text-sm text-gray-600">Needs Review</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters & Question List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.subject || 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value === 'all' ? undefined : e.target.value as 'Physics' | 'Chemistry' | 'Biology' }))}
                  >
                    <option value="all">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.difficulty || 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value === 'all' ? undefined : parseInt(e.target.value) }))}
                  >
                    <option value="all">All Levels</option>
                    <option value="1">1 (Easy)</option>
                    <option value="2">2</option>
                    <option value="3">3 (Medium)</option>
                    <option value="4">4</option>
                    <option value="5">5 (Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.year || 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value === 'all' ? undefined : parseInt(e.target.value) }))}
                  >
                    <option value="all">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Questions ({loading ? '...' : filteredQuestions.length})
                </h2>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                  <p className="text-red-700">Error: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-red-600 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading questions...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-6 cursor-pointer transition-colors ${
                      selectedQuestion?.id === question.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            Q{question.questionNumber}
                          </span>
                          <span className="text-sm text-blue-600">
                            {question.subject}
                          </span>
                          <span className={`text-sm font-medium ${getComplexityColor(question.complexity)}`}>
                            {question.complexity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {question.questionText}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                        {question.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Source: {question.yearPaper}</span>
                        <span>Confidence: {Math.round(question.confidence * 100)}%</span>
                        {question.hasMath && <span>📊 Math</span>}
                        {question.hasImage && <span>🖼️ Image</span>}
                      </div>
                      <span>
                        {new Date(question.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

                  {filteredQuestions.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No questions found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Question Details */}
          <div>
            {selectedQuestion ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Question Details
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                      {isEditing && (
                        <Button size="sm">
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        Question #{selectedQuestion.questionNumber}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuestion.status)}`}>
                        {selectedQuestion.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Subject:</span>
                        <span className="ml-2 font-medium">{selectedQuestion.subject}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Complexity:</span>
                        <span className={`ml-2 font-medium ${getComplexityColor(selectedQuestion.complexity)}`}>
                          {selectedQuestion.complexity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Year:</span>
                        <span className="ml-2 font-medium">{selectedQuestion.yearPaper}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <span className="ml-2 font-medium">{Math.round(selectedQuestion.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    {isEditing ? (
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        rows={4}
                        defaultValue={selectedQuestion.questionText}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedQuestion.questionText}
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {Object.entries(selectedQuestion.options).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            selectedQuestion.correctAnswer === key
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {key}
                          </span>
                          {isEditing ? (
                            <input
                              type="text"
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
                              defaultValue={value}
                            />
                          ) : (
                            <span className="flex-1 text-sm text-gray-900">{value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    {isEditing ? (
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        {Object.keys(selectedQuestion.options).map(key => (
                          <option key={key} value={key} selected={selectedQuestion.correctAnswer === key}>
                            {key}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-green-600">
                        {selectedQuestion.correctAnswer}
                      </p>
                    )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                    {isEditing ? (
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        rows={3}
                        defaultValue={selectedQuestion.explanation}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedQuestion.explanation || 'No explanation provided'}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      {selectedQuestion.status !== 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => updateQuestionStatus(selectedQuestion.id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}

                      {selectedQuestion.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuestionStatus(selectedQuestion.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}

                      {selectedQuestion.status !== 'needs_review' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuestionStatus(selectedQuestion.id, 'needs_review')}
                        >
                          Flag for Review
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteQuestion(selectedQuestion.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Select a question to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}