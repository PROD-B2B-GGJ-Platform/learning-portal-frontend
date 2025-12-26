import { useEffect, useState } from 'react';
import { BookOpen, Clock, Target, TrendingUp, CheckCircle, AlertCircle, Play, Calendar } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function LearningProgress() {
  const { tenantContext, isLoading: contextLoading } = useTenantContext();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantContext) {
      loadData();
    }
  }, [tenantContext]);

  const loadData = async () => {
    if (!tenantContext) return;
    
    try {
      setLoading(true);
      const [assignmentsData, enrollmentsData] = await Promise.all([
        LearningAPIService.getAssignments(tenantContext.userId).catch(() => []),
        LearningAPIService.getEnrollments(tenantContext.userId).catch(() => [])
      ]);
      
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (error) {
      console.error('Error loading learning progress:', error);
      setAssignments([]);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    inProgress: enrollments.filter(e => e.status === 'IN_PROGRESS').length,
    completed: enrollments.filter(e => e.status === 'COMPLETED').length,
    pending: enrollments.filter(e => e.status === 'PENDING').length,
    assigned: assignments.length
  };

  const tabs = ['All', 'In Progress', 'Completed', 'Pending'];
  const [activeTab, setActiveTab] = useState('All');

  const filteredEnrollments = activeTab === 'All' 
    ? enrollments 
    : enrollments.filter(e => e.status === activeTab.toUpperCase().replace(' ', '_'));

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning Progress</h1>
          <p className="text-gray-400">Track your learning journey and course enrollments</p>
        </div>
        <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
          <Calendar className="w-4 h-4" />
          View Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/80 via-cyan-500/70 to-blue-500/60 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            <p className="text-sm text-gray-400">In Progress</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/80 via-emerald-500/70 to-teal-500/60 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/80 via-amber-500/70 to-orange-500/60 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.pending}</p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/80 via-purple-500/70 to-pink-500/60 flex items-center justify-center shadow-md shadow-purple-500/20">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.assigned}</p>
            <p className="text-sm text-gray-400">Assigned</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2a2a2a] pb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Enrollments List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-[#2a2a2a] rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-[#2a2a2a] rounded w-1/2"></div>
            </div>
          ))
        ) : filteredEnrollments.length > 0 ? (
          filteredEnrollments.map((enrollment, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-xl p-6 cursor-pointer group transition-all">
              <div className="flex items-start gap-6">
                {/* Course Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                        {enrollment.courseName || 'Course Title'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Enrolled: {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      enrollment.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      enrollment.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {enrollment.status?.replace('_', ' ') || 'PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {enrollment.timeSpentMinutes ? `${Math.floor(enrollment.timeSpentMinutes / 60)}h ${enrollment.timeSpentMinutes % 60}m` : '0h'}
                    </span>
                    {enrollment.dueDate && (
                      <span className="flex items-center gap-1">
                        Due: {new Date(enrollment.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" 
                        style={{ width: `${enrollment.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-white w-12 text-right">
                      {enrollment.progressPercentage || 0}%
                    </span>
                    <button className="shrink-0 px-4 py-2 bg-purple-500/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg flex items-center gap-2 transition-all border border-purple-500/30">
                      <Play className="w-4 h-4" />
                      {enrollment.status === 'COMPLETED' ? 'Review' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <Target className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No enrollments found</h3>
            <p className="text-gray-400 mb-4">Start your learning journey by enrolling in courses</p>
            <button 
              onClick={() => window.location.hash = '/courses'}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

