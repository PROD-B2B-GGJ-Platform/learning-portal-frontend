import { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, BookOpen, Award, AlertCircle, BarChart3 } from 'lucide-react';
import trainingData from '../data/techcorp-training-data.json';

export default function SkillsGapAnalysis() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    setEmployees(trainingData.employees);
  }, []);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const getSkillsGapByDepartment = (dept: string) => {
    const deptEmployees = dept === 'all' ? employees : employees.filter(emp => emp.department === dept);
    const totalGaps = deptEmployees.reduce((sum, emp) => sum + emp.skillsGaps.length, 0);
    return {
      employees: deptEmployees.length,
      totalGaps,
      avgGaps: deptEmployees.length > 0 ? (totalGaps / deptEmployees.length).toFixed(1) : 0
    };
  };

  const getMostCommonSkillsGaps = () => {
    const gapCounts: Record<string, number> = {};
    employees.forEach(emp => {
      emp.skillsGaps.forEach((gap: string) => {
        gapCounts[gap] = (gapCounts[gap] || 0) + 1;
      });
    });
    return Object.entries(gapCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  };

  const getEmployeesWithMostGaps = () => {
    return [...employees]
      .filter(emp => emp.skillsGaps.length > 0)
      .sort((a, b) => b.skillsGaps.length - a.skillsGaps.length)
      .slice(0, 10);
  };

  const topSkillsGaps = getMostCommonSkillsGaps();
  const employeesWithMostGaps = getEmployeesWithMostGaps();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills Gap Analysis</h1>
          <p className="text-gray-400">Identify critical skills gaps and recommend training programs</p>
        </div>
        <div className="flex gap-3">
          <button className="theme-button-secondary px-4 py-2 text-sm">
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Skills Matrix
          </button>
          <button className="theme-button-primary px-4 py-2 text-sm glow-purple">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Create Training Plan
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {employees.reduce((sum, emp) => sum + emp.skillsGaps.length, 0)}
          </p>
          <p className="text-sm text-gray-400">Total Skills Gaps</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {employees.filter(emp => emp.skillsGaps.length > 0).length}
          </p>
          <p className="text-sm text-gray-400">Employees with Gaps</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{topSkillsGaps.length}</p>
          <p className="text-sm text-gray-400">Critical Skills</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">32%</p>
          <p className="text-sm text-gray-400">Avg Gap Percentage</p>
        </div>
      </div>

      {/* Skills Gap by Department */}
      <div className="theme-card">
        <h2 className="text-xl font-bold text-white mb-4">Skills Gap by Department</h2>
        <div className="space-y-4">
          {Object.entries(trainingData.skillsMatrix).map(([dept, data]: [string, any], idx) => (
            <div key={idx} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">{dept}</h3>
                  <p className="text-xs text-gray-400">
                    Critical: {data.criticalSkills.join(', ')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium border ml-4 ${
                  data.averageGapPercentage < 30 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  data.averageGapPercentage < 40 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {data.averageGapPercentage}% Gap
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500" 
                    style={{ width: `${data.averageGapPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="text-xs text-gray-400">
                  <span className="font-medium text-white">Emerging Skills:</span> {data.emergingSkills.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top 10 Skills Gaps */}
        <div className="theme-card">
          <h2 className="text-xl font-bold text-white mb-4">Most Common Skills Gaps</h2>
          <div className="space-y-3">
            {topSkillsGaps.map((gap, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{gap.skill}</p>
                  <p className="text-xs text-gray-400">{gap.count} employees need this skill</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full font-medium border border-red-500/30">
                    High Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employees with Most Gaps */}
        <div className="theme-card">
          <h2 className="text-xl font-bold text-white mb-4">Employees Requiring Most Training</h2>
          <div className="space-y-3">
            {employeesWithMostGaps.map((emp, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {emp.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{emp.name}</p>
                  <p className="text-xs text-gray-400">{emp.title} • {emp.department}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">{emp.skillsGaps.length}</p>
                    <p className="text-[10px] text-gray-400">gaps</p>
                  </div>
                  <button className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors border border-purple-500/30">
                    Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Training Programs */}
      <div className="theme-card">
        <h2 className="text-xl font-bold text-white mb-4">Recommended Training Programs</h2>
        <div className="grid grid-cols-3 gap-4">
          {topSkillsGaps.slice(0, 6).map((gap, idx) => (
            <div key={idx} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] hover:border-purple-500/50 transition-all hover:scale-[1.02] cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-medium border border-red-500/30">
                  {gap.count} need this
                </span>
              </div>
              <h3 className="font-medium text-white mb-1">{gap.skill} Training</h3>
              <p className="text-xs text-gray-400 mb-3">Comprehensive {gap.skill} course</p>
              <button className="w-full theme-button-primary py-2 text-xs">
                Create Training Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

