import { useEffect, useState } from 'react';
import { BookOpen, Clock, Target, TrendingUp, CheckCircle, AlertCircle, Play, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function MyLearning() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentRes, enrollmentRes] = await Promise.all([
        api.getAssignments('emp-001').catch(() => ({ data: [] })),
        api.getEnrollments().catch(() => ({ data: [] }))
      ]);
      setAssignments(assignmentRes.data || []);
      setEnrollments(enrollmentRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    inProgress: assignments.filter(a => a.status === 'IN_PROGRESS').length,
    completed: assignments.filter(a => a.status === 'COMPLETED').length,
    overdue: assignments.filter(a => a.status === 'OVERDUE').length,
    assigned: assignments.filter(a => a.status === 'ASSIGNED').length
  };

  const tabs = ['All', 'In Progress', 'Completed', 'Assigned', 'Overdue'];
  const [activeTab, setActiveTab] = useState('All');

  const filteredAssignments = activeTab === 'All' 
    ? assignments 
    : assignments.filter(a => a.status === activeTab.toUpperCase().replace(' ', '_'));

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Learning</h1>
          <p className="text-gray-400">Track your learning progress and assignments</p>
        </div>
        <button className="theme-button-primary flex items-center gap-2 px-5 py-2.5">
          <Calendar className="w-4 h-4" />
          View Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/80 via-cyan-500/70 to-blue-500/60 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            <p className="text-sm text-gray-400">In Progress</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/80 via-emerald-500/70 to-teal-500/60 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/80 via-amber-500/70 to-orange-500/60 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.assigned}</p>
            <p className="text-sm text-gray-400">Assigned</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400/80 via-red-500/70 to-rose-500/60 flex items-center justify-center shadow-md shadow-red-500/20">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.overdue}</p>
            <p className="text-sm text-gray-400">Overdue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="theme-card animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment, i) => (
            <div key={i} className="theme-card card-hover cursor-pointer group">
              <div className="flex items-start gap-6">
                {/* Course Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-gray-600/50">
                  <BookOpen className="w-8 h-8 text-cyan-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">
                        {assignment.courseTitle}
                      </h3>
                      <p className="text-sm text-gray-400">Assigned by {assignment.assignedByName}</p>
                    </div>
                    <span className={`badge ${
                      assignment.status === 'COMPLETED' ? 'badge-success' :
                      assignment.status === 'OVERDUE' ? 'badge-danger' :
                      assignment.status === 'IN_PROGRESS' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <span className={`badge ${
                      assignment.priority === 'CRITICAL' ? 'badge-danger' :
                      assignment.priority === 'HIGH' ? 'badge-warning' :
                      'badge-info'
                    }`}>
                      {assignment.priority}
                    </span>
                    <span className="badge">{assignment.assignmentType}</span>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="progress-bar h-full rounded-full" 
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-white w-12 text-right">
                      {assignment.progress}%
                    </span>
                    <button className="shrink-0 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg flex items-center gap-2 transition-all border border-cyan-500/30">
                      <Play className="w-4 h-4" />
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 theme-card">
            <Target className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No assignments found</h3>
            <p className="text-gray-400">Start the Training Assignment service to see your assignments</p>
          </div>
        )}
      </div>
    </div>
  );
}
