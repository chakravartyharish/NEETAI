'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui/button';

interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: string;
  endTime?: string;
  result?: {
    questionsExtracted: number;
    pagesProcessed: number;
    averageConfidence: number;
    subjectBreakdown: {
      Physics: number;
      Chemistry: number;
      Biology: number;
    };
    processingTime: number;
    documentAnalysis: {
      isNEETFormat: boolean;
      contentQuality: string;
      estimatedQuestions: number;
    };
  };
  error?: string;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
  }>;
}

export default function ProcessingPage() {
  const [jobs, setJobs] = useState<ProcessingJob[]>([
    {
      id: '1',
      fileName: 'NEET_2024_Physics.pdf',
      status: 'completed',
      progress: 100,
      startTime: '2025-01-15T10:30:00Z',
      endTime: '2025-01-15T10:35:30Z',
      result: {
        questionsExtracted: 45,
        pagesProcessed: 15,
        averageConfidence: 87,
        subjectBreakdown: {
          Physics: 45,
          Chemistry: 0,
          Biology: 0,
        },
        processingTime: 330,
        documentAnalysis: {
          isNEETFormat: true,
          contentQuality: 'excellent',
          estimatedQuestions: 50,
        },
      },
      logs: [
        { timestamp: '10:30:05', level: 'info', message: 'Starting document analysis...' },
        { timestamp: '10:30:12', level: 'info', message: 'NEET format detected successfully' },
        { timestamp: '10:31:45', level: 'info', message: 'Extracted 45 questions from 15 pages' },
        { timestamp: '10:35:30', level: 'info', message: 'Processing completed successfully' },
      ],
    },
    {
      id: '2',
      fileName: 'NEET_2023_Chemistry.pdf',
      status: 'processing',
      progress: 65,
      startTime: '2025-01-15T11:00:00Z',
      logs: [
        { timestamp: '11:00:05', level: 'info', message: 'Starting document analysis...' },
        { timestamp: '11:00:15', level: 'info', message: 'NEET format detected successfully' },
        { timestamp: '11:02:30', level: 'info', message: 'Processing page 8 of 20...' },
      ],
    },
    {
      id: '3',
      fileName: 'NEET_2022_Biology.pdf',
      status: 'queued',
      progress: 0,
      startTime: '2025-01-15T11:15:00Z',
      logs: [
        { timestamp: '11:15:00', level: 'info', message: 'Job queued for processing' },
      ],
    },
  ]);

  const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status === 'processing' && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 5, 100);
          const newLogs = [...job.logs];

          if (Math.random() > 0.7) {
            newLogs.push({
              timestamp: new Date().toLocaleTimeString(),
              level: 'info',
              message: `Processing page ${Math.floor(newProgress / 5)} of 20...`
            });
          }

          if (newProgress >= 100) {
            return {
              ...job,
              status: 'completed' as const,
              progress: 100,
              endTime: new Date().toISOString(),
              result: {
                questionsExtracted: Math.floor(Math.random() * 50) + 30,
                pagesProcessed: 20,
                averageConfidence: Math.floor(Math.random() * 20) + 75,
                subjectBreakdown: {
                  Physics: 0,
                  Chemistry: Math.floor(Math.random() * 50) + 30,
                  Biology: 0,
                },
                processingTime: Math.floor(Math.random() * 300) + 200,
                documentAnalysis: {
                  isNEETFormat: true,
                  contentQuality: 'good',
                  estimatedQuestions: Math.floor(Math.random() * 60) + 40,
                },
              },
              logs: [...newLogs, {
                timestamp: new Date().toLocaleTimeString(),
                level: 'info',
                message: 'Processing completed successfully'
              }]
            };
          }

          return { ...job, progress: newProgress, logs: newLogs };
        }
        return job;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    return `${Math.floor(duration / 60)}m ${duration % 60}s`;
  };

  const cancelJob = (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
  };

  const retryJob = (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? {
        ...job,
        status: 'queued' as const,
        progress: 0,
        error: undefined,
        logs: [...job.logs, {
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: 'Job requeued for processing'
        }]
      } : job
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
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
                OCR Processing Status
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {jobs.filter(j => j.status === 'processing').length} processing, {jobs.filter(j => j.status === 'queued').length} queued
              </span>
              <Button size="sm">
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Processing Jobs</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-6 cursor-pointer transition-colors ${
                      selectedJob?.id === job.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {job.fileName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {(job.status === 'processing' || job.status === 'queued') && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              job.status === 'processing' ? 'bg-blue-600' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Started: {new Date(job.startTime).toLocaleTimeString()}</span>
                      <span>Duration: {formatDuration(job.startTime, job.endTime)}</span>
                    </div>

                    {job.result && (
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                        <span>{job.result.questionsExtracted} questions</span>
                        <span>{job.result.averageConfidence}% confidence</span>
                        <span>{job.result.pagesProcessed} pages</span>
                      </div>
                    )}

                    {job.status === 'processing' && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelJob(job.id);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {job.status === 'failed' && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            retryJob(job.id);
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            {selectedJob ? (
              <div className="space-y-6">
                {/* Job Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">File Name</label>
                      <p className="text-sm text-gray-900">{selectedJob.fileName}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <p className={`text-sm font-medium ${getStatusColor(selectedJob.status).replace('bg-', 'text-').replace('100', '600')}`}>
                        {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Started</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedJob.startTime).toLocaleString()}
                      </p>
                    </div>

                    {selectedJob.endTime && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Completed</label>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedJob.endTime).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-600">Duration</label>
                      <p className="text-sm text-gray-900">
                        {formatDuration(selectedJob.startTime, selectedJob.endTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                {selectedJob.result && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Questions Extracted</label>
                        <p className="text-2xl font-bold text-green-600">{selectedJob.result.questionsExtracted}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Avg. Confidence</label>
                        <p className="text-2xl font-bold text-blue-600">{selectedJob.result.averageConfidence}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Subject Breakdown</label>
                        <div className="space-y-1">
                          {Object.entries(selectedJob.result.subjectBreakdown).map(([subject, count]) => (
                            count > 0 && (
                              <div key={subject} className="flex justify-between text-sm">
                                <span>{subject}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Document Analysis</label>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>NEET Format</span>
                            <span className={selectedJob.result.documentAnalysis.isNEETFormat ? 'text-green-600' : 'text-red-600'}>
                              {selectedJob.result.documentAnalysis.isNEETFormat ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Content Quality</span>
                            <span className="capitalize">{selectedJob.result.documentAnalysis.contentQuality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Questions</span>
                            <span>{selectedJob.result.documentAnalysis.estimatedQuestions}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logs */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Logs</h2>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedJob.logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono">
                        <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                        <span className={`font-medium ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}:
                        </span>{' '}
                        <span className="text-gray-900">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}