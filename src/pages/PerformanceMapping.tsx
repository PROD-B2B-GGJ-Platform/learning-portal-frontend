import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, BookOpen, Target, Calendar } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function PerformanceMapping() {
  const { tenantContext, isLoading: contextLoading, tenantName } = useTenantContext();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [trainingImpact, setTrainingImpact] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'employee' | 'project'>('employee');

  useEffect(() => {
    if (tenantContext) {
      loadData();
    }
  }, [tenantContext]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [perfData, impactData] = await Promise.all([
        LearningAPIService.getPerformanceData().catch(() => []),
        LearningAPIService.getTrainingImpact().catch(() => [])
      ]);
      
      setPerformanceData(Array.isArray(perfData) ? perfData : []);
      setTrainingImpact(Array.isArray(impactData) ? impactData : []);
    } catch (error) {
      console.error('Error loading performance data:', error);
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (rating >= 4.0) return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
    if (rating >= 3.0) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const avgRating = performanceData.length > 0 
    ? (performanceData.reduce((acc, p) => acc + (p.rating || 0), 0) / performanceData.length).toFixed(1)
    : '0.0';

  const highPerformers = performanceData.filter(p => p.rating >= 4.5).length;
  const needsImprovement = performanceData.filter(p => p.rating < 3.0).length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Performance Mapping</h1>
          <p className="text-gray-400">Track employee performance and training effectiveness</p>
          <p className="text-sm text-purple-400 mt-1">{tenantName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('employee')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'employee'
                ? 'bg-purple-600 text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            By Employee
          </button>
          <button
            onClick={() => setViewMode('project')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'project'
                ? 'bg-purple-600 text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
            }`}
          >
            By Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Avg Performance</p>
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{avgRating}</p>
          <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">High Performers</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">{highPerformers}</p>
          <p className="text-xs text-gray-500 mt-1">Rating 4.5+</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Evaluations</p>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{performanceData.length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Needs Training</p>
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">{needsImprovement}</p>
          <p className="text-xs text-gray-500 mt-1">Rating below 3.0</p>
        </div>
      </div>

      {/* Training Impact Analysis */}
      {trainingImpact.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Training Impact</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">
                {trainingImpact[0]?.performanceImprovement || '+12'}%
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg Performance Improvement</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">
                {trainingImpact[0]?.employeesImproved || 45}
              </p>
              <p className="text-sm text-gray-400 mt-1">Employees Improved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {trainingImpact[0]?.coursesCompleted || 234}
              </p>
              <p className="text-sm text-gray-400 mt-1">Courses Completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Data */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          {viewMode === 'employee' ? 'Employee Performance' : 'Project Performance'}
        </h2>
        
        <div className="space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-[#2a2a2a] rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-[#2a2a2a] rounded w-1/2"></div>
              </div>
            ))
          ) : performanceData.length > 0 ? (
            performanceData.map((perf, index) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {perf.employeeName || 'Employee Name'}
                      </h3>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getRatingColor(perf.rating || 0)}`}>
                        ★ {perf.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {perf.role || 'Role'} • {perf.department || 'Department'}
                    </p>
                    {perf.projectName && (
                      <p className="text-sm text-purple-400 mt-1">
                        Project: {perf.projectName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Training Progress */}
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-1">Training</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${perf.trainingProgress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-white font-medium">{perf.trainingProgress || 0}%</span>
                      </div>
                    </div>

                    {/* Last Evaluated */}
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Last Evaluated</p>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {perf.evaluatedAt ? new Date(perf.evaluatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {perf.feedback && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                    <p className="text-sm text-gray-400 italic">"{perf.feedback}"</p>
                    {perf.evaluatedBy && (
                      <p className="text-xs text-gray-500 mt-2">- {perf.evaluatedBy}</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Performance Data</h3>
              <p className="text-gray-400">Performance evaluations will appear here once recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

