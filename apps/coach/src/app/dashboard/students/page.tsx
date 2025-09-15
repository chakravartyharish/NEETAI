'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  User,
  Calendar,
  Award,
  TrendingUp,
} from 'lucide-react';
import type { Student } from '@/types';
import { formatDate, getGradeFromPercentage } from '@/lib/utils';

export default function StudentsPage(): JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchStudents = async (): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents: Student[] = [
        {
          id: '1',
          institute_id: 'inst-1',
          registration_number: 'NEET2024001',
          full_name: 'Aarav Sharma',
          email: 'aarav.sharma@email.com',
          phone: '9876543210',
          date_of_birth: '2005-03-15',
          gender: 'male',
          address: '123 MG Road, Delhi',
          parent_contact: {
            father_name: 'Rajesh Sharma',
            father_phone: '9876543211',
            father_email: 'rajesh.sharma@email.com',
            mother_name: 'Priya Sharma',
            mother_phone: '9876543212',
            mother_email: 'priya.sharma@email.com',
          },
          batch_id: 'batch-a',
          enrollment_date: '2024-01-15',
          status: 'active',
          performance_metrics: {
            overall_score: 85.5,
            physics_score: 88,
            chemistry_score: 82,
            biology_score: 87,
            total_tests_taken: 24,
            average_time_per_question: 90,
            predicted_neet_score: 620,
            last_test_date: '2024-12-10',
          },
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-12-15T00:00:00Z',
        },
        {
          id: '2',
          institute_id: 'inst-1',
          registration_number: 'NEET2024002',
          full_name: 'Priya Patel',
          email: 'priya.patel@email.com',
          phone: '9876543213',
          date_of_birth: '2005-07-22',
          gender: 'female',
          address: '456 Park Street, Mumbai',
          parent_contact: {
            father_name: 'Amit Patel',
            father_phone: '9876543214',
            father_email: 'amit.patel@email.com',
            mother_name: 'Sunita Patel',
            mother_phone: '9876543215',
            mother_email: 'sunita.patel@email.com',
          },
          batch_id: 'batch-b',
          enrollment_date: '2024-02-01',
          status: 'active',
          performance_metrics: {
            overall_score: 92.3,
            physics_score: 95,
            chemistry_score: 90,
            biology_score: 91,
            total_tests_taken: 26,
            average_time_per_question: 75,
            predicted_neet_score: 680,
            last_test_date: '2024-12-12',
          },
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-12-15T00:00:00Z',
        },
        {
          id: '3',
          institute_id: 'inst-1',
          registration_number: 'NEET2024003',
          full_name: 'Karan Singh',
          email: 'karan.singh@email.com',
          phone: '9876543216',
          date_of_birth: '2005-11-08',
          gender: 'male',
          address: '789 Gandhi Nagar, Jaipur',
          parent_contact: {
            father_name: 'Vikram Singh',
            father_phone: '9876543217',
            father_email: 'vikram.singh@email.com',
            mother_name: 'Kavita Singh',
            mother_phone: '9876543218',
            mother_email: 'kavita.singh@email.com',
          },
          batch_id: 'batch-a',
          enrollment_date: '2024-01-20',
          status: 'inactive',
          performance_metrics: {
            overall_score: 78.2,
            physics_score: 75,
            chemistry_score: 80,
            biology_score: 79,
            total_tests_taken: 18,
            average_time_per_question: 105,
            predicted_neet_score: 580,
            last_test_date: '2024-11-28',
          },
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z',
        },
      ];
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Batch filter
    if (selectedBatch !== 'all') {
      filtered = filtered.filter(student => student.batch_id === selectedBatch);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedBatch, selectedStatus]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'default';
      case 'dropped_out':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBatchName = (batchId: string | undefined) => {
    const batchNames: Record<string, string> = {
      'batch-a': 'Batch A',
      'batch-b': 'Batch B',
      'batch-c': 'Batch C',
    };
    return batchId ? batchNames[batchId] || batchId : 'Unassigned';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600">Manage your institute's student records</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/dashboard/students/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              {students.filter(s => s.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(students.reduce((sum, s) => sum + s.performance_metrics.overall_score, 0) / students.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...students.map(s => s.performance_metrics.overall_score)).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Highest individual score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => {
                const enrollDate = new Date(s.enrollment_date);
                const now = new Date();
                return enrollDate.getMonth() === now.getMonth() && 
                       enrollDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent enrollments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students by name, email, or registration number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Batches</option>
                <option value="batch-a">Batch A</option>
                <option value="batch-b">Batch B</option>
                <option value="batch-c">Batch C</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="dropped_out">Dropped Out</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedBatch !== 'all' || selectedStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first student.'
                  }
                </p>
                {!searchTerm && selectedBatch === 'all' && selectedStatus === 'all' && (
                  <div className="mt-6">
                    <Link href="/dashboard/students/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Link 
                          href={`/dashboard/students/${student.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary"
                        >
                          {student.full_name}
                        </Link>
                        <Badge variant={getStatusBadgeVariant(student.status)}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {student.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {student.phone}
                        </span>
                        <span>Reg: {student.registration_number}</span>
                        <span>Batch: {getBatchName(student.batch_id)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {student.performance_metrics.overall_score.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Grade: {getGradeFromPercentage(student.performance_metrics.overall_score)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Predicted: {student.performance_metrics.predicted_neet_score}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {student.performance_metrics.total_tests_taken} tests
                      </div>
                      <div className="text-xs text-gray-500">
                        Last: {student.performance_metrics.last_test_date ? formatDate(student.performance_metrics.last_test_date) : 'Never'}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Showing results count */}
      {filteredStudents.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      )}
    </div>
  );
}