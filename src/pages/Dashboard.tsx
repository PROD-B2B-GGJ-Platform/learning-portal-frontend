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
  Star
} from 'lucide-react';
import { api } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courseRes, assignmentRes, certRes] = await Promise.all([
        api.getCourses().catch(() => ({ data: [] })),
        api.getAssignments('emp-001').catch(() => ({ data: [] })),
        api.getCertificationStats().catch(() => ({ data: {} }))
      ]);
      
      setCourses(courseRes.data?.slice(0, 4) || []);
      setAssignments(assignmentRes.data?.slice(0, 3) || []);
      setStats(certRes.data || {});
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    { label: 'Courses In Progress', value: 4, change: '+2 this week', icon: BookOpen, color: 'from-cyan-400/80 via-cyan-500/70 to-blue-500/60' },
    { label: 'Learning Hours', value: '28.5', change: '+5.2 hrs', icon: Clock, color: 'from-purple-400/80 via-purple-500/70 to-pink-500/60' },
    { label: 'Certifications', value: 3, change: '1 expiring soon', icon: Award, color: 'from-amber-400/80 via-amber-500/70 to-orange-500/60' },
    { label: 'Skill Score', value: '85%', change: '+12% growth', icon: TrendingUp, color: 'from-emerald-400/80 via-emerald-500/70 to-teal-500/60' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-cyan-400">Rajesh</span> 👋
          </h1>
          <p className="text-gray-400">Continue your learning journey. You're doing great!</p>
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
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {courses.length > 0 ? courses.map((course: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl transition-all cursor-pointer group border border-gray-700/50">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-gray-600/50">
                  <BookOpen className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-400">{course.instructor} • {course.durationHours} hours</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="progress-bar h-full rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-400">{Math.floor(Math.random() * 60 + 20)}%</span>
                  </div>
                </div>
                <button className="shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500 flex items-center justify-center transition-all border border-cyan-500/30">
                  <Play className="w-5 h-5 text-cyan-400 group-hover:text-white" />
                </button>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start the services to see courses</p>
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
            {assignments.length > 0 ? assignments.map((assignment: any, i: number) => (
              <div key={i} className="p-4 bg-gray-700/30 rounded-xl border-l-4 border-amber-500">
                <h3 className="font-medium text-white text-sm mb-1">{assignment.courseTitle}</h3>
                <p className="text-xs text-gray-400 mb-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <div className="flex items-center justify-between">
                  <span className={`badge ${assignment.priority === 'CRITICAL' ? 'badge-danger' : assignment.priority === 'HIGH' ? 'badge-warning' : 'badge-info'}`}>
                    {assignment.priority}
                  </span>
                  <span className="text-xs text-gray-400">{assignment.progress}% complete</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="theme-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recommended For You</h2>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1">
            Browse All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {(courses.length > 0 ? courses : [1,2,3,4]).map((course: any, i: number) => (
            <div key={i} className="bg-gray-700/30 rounded-xl overflow-hidden card-hover cursor-pointer group border border-gray-700/50">
              <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-cyan-400/50" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {course.title || 'Course Title'}
                </h3>
                <p className="text-xs text-gray-400 mb-2">{course.instructor || 'Instructor'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-300">{course.rating || '4.5'}</span>
                  </div>
                  <span className="text-xs text-gray-400">{course.durationHours || '8'} hrs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
