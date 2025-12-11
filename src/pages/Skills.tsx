import { useEffect, useState } from 'react';
import { Target, TrendingUp, Award, Zap, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [employeeSkills, setEmployeeSkills] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [skillsRes, empSkillsRes, statsRes] = await Promise.all([
        api.getSkillsCatalog().catch(() => ({ data: [] })),
        api.getEmployeeSkills('emp-001').catch(() => ({ data: null })),
        api.getSkillStats().catch(() => ({ data: {} }))
      ]);
      setSkills(skillsRes.data || []);
      setEmployeeSkills(empSkillsRes.data);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'from-emerald-400/80 via-emerald-500/70 to-teal-500/60';
    if (level >= 3) return 'from-cyan-400/80 via-cyan-500/70 to-blue-500/60';
    if (level >= 2) return 'from-amber-400/80 via-amber-500/70 to-orange-500/60';
    return 'from-gray-400/80 via-gray-500/70 to-gray-600/60';
  };

  const getLevelName = (level: number) => {
    const names = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
    return names[level] || 'Unknown';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills Matrix</h1>
          <p className="text-gray-400">Track your skills and identify growth areas</p>
        </div>
        <button className="theme-button-primary flex items-center gap-2 px-5 py-2.5">
          <Target className="w-4 h-4" />
          Gap Analysis
        </button>
      </div>

      {/* Overall Score */}
      {employeeSkills && (
        <div className="theme-card p-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <svg className="w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle 
                  cx="64" cy="64" r="56" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="12" 
                  strokeLinecap="round"
                  strokeDasharray={`${(employeeSkills.overallScore / 100) * 352} 352`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{employeeSkills.overallScore}%</p>
                  <p className="text-xs text-gray-400">Overall</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-4">Your Skill Summary</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-gray-400">Strong Skills</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {employeeSkills.skills?.filter((s: any) => s.currentLevel >= 4).length || 0}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-400">Growing</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {employeeSkills.skills?.filter((s: any) => s.currentLevel < s.targetLevel).length || 0}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-gray-400">At Target</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {employeeSkills.skills?.filter((s: any) => s.currentLevel >= s.targetLevel).length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* My Skills */}
        <div className="theme-card">
          <h2 className="text-xl font-bold text-white mb-6">My Skills</h2>
          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-2 bg-gray-700 rounded"></div>
                </div>
              ))
            ) : employeeSkills?.skills?.length > 0 ? (
              employeeSkills.skills.map((skill: any, i: number) => (
                <div key={i} className="bg-gray-700/30 rounded-xl p-4 card-hover cursor-pointer border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{skill.skillName}</h3>
                      <p className="text-xs text-gray-400">{skill.skillCategory}</p>
                    </div>
                    <span className={`badge bg-gradient-to-r ${getLevelColor(skill.currentLevel)} text-white border-0`}>
                      {getLevelName(skill.currentLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(level => (
                          <div 
                            key={level}
                            className={`flex-1 h-2 rounded-full ${
                              level <= skill.currentLevel 
                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' 
                                : level <= skill.targetLevel 
                                  ? 'bg-cyan-500/30' 
                                  : 'bg-gray-700'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {skill.currentLevel}/{skill.targetLevel}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start Skill Matrix service to see your skills</p>
              </div>
            )}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="theme-card">
          <h2 className="text-xl font-bold text-white mb-6">Skills to Develop</h2>
          <div className="space-y-4">
            {employeeSkills?.skillGaps?.length > 0 ? (
              employeeSkills.skillGaps.map((gap: any, i: number) => (
                <div key={i} className="bg-gray-700/30 rounded-xl p-4 border-l-4 border-amber-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{gap.skillName}</h3>
                      <p className="text-sm text-gray-400">
                        Current: Level {gap.currentLevel} → Target: Level {gap.targetLevel}
                      </p>
                    </div>
                    <button className="text-cyan-400 hover:text-cyan-300">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="badge badge-warning">Gap: {gap.gap} levels</span>
                    <span className="text-xs text-gray-400">Recommended: Take training course</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No skill gaps identified</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending Skills */}
      <div className="theme-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Trending Skills</h2>
          <span className="badge badge-info">Rising Demand</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {(stats?.risingDemandSkills || ['Python', 'AWS', 'Kubernetes', 'Machine Learning']).map((skill: string, i: number) => (
            <div key={i} className="bg-gray-700/30 rounded-xl p-4 text-center hover:bg-gray-700/50 cursor-pointer transition-all border border-gray-700/50">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-400/80 via-emerald-500/70 to-teal-500/60 flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-white text-sm">{skill}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
