// Analytics Types - PRD v3 Requirements + Enhanced Workflow Metrics

export interface UserAction {
  userId: string
  action: string
  properties?: Record<string, any>
  timestamp?: Date
  sessionId?: string
}

export interface WorkflowMetrics {
  totalRuns: number
  successRate: number
  failedRuns: number
  averageRunTime: number
  criticalFailures: Array<{
    workflowName: string
    error: string
    timestamp: string
    runId?: string
  }>
  recommendations: string[]
}

export interface DeploymentMetrics {
  totalDeployments: number
  successRate: number
  averageDeployTime: number
  lastDeployment: any
}

export interface MetricsData {
  userMetrics: {
    totalRegistrations: number
    monthlyActiveUsers: number
    premiumConversions: number
    retentionRates: {
      day1: number
      day7: number
      day30: number
      month3: number
    }
  }
  quizMetrics: {
    totalAttempts: number
    averageScore: number
    completionRate: number
    averageTimeSpent: number
  }
  aiMetrics: {
    totalInteractions: number
    averageResponseTime: number
    userSatisfaction: number
    costPerInteraction: number
  }
  workflowMetrics: WorkflowMetrics
  deploymentMetrics: DeploymentMetrics
  performanceTargets?: {
    scoreImprovement: number
    neetPredictionAccuracy: number
    studentEngagement: number
    retentionRate: number
    apiLatency: number
    availability: number
  }
  lastUpdated: Date
}
