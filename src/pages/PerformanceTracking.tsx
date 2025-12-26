import { useState, useEffect } from 'react';
import { Award, Star, TrendingUp, Target, Calendar, BarChart3, Medal } from 'lucide-react';
import trainingData from '../data/techcorp-training-data.json';

export default function PerformanceTracking() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  useEffect(() => {
    setEmployees(trainingData.employees.filter(emp => emp.projectPerformance && emp.projectPerformance.length > 0));
  }, []);

  const getPerformanceStats = () => {
    const allProjects = employees.flatMap(emp => emp.projectPerformance || []);
    const avgRating = allProjects.reduce((sum, proj) => sum + proj.rating, 0) / allProjects.length;
    return {
      totalProjects: allProjects.length,
      avgRating: avgRating.toFixed(1),
      topPerformers: employees.filter(emp => {
        const avgEmpRating = (emp.projectPerformance || []).reduce((sum: number, proj: any) => sum + proj.rating, 0) / (emp.projectPerformance || []).length;
        return avgEmpRating >= 4.5;
      }).length
    };
  };

  const stats = getPerformanceStats();

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-400';
    if (rating >= 4) return 'text-cyan-400';
    if (rating >= 3.5) return 'text-amber-400';
    return 'text-red-400';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (rating >= 4) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    if (rating >= 3.5) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Performance Tracking</h1>
          <p className="text-gray-400">Monitor employee performance on projects and identify training needs</p>
        </div>
        <div className="flex gap-3">
          <button className="theme-button-secondary px-4 py-2 text-sm">
            <Calendar className="w-4 h-4 inline mr-2" />
            Performance Review
          </button>
          <button className="theme-button-primary px-4 py-2 text-sm glow-purple">
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
          <p className="text-sm text-gray-400">Total Projects</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
          <p className="text-sm text-gray-400">Avg Performance Rating</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Medal className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.topPerformers}</p>
          <p className="text-sm text-gray-400">Top Performers</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">+15%</p>
          <p className="text-sm text-gray-400">Performance Growth</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Employee Performance List */}
        <div className="col-span-2 theme-card">
          <h2 className="text-xl font-bold text-white mb-4">Employee Performance Ratings</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {employees.map((emp, idx) => {
              const avgRating = emp.projectPerformance.reduce((sum: number, proj: any) => sum + proj.rating, 0) / emp.projectPerformance.length;
              const isSelected = selectedEmployee?.employeeId === emp.employeeId;
              
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer border ${
                    isSelected ? 'bg-purple-500/10 border-purple-500' : 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {emp.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{emp.name}</p>
                    <p className="text-sm text-gray-400 truncate">{emp.title} • {emp.department}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className={`text-lg font-bold ${getRatingColor(avgRating)}`}>
                        {avgRating.toFixed(1)}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">{emp.projectPerformance.length}</p>
                      <p className="text-[10px] text-gray-400">Projects</p>
                    </div>
                    
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getRatingBadge(avgRating)}`}>
                      {avgRating >= 4.5 ? 'Excellent' : avgRating >= 4 ? 'Good' : avgRating >= 3.5 ? 'Average' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Details */}
        <div className="theme-card">
          <h2 className="text-xl font-bold text-white mb-4">Project History</h2>
          {selectedEmployee ? (
            <div className="space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#2a2a2a]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-400">{selectedEmployee.title}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(star => {
                      const avgRating = selectedEmployee.projectPerformance.reduce((sum: number, proj: any) => sum + proj.rating, 0) / selectedEmployee.projectPerformance.length;
                      return (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-3">
                {selectedEmployee.projectPerformance.map((project: any, idx: number) => (
                  <div key={idx} className="p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{project.project}</p>
                        <p className="text-xs text-gray-400">{new Date(project.completedDate).toLocaleDateString()}</p>
                      </div>
                      <div className={`flex items-center gap-1 ml-2 flex-shrink-0 ${getRatingColor(project.rating)}`}>
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-sm">{project.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= project.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Training Recommendations based on Performance */}
              {selectedEmployee.recommendedTraining && selectedEmployee.recommendedTraining.length > 0 && (
                <div className="pt-4 border-t border-[#2a2a2a]">
                  <p className="text-xs font-medium text-gray-400 mb-2">RECOMMENDED TRAINING</p>
                  <div className="space-y-2">
                    {selectedEmployee.recommendedTraining.map((course: string, idx: number) => (
                      <div key={idx} className="text-xs px-2 py-1.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/30 hover:bg-purple-500/20 cursor-pointer transition-colors">
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2a2a2a] space-y-2">
                <button className="w-full theme-button-primary py-2 text-sm">
                  Schedule Performance Review
                </button>
                <button className="w-full theme-button-secondary py-2 text-sm">
                  Assign Training
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an employee to view project history</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="theme-card">
        <h2 className="text-xl font-bold text-white mb-4">Top Performers This Quarter</h2>
        <div className="grid grid-cols-5 gap-4">
          {employees.filter(emp => {
            const avgRating = emp.projectPerformance.reduce((sum: number, proj: any) => sum + proj.rating, 0) / emp.projectPerformance.length;
            return avgRating >= 4.5;
          }).slice(0, 5).map((emp, idx) => {
            const avgRating = emp.projectPerformance.reduce((sum: number, proj: any) => sum + proj.rating, 0) / emp.projectPerformance.length;
            return (
              <div key={idx} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] text-center hover:border-purple-500/50 transition-all hover:scale-[1.02] cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {emp.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <p className="font-medium text-white text-sm mb-1">{emp.name}</p>
                <p className="text-xs text-gray-400 mb-2">{emp.title}</p>
                <div className="flex justify-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-medium border border-emerald-500/30">
                  {avgRating.toFixed(1)} Rating
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

