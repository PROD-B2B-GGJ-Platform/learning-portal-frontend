import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, TrendingDown, Zap } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function ProjectGapAnalysis() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { tenantContext } = useTenantContext();
  const [project, setProject] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (tenantContext && projectId) {
      loadData();
    }
  }, [tenantContext, projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectData, gapsData] = await Promise.all([
        LearningAPIService.getProjectDetails(projectId!).catch(() => ({})),
        LearningAPIService.getProjectGapAnalysis(projectId!).catch(() => null)
      ]);
      
      setProject(projectData);
      setGapAnalysis(gapsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await LearningAPIService.analyzeProjectGaps(projectId!);
      setGapAnalysis(result);
      alert('Gap analysis completed!');
    } catch (error) {
      console.error('Error analyzing gaps:', error);
      alert('Failed to analyze gaps');
    } finally {
      setAnalyzing(false);
    }
  };

  const getGapSeverity = (gap: number) => {
    if (gap >= 3) return { color: 'text-red-400 bg-red-500/20 border-red-500/30', label: 'CRITICAL' };
    if (gap >= 2) return { color: 'text-amber-400 bg-amber-500/20 border-amber-500/30', label: 'HIGH' };
    if (gap >= 1) return { color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30', label: 'MEDIUM' };
    return { color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', label: 'LOW' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading gap analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {project?.projectName || 'Project'} - Gap Analysis
          </h1>
          <p className="text-gray-400">Identify skill gaps and training needs for project readiness</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {gapAnalysis && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Gaps</p>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-white">{gapAnalysis.totalGaps || 0}</p>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Critical Gaps</p>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{gapAnalysis.criticalGaps || 0}</p>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Employees Affected</p>
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">{gapAnalysis.employeesAffected || 0}</p>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Ready Employees</p>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">{gapAnalysis.readyEmployees || 0}</p>
          </div>
        </div>
      )}

      {/* Gap Details */}
      {gapAnalysis && gapAnalysis.gaps && gapAnalysis.gaps.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Identified Skill Gaps</h2>
          <div className="space-y-4">
            {gapAnalysis.gaps.map((gap: any, index: number) => {
              const severity = getGapSeverity(gap.gapLevel);
              return (
                <div 
                  key={index}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{gap.employeeName}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${severity.color}`}>
                          {severity.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{gap.role} • {gap.department}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/training-auto-assign/${projectId}?employeeId=${gap.employeeId}`)}
                      className="px-4 py-2 bg-purple-500/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg text-sm border border-purple-500/30 transition-colors"
                    >
                      Assign Training
                    </button>
                  </div>

                  {/* Skill Gaps for this employee */}
                  <div className="space-y-2">
                    {gap.skillGaps && gap.skillGaps.map((skillGap: any, idx: number) => (
                      <div key={idx} className="bg-[#0F1419] border border-[#2a2a2a] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{skillGap.skillName}</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Current: Level {skillGap.currentLevel} → Required: Level {skillGap.requiredLevel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-400">-{skillGap.gap}</p>
                            <p className="text-xs text-gray-400">Gap</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : gapAnalysis ? (
        <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
          <CheckCircle className="w-16 h-16 mx-auto text-emerald-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Skill Gaps Found!</h3>
          <p className="text-gray-400">Your team is fully prepared for this project</p>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
          <AlertTriangle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Analysis Available</h3>
          <p className="text-gray-400 mb-4">Run a gap analysis to identify skill gaps in your team</p>
          <button 
            onClick={handleAnalyze}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Run Analysis Now
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {gapAnalysis && gapAnalysis.gaps && gapAnalysis.gaps.length > 0 && (
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => navigate(`/training-auto-assign/${projectId}`)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Auto-Assign Training
          </button>
        </div>
      )}
    </div>
  );
}

