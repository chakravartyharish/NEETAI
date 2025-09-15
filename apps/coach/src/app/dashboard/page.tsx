'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  GraduationCap,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Bell,
  Plus,
  ArrowUpRight,
  BookOpen,
  MessageSquare,
  Clock,
  Award,
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface DashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  testsThisMonth: number;
  averageScore: number;
  revenueThisMonth: number;
  growthRate: number;
  upcomingTests: number;
  pendingCommunications: number;
  contentViews: number;
}

export default function DashboardPage(): JSX.Element {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    testsThisMonth: 0,
    averageScore: 0,
    revenueThisMonth: 0,
    growthRate: 0,
    upcomingTests: 0,
    pendingCommunications: 0,
    contentViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard metrics
    const fetchMetrics = async (): Promise<void> => {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        totalStudents: 342,
        activeStudents: 298,
        totalTeachers: 18,
        testsThisMonth: 24,
        averageScore: 78.5,
        revenueThisMonth: 485000,
        growthRate: 12.5,
        upcomingTests: 8,
        pendingCommunications: 12,
        contentViews: 1847,
      });
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Enroll a new student in your institute',
      href: '/dashboard/students/new',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Create Test',
      description: 'Create a new test or assignment',
      href: '/dashboard/assessments/new',
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Send Announcement',
      description: 'Communicate with students and parents',
      href: '/dashboard/communications/new',
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Upload Content',
      description: 'Add study materials to your library',
      href: '/dashboard/content/upload',
      icon: BookOpen,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'test_completed',
      title: 'Physics Chapter 12 Test completed by 24 students',
      time: '2 hours ago',
      icon: FileText,
    },
    {
      id: 2,
      type: 'student_enrolled',
      title: 'Rahul Kumar enrolled in Batch A',
      time: '4 hours ago',
      icon: GraduationCap,
    },
    {
      id: 3,
      type: 'communication_sent',
      title: 'Monthly progress report sent to parents',
      time: '1 day ago',
      icon: MessageSquare,
    },
    {
      id: 4,
      type: 'content_uploaded',
      title: 'Chemistry formula sheet uploaded',
      time: '2 days ago',
      icon: BookOpen,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.full_name}!
        </h1>
        <p className="text-blue-100 mb-4">
          Here's what's happening with your institute today.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-sm">
            <GraduationCap className="h-4 w-4 mr-2" />
            {metrics.activeStudents} active students today
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            {metrics.upcomingTests} upcoming tests
          </div>
          <div className="flex items-center text-sm">
            <Bell className="h-4 w-4 mr-2" />
            {metrics.pendingCommunications} pending communications
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeStudents} active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests This Month</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.testsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.upcomingTests} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenueThisMonth)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatPercentage(metrics.growthRate)} growth
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help you manage your institute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <div className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-md ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {action.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your institute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-gray-400 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <Link href="/dashboard/activity">
                <Button variant="outline" size="sm" className="w-full">
                  View all activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance Trends</CardTitle>
            <CardDescription>
              Average scores over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              {/* Placeholder for chart - would use recharts in real implementation */}
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Performance chart would appear here</p>
                <p className="text-sm">Integration with analytics coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>
              Tests and important dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Physics Mock Test</p>
                  <p className="text-xs text-gray-600">Batch A & B</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Tomorrow</p>
                  <p className="text-xs text-gray-600">10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Chemistry Quiz</p>
                  <p className="text-xs text-gray-600">Batch C</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Dec 18</p>
                  <p className="text-xs text-gray-600">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Parent Meeting</p>
                  <p className="text-xs text-gray-600">Monthly Review</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Dec 20</p>
                  <p className="text-xs text-gray-600">6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Link href="/dashboard/calendar">
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View full calendar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}