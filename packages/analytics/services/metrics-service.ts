import { track } from '@vercel/analytics'
import { supabase } from '@neet/database'
import type { UserAction, MetricsData } from '../types'

// PRD v3 Specification: Advanced Analytics & Metrics
export class MetricsService {
  /**
   * Track user actions with Vercel Analytics and internal storage
   * PRD v3: Real-time performance tracking
   */
  async trackUserAction(action: UserAction): Promise<void> {
    // Send to Vercel Analytics for real-time insights
    track(action.action, {
      userId: action.userId,
      ...action.properties
    })

    // Store in database for detailed analytics
    await (supabase as any)
      .from('user_events')
      .insert({
        user_id: action.userId,
        event_name: action.action,
        event_properties: action.properties || {},
        session_id: action.sessionId,
        created_at: action.timestamp || new Date()
      })
  }

  /**
   * Track workflow events and performance for monitoring
   * Enhanced for addressing the 48% success rate issue
   */
  async trackWorkflowEvent(eventData: {
    workflowName: string
    status: 'started' | 'completed' | 'failed' | 'cancelled'
    duration?: number
    error?: string
    runId?: string
    branch?: string
    triggeredBy?: string
  }): Promise<void> {
    try {
      await (supabase as any)
        .from('workflow_events')
        .insert({
          workflow_name: eventData.workflowName,
          status: eventData.status,
          duration_ms: eventData.duration,
          error_message: eventData.error,
          run_id: eventData.runId,
          branch: eventData.branch,
          triggered_by: eventData.triggeredBy,
          created_at: new Date()
        })
    } catch (error) {
      console.error('Failed to track workflow event:', error)
    }
  }

  /**
   * Track deployment metrics and performance
   */
  async trackDeploymentEvent(deploymentData: {
    environment: 'staging' | 'production'
    status: 'started' | 'completed' | 'failed'
    duration?: number
    deploymentId?: string
    version?: string
    error?: string
  }): Promise<void> {
    try {
      await (supabase as any)
        .from('deployment_events')
        .insert({
          environment: deploymentData.environment,
          status: deploymentData.status,
          duration_ms: deploymentData.duration,
          deployment_id: deploymentData.deploymentId,
          version: deploymentData.version,
          error_message: deploymentData.error,
          created_at: new Date()
        })
    } catch (error) {
      console.error('Failed to track deployment event:', error)
    }
  }

  /**
   * Generate comprehensive workflow health metrics
   */
  async getWorkflowMetrics(dateRange: { from: Date; to: Date }) {
    try {
      const { data: workflows } = await (supabase as any)
        .from('workflow_events')
        .select('*')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false })

      if (!workflows || workflows.length === 0) {
        return {
          totalRuns: 0,
          successRate: 0,
          failedRuns: 0,
          averageRunTime: 0,
          criticalFailures: [],
          recommendations: ['No workflow data available in the selected range']
        }
      }

      const totalRuns = workflows.length
      const successfulRuns = workflows.filter((w: any) => w.status === 'completed').length
      const failedRuns = workflows.filter((w: any) => w.status === 'failed').length
      const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0

      const completedWorkflows = workflows.filter((w: any) => w.duration_ms > 0)
      const averageRunTime = completedWorkflows.length > 0
        ? completedWorkflows.reduce((acc: number, w: any) => acc + w.duration_ms, 0) / completedWorkflows.length
        : 0

      // Identify critical failure patterns
      const criticalFailures = workflows
        .filter((w: any) => w.status === 'failed')
        .slice(0, 5)
        .map((w: any) => ({
          workflowName: w.workflow_name,
          error: w.error_message,
          timestamp: w.created_at,
          runId: w.run_id
        }))

      // Generate recommendations
      const recommendations = this.generateWorkflowRecommendations(successRate, failedRuns, totalRuns)

      return {
        totalRuns,
        successRate: parseFloat(successRate.toFixed(1)),
        failedRuns,
        averageRunTime: Math.round(averageRunTime / 1000), // Convert to seconds
        criticalFailures,
        recommendations
      }
    } catch (error) {
      console.error('Failed to get workflow metrics:', error)
      return {
        totalRuns: 0,
        successRate: 0,
        failedRuns: 0,
        averageRunTime: 0,
        criticalFailures: [],
        recommendations: ['Error fetching workflow metrics']
      }
    }
  }

  /**
   * Generate deployment metrics
   */
  async getDeploymentMetrics(dateRange: { from: Date; to: Date }) {
    try {
      const { data: deployments } = await (supabase as any)
        .from('deployment_events')
        .select('*')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false })

      if (!deployments || deployments.length === 0) {
        return {
          totalDeployments: 0,
          successRate: 0,
          averageDeployTime: 0,
          lastDeployment: null
        }
      }

      const totalDeployments = deployments.length
      const successfulDeployments = deployments.filter((d: any) => d.status === 'completed').length
      const successRate = (successfulDeployments / totalDeployments) * 100

      const completedDeployments = deployments.filter((d: any) => d.duration_ms > 0)
      const averageDeployTime = completedDeployments.length > 0
        ? completedDeployments.reduce((acc: number, d: any) => acc + d.duration_ms, 0) / completedDeployments.length
        : 0

      return {
        totalDeployments,
        successRate: parseFloat(successRate.toFixed(1)),
        averageDeployTime: Math.round(averageDeployTime / 1000), // Convert to seconds
        lastDeployment: deployments[0]
      }
    } catch (error) {
      console.error('Failed to get deployment metrics:', error)
      return {
        totalDeployments: 0,
        successRate: 0,
        averageDeployTime: 0,
        lastDeployment: null
      }
    }
  }

  /**
   * Generate recommendations based on workflow performance
   */
  private generateWorkflowRecommendations(successRate: number, failedRuns: number, totalRuns: number): string[] {
    const recommendations: string[] = []

    if (successRate < 90) {
      recommendations.push('⚠️ Workflow success rate is below 90% - Investigation needed')
    }

    if (successRate < 70) {
      recommendations.push('🚨 Critical: Workflow success rate is critically low - Immediate action required')
    }

    if (failedRuns > 10 && totalRuns > 20) {
      recommendations.push('📊 High failure count detected - Review recent code changes and dependencies')
    }

    if (successRate === 0 && totalRuns > 0) {
      recommendations.push('🔴 All workflows are failing - Check system configuration and dependencies')
    }

    if (successRate >= 95) {
      recommendations.push('✅ Excellent workflow reliability - Maintain current practices')
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Workflow performance is within acceptable range')
    }

    return recommendations
  }

  /**
   * Track quiz performance with detailed analysis
   * PRD v3: Score improvement tracking (40% target)
   */
  async trackQuizCompletion(
    userId: string,
    quizData: {
      quizType: string
      subject: string
      score: number
      totalQuestions: number
      timeSpent: number
      predictedNEETScore?: number
    }
  ): Promise<void> {
    await this.trackUserAction({
      userId,
      action: 'quiz_completed',
      properties: {
        ...quizData,
        accuracy: (quizData.score / quizData.totalQuestions) * 100,
        questionsPerMinute: quizData.totalQuestions / (quizData.timeSpent / 60)
      }
    })

    // Update user progress for predictive analytics
    await this.updateUserProgress(userId, quizData)
  }

  /**
   * Track AI interactions for cost management and performance
   * PRD v3: Cost target <₹50 per student per month
   */
  async trackAIInteraction(
    userId: string,
    interactionData: {
      type: 'explanation' | 'voice' | 'study_plan' | 'doubt_clearing'
      model: string
      responseTime: number
      success: boolean
      tokens?: number
      cost?: number
      satisfactionRating?: number
    }
  ): Promise<void> {
    await this.trackUserAction({
      userId,
      action: 'ai_interaction',
      properties: {
        ...interactionData,
        costEfficiency: interactionData.cost ? interactionData.tokens! / interactionData.cost : null
      }
    })
  }

  /**
   * Generate dashboard metrics for different user types
   * PRD v3: Multi-dimensional analytics (student, parent, educator)
   * Enhanced with workflow and deployment metrics
   */
  async getDashboardMetrics(dateRange: { from: Date; to: Date }): Promise<MetricsData> {
    try {
      // Get workflow metrics
      const workflowMetrics = await this.getWorkflowMetrics(dateRange)
      
      // Get deployment metrics  
      const deploymentMetrics = await this.getDeploymentMetrics(dateRange)

      // Get user metrics (existing functionality)
      const { data: userMetrics } = await (supabase as any).rpc('get_user_metrics', {
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      }).catch(() => ({ data: null }))

      const { data: quizMetrics } = await (supabase as any).rpc('get_quiz_metrics', {
        start_date: dateRange.from.toISOString(), 
        end_date: dateRange.to.toISOString()
      }).catch(() => ({ data: null }))

      const { data: aiMetrics } = await (supabase as any).rpc('get_ai_usage_metrics', {
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      }).catch(() => ({ data: null }))

      return {
        userMetrics: userMetrics || {
          totalRegistrations: 0,
          monthlyActiveUsers: 0,
          premiumConversions: 0,
          retentionRates: {
            day1: 0,
            day7: 0,
            day30: 0,
            month3: 0
          }
        },
        quizMetrics: quizMetrics || {
          totalAttempts: 0,
          averageScore: 0,
          completionRate: 0,
          averageTimeSpent: 0
        },
        aiMetrics: aiMetrics || {
          totalInteractions: 0,
          averageResponseTime: 0,
          userSatisfaction: 0,
          costPerInteraction: 0
        },
        workflowMetrics: {
          totalRuns: workflowMetrics.totalRuns,
          successRate: workflowMetrics.successRate,
          failedRuns: workflowMetrics.failedRuns,
          averageRunTime: workflowMetrics.averageRunTime,
          criticalFailures: workflowMetrics.criticalFailures,
          recommendations: workflowMetrics.recommendations
        },
        deploymentMetrics: {
          totalDeployments: deploymentMetrics.totalDeployments,
          successRate: deploymentMetrics.successRate,
          averageDeployTime: deploymentMetrics.averageDeployTime,
          lastDeployment: deploymentMetrics.lastDeployment
        },
        performanceTargets: this.getPerformanceTargets(),
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Failed to get dashboard metrics:', error)
      
      // Return fallback metrics
      return {
        userMetrics: {
          totalRegistrations: 0,
          monthlyActiveUsers: 0,
          premiumConversions: 0,
          retentionRates: { day1: 0, day7: 0, day30: 0, month3: 0 }
        },
        quizMetrics: {
          totalAttempts: 0,
          averageScore: 0,
          completionRate: 0,
          averageTimeSpent: 0
        },
        aiMetrics: {
          totalInteractions: 0,
          averageResponseTime: 0,
          userSatisfaction: 0,
          costPerInteraction: 0
        },
        workflowMetrics: {
          totalRuns: 0,
          successRate: 0,
          failedRuns: 0,
          averageRunTime: 0,
          criticalFailures: [],
          recommendations: ['Error loading workflow metrics']
        },
        deploymentMetrics: {
          totalDeployments: 0,
          successRate: 0,
          averageDeployTime: 0,
          lastDeployment: null
        },
        performanceTargets: this.getPerformanceTargets(),
        lastUpdated: new Date()
      }
    }
  }

  /**
   * Generate weekly metrics report similar to the GitHub issue format
   */
  async generateWeeklyReport(): Promise<string> {
    const lastWeek = {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date()
    }

    const metrics = await this.getDashboardMetrics(lastWeek)
    const reportDate = new Date().toISOString().split('T')[0]

    const report = `
## 📊 Weekly Metrics Report

**Report Period**: Last 7 days (${reportDate})

### 🔄 Workflow Metrics

| Metric | Value |
|--------|-------|
| **Total Workflow Runs** | ${metrics.workflowMetrics.totalRuns} |
| **Success Rate** | ${metrics.workflowMetrics.successRate}% |
| **Failed Runs** | ${metrics.workflowMetrics.failedRuns} |
| **Average Run Time** | ${metrics.workflowMetrics.averageRunTime}s |

### 🚀 Deployment Metrics

| Metric | Value |
|--------|-------|
| **Total Deployments** | ${metrics.deploymentMetrics.totalDeployments} |
| **Deployment Success Rate** | ${metrics.deploymentMetrics.successRate}% |
| **Average Deploy Time** | ${metrics.deploymentMetrics.averageDeployTime}s |

### 📱 User Metrics

| Metric | Value |
|--------|-------|
| **Monthly Active Users** | ${metrics.userMetrics.monthlyActiveUsers} |
| **Premium Conversions** | ${metrics.userMetrics.premiumConversions} |
| **Day 7 Retention** | ${metrics.userMetrics.retentionRates.day7}% |

### 🤖 AI Usage Metrics

| Metric | Value |
|--------|-------|
| **Total AI Interactions** | ${metrics.aiMetrics.totalInteractions} |
| **Average Response Time** | ${metrics.aiMetrics.averageResponseTime}ms |
| **User Satisfaction** | ${metrics.aiMetrics.userSatisfaction}% |

### 🎯 Key Insights

${metrics.workflowMetrics.recommendations.map(rec => rec).join('\n\n')}

### 📈 Trends & Recommendations

- **Deployment Frequency**: ${metrics.deploymentMetrics.totalDeployments > 0 ? 'Active deployment pipeline' : 'No recent deployments detected'}
- **Code Quality**: ${metrics.workflowMetrics.successRate >= 90 ? 'Excellent' : 'Needs attention'} workflow success rate
- **Team Velocity**: Monitor PR throughput and review times
- **Issue Management**: ${metrics.workflowMetrics.criticalFailures.length} critical failures need attention

### 🔗 Useful Links

- [Workflow Runs](https://github.com/chakravartyharish/NEETAI/actions)
- [Open Pull Requests](https://github.com/chakravartyharish/NEETAI/pulls)
- [Recent Issues](https://github.com/chakravartyharish/NEETAI/issues)

---

_This report is automatically generated. For questions or suggestions, please create an issue._
    `.trim()

    return report
  }

  /**
   * Performance targets from PRD v3
   */
  private getPerformanceTargets() {
    return {
      scoreImprovement: 40, // % improvement target
      neetPredictionAccuracy: 90, // % accuracy within ±25 points
      studentEngagement: 75, // minutes average session time
      retentionRate: 90, // % monthly retention for premium users
      apiLatency: 100, // ms (95th percentile)
      availability: 99.99 // % uptime
    }
  }

  /**
   * Update user progress for predictive analytics
   */
  private async updateUserProgress(userId: string, quizData: any): Promise<void> {
    try {
      await (supabase as any)
        .from('user_progress')
        .upsert({
          user_id: userId,
          subject: quizData.subject,
          total_attempts: 1, // Will be incremented server-side
          total_correct: quizData.score,
          total_time_spent: quizData.timeSpent,
          last_attempt_at: new Date(),
          predicted_neet_score: quizData.predictedNEETScore
        })
    } catch (error) {
      console.error('Failed to update user progress:', error)
    }
  }
}

export const metricsService = new MetricsService()
