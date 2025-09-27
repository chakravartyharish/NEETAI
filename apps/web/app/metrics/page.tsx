'use client'

import { useState, useEffect } from 'react'
import type { MetricsData } from '@neet/analytics'

interface MetricCard {
  title: string
  value: string | number
  icon: string
  color: 'green' | 'red' | 'yellow' | 'blue'
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/metrics/dashboard?days=7')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setMetrics(data.data)
        setLastUpdated(new Date(data.metadata.generatedAt))
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to fetch metrics')
      }
    } catch (err) {
      console.error('Error fetching metrics:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    
    // Refresh metrics every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getMetricCards = (): MetricCard[] => {
    if (!metrics) return []

    return [
      {
        title: 'Workflow Success Rate',
        value: `${metrics.workflowMetrics.successRate}%`,
        icon: '🔄',
        color: metrics.workflowMetrics.successRate >= 90 ? 'green' : 
               metrics.workflowMetrics.successRate >= 70 ? 'yellow' : 'red'
      },
      {
        title: 'Total Workflow Runs',
        value: metrics.workflowMetrics.totalRuns,
        icon: '⚡',
        color: 'blue'
      },
      {
        title: 'Failed Workflows',
        value: metrics.workflowMetrics.failedRuns,
        icon: '❌',
        color: metrics.workflowMetrics.failedRuns > 5 ? 'red' : 'green'
      },
      {
        title: 'Avg Run Time',
        value: `${metrics.workflowMetrics.averageRunTime}s`,
        icon: '⏱️',
        color: metrics.workflowMetrics.averageRunTime > 300 ? 'red' : 'green'
      },
      {
        title: 'Deployment Success',
        value: `${metrics.deploymentMetrics.successRate}%`,
        icon: '🚀',
        color: metrics.deploymentMetrics.successRate >= 95 ? 'green' : 
               metrics.deploymentMetrics.successRate >= 80 ? 'yellow' : 'red'
      },
      {
        title: 'Monthly Active Users',
        value: metrics.userMetrics.monthlyActiveUsers.toLocaleString(),
        icon: '👥',
        color: 'blue'
      },
      {
        title: 'AI Interactions',
        value: metrics.aiMetrics.totalInteractions.toLocaleString(),
        icon: '🤖',
        color: 'blue'
      },
      {
        title: 'User Satisfaction',
        value: `${metrics.aiMetrics.userSatisfaction}%`,
        icon: '⭐',
        color: metrics.aiMetrics.userSatisfaction >= 80 ? 'green' : 
               metrics.aiMetrics.userSatisfaction >= 60 ? 'yellow' : 'red'
      }
    ]
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'red':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'blue':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Metrics Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Metrics Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Metrics</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchMetrics}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const metricCards = getMetricCards()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Metrics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Last updated: {lastUpdated?.toLocaleString() || 'Unknown'}
            </p>
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-lg border p-6 transition-all hover:shadow-lg ${getColorClasses(card.color)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <h3 className="text-sm font-medium opacity-75">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Workflow Insights */}
        {metrics?.workflowMetrics && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Workflow Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                <div className="space-y-2">
                  {metrics.workflowMetrics.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Critical Failures</h3>
                <div className="space-y-3">
                  {metrics.workflowMetrics.criticalFailures.length > 0 ? (
                    metrics.workflowMetrics.criticalFailures.map((failure, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded border border-red-200">
                        <div className="font-medium text-red-800">{failure.workflowName}</div>
                        <div className="text-sm text-red-600 mt-1">{failure.error}</div>
                        <div className="text-xs text-red-500 mt-1">
                          {new Date(failure.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-green-600 text-sm">✅ No critical failures in the last 7 days</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Targets */}
        {metrics?.performanceTargets && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Performance Targets</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.performanceTargets.scoreImprovement}%</div>
                  <div className="text-sm text-gray-600">Score Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.performanceTargets.neetPredictionAccuracy}%</div>
                  <div className="text-sm text-gray-600">NEET Prediction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.performanceTargets.studentEngagement}min</div>
                  <div className="text-sm text-gray-600">Avg Session</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.performanceTargets.retentionRate}%</div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.performanceTargets.apiLatency}ms</div>
                  <div className="text-sm text-gray-600">API Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.performanceTargets.availability}%</div>
                  <div className="text-sm text-gray-600">Availability</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}