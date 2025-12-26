import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  Calendar,
  Target,
  Play,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize tenant context
      LearningAPIService.initializeTenantContext();
      const tenantContext = LearningAPIService.getTenantContext();
      
      // Fetch data from backend services
      const [coursesData, enrollmentsData, assignmentsData, certificationsData] = await Promise.all([
        LearningAPIService.getCourses().catch(() => []),
        LearningAPIService.getEnrollments(tenantContext.userId).catch(() => []),
        LearningAPIService.getAssignments(tenantContext.userId).catch(() => []),
        LearningAPIService.getCertifications(tenantContext.userId).catch(() => [])
      ]);
      
      setCourses(Array.isArray(coursesData) ? coursesData.slice(0, 4) : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData.slice(0, 3) : []);
      setCertifications(Array.isArray(certificationsData) ? certificationsData : []);
      
      // Calculate stats from real data
      const inProgressCount = enrollmentsData.filter((e: any) => e.status === 'IN_PROGRESS').length || 0;
      const totalHours = enrollmentsData.reduce((sum: number, e: any) => sum + (e.hoursCompleted || 0), 0);
      const certCount = certificationsData.length || 0;
      
      setStats({
        inProgress: inProgressCount,
        hours: totalHours,
        certifications: certCount
      });
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    { label: 'Courses In Progress', value: stats?.inProgress || 0, change: `${enrollments.length} total`, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Learning Hours', value: stats?.hours?.toFixed(1) || '0', change: 'Total hours', icon: Clock, color: 'from-purple-400/80 via-purple-500/70 to-pink-500/60' },
    { label: 'Certifications', value: stats?.certifications || 0, change: 'Earned', icon: Award, color: 'from-amber-400/80 via-amber-500/70 to-orange-500/60' },
    { label: 'Skill Score', value: `${Math.min(100, (stats?.hours || 0) * 2)}%`, change: 'Progress', icon: TrendingUp, color: 'from-emerald-400/80 via-emerald-500/70 to-teal-500/60' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-card p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={loadData}
          className="theme-button-primary px-6 py-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-purple-400">{sessionStorage.getItem('userEmail')?.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') || 'User'}</span> 👋
          </h1>
          <p className="text-gray-400">Continue your learning journey with TechCorp. You're doing great!</p>
        </div>
        <div className="flex gap-3">
          <button className="theme-button-secondary flex items-center gap-2 px-5 py-2.5">
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button className="theme-button-primary flex items-center gap-2 px-5 py-2.5 glow-cyan">
            <Play className="w-4 h-4" />
            Continue Learning
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div 
            key={i} 
            className="theme-card card-hover"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/30">
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="col-span-2 theme-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Continue Learning</h2>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {enrollments.length > 0 ? enrollments.slice(0, 4).map((enrollment: any, i: number) => {
              const course = courses.find((c: any) => c.id === enrollment.courseId) || {};
              const progress = enrollment.progress || 0;
              
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all cursor-pointer group border border-gray-700/50">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0 border border-gray-600/50">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {course.title || enrollment.courseTitle || 'Course Title'}
                    </h3>
                    <p className="text-sm text-gray-400">{course.instructor || 'Instructor'} • {course.durationHours || enrollment.durationHours || 'N/A'} hours</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="progress-bar h-full rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400">{progress}%</span>
                    </div>
                  </div>
                  <button className="shrink-0 w-10 h-10 rounded-full bg-purple-500/20 hover:bg-purple-500 flex items-center justify-center transition-all border border-purple-500/30">
                    <Play className="w-5 h-5 text-purple-400 group-hover:text-white" />
                  </button>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No courses in progress. Browse catalog to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="theme-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Assignments</h2>
            <span className="badge badge-warning">3 Due</span>
          </div>
          
          <div className="space-y-4">
            {assignments.length > 0 ? assignments.map((assignment: any, i: number) => {
              const course = courses.find((c: any) => c.id === assignment.courseId) || {};
              
              return (
                <div key={i} className="p-4 bg-gray-700/30 rounded-xl border-l-4 border-amber-500">
                  <h3 className="font-medium text-white text-sm mb-1">{course.title || assignment.courseTitle || 'Course Title'}</h3>
                  <p className="text-xs text-gray-400 mb-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <div className="flex items-center justify-between">
                    <span className={`badge ${assignment.priority === 'CRITICAL' ? 'badge-danger' : assignment.priority === 'HIGH' ? 'badge-warning' : 'badge-info'}`}>
                      {assignment.priority || 'MEDIUM'}
                    </span>
                    <span className="text-xs text-gray-400">{assignment.status || 'PENDING'}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No assignments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="theme-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recommended For You</h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
            Browse All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {courses.length > 0 ? courses.map((course: any, i: number) => (
            <div key={i} className="bg-gray-700/30 rounded-xl overflow-hidden card-hover cursor-pointer group border border-gray-700/50">
              <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-purple-400/50" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mb-2">{course.instructor || 'Instructor'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-300">{course.rating || '4.5'}</span>
                  </div>
                  <span className="text-xs text-gray-400">{course.durationHours || 'N/A'} hrs</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-8 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No courses available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

