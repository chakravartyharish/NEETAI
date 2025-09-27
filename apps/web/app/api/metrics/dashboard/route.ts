import { NextRequest, NextResponse } from 'next/server'
import { metricsService } from '@neet/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const format = searchParams.get('format') || 'json'

    // Calculate date range
    const dateRange = {
      from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      to: new Date()
    }

    // Get comprehensive metrics
    const metrics = await metricsService.getDashboardMetrics(dateRange)

    // Return formatted report if requested
    if (format === 'report') {
      const report = await metricsService.generateWeeklyReport()
      return new NextResponse(report, {
        headers: {
          'Content-Type': 'text/markdown',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        }
      })
    }

    // Return JSON metrics
    return NextResponse.json({
      success: true,
      data: metrics,
      metadata: {
        dateRange,
        generatedAt: new Date().toISOString(),
        reportPeriod: `${days} days`
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      }
    })

  } catch (error) {
    console.error('Dashboard metrics API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventData } = body

    if (eventType === 'workflow') {
      await metricsService.trackWorkflowEvent(eventData)
    } else if (eventType === 'deployment') {
      await metricsService.trackDeploymentEvent(eventData)
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid event type. Must be "workflow" or "deployment"'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `${eventType} event tracked successfully`
    })

  } catch (error) {
    console.error('Metrics tracking API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to track metrics event',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    })
  }
}