import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, AlertTriangle, Users, CheckCircle, Clock } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function ProjectReadiness() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { tenantContext } = useTenantContext();
  const [project, setProject] = useState<any>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantContext && projectId) {
      loadData();
    }
  }, [tenantContext, projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectData, readinessData, riskData] = await Promise.all([
        LearningAPIService.getProjectDetails(projectId!).catch(() => ({})),
        LearningAPIService.getProjectReadinessScore(projectId!).catch(() => null),
        LearningAPIService.getProjectRiskAssessment(projectId!).catch(() => null)
      ]);
      
      setProject(projectData);
      setReadiness({ ...readinessData, ...riskData });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getRiskLevel = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Calculating readiness...</p>
        </div>
      </div>
    );
  }

  const overallScore = readiness?.overallScore || 0;

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
            {project?.projectName || 'Project'} - Readiness Score
          </h1>
          <p className="text-gray-400">Comprehensive readiness assessment and risk analysis</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-8 text-center">
        <p className="text-gray-300 text-lg mb-4">Project Readiness Score</p>
        <div className={`text-7xl font-bold mb-4 ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
        <div className="flex items-center justify-center gap-2">
          {overallScore >= 85 ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 font-semibold">Project Ready to Start</p>
            </>
          ) : overallScore >= 70 ? (
            <>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <p className="text-cyan-400 font-semibold">Minor Preparation Needed</p>
            </>
          ) : overallScore >= 50 ? (
            <>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 font-semibold">Moderate Training Required</p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-semibold">Significant Training Needed</p>
            </>
          )}
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Skills Coverage</p>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(readiness?.skillsCoverage || 0)}`}>
            {readiness?.skillsCoverage || 0}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {readiness?.requiredSkillsMet || 0} of {readiness?.totalRequiredSkills || 0} skills met
          </p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Team Readiness</p>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(readiness?.teamReadiness || 0)}`}>
            {readiness?.teamReadiness || 0}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {readiness?.readyEmployees || 0} of {readiness?.totalEmployees || 0} ready
          </p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Training Progress</p>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(readiness?.trainingProgress || 0)}`}>
            {readiness?.trainingProgress || 0}%
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {readiness?.completedTrainings || 0} of {readiness?.assignedTrainings || 0} completed
          </p>
        </div>
      </div>

      {/* Risk Assessment */}
      {readiness?.risks && readiness.risks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Risk Assessment</h2>
          <div className="space-y-3">
            {readiness.risks.map((risk: any, index: number) => (
              <div 
                key={index}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{risk.riskCategory}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getRiskLevel(risk.severity)}`}>
                        {risk.severity} RISK
                      </span>
                    </div>
                    <p className="text-gray-400">{risk.description}</p>
                  </div>
                </div>

                <div className="bg-[#0F1419] border border-[#2a2a2a] rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-white mb-2">Mitigation Strategy:</p>
                  <p className="text-sm text-gray-400">{risk.mitigation}</p>
                </div>

                {risk.affectedEmployees && risk.affectedEmployees.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                    <p className="text-sm text-gray-400">
                      Affected: {risk.affectedEmployees.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {readiness?.recommendations && readiness.recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recommendations</h2>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-3">
            {readiness.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-400">{index + 1}</span>
                </div>
                <p className="text-gray-300 flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => navigate(`/project-gap/${projectId}`)}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          View Gap Analysis
        </button>
        <button 
          onClick={() => navigate(`/training-auto-assign/${projectId}`)}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Assign Training
        </button>
      </div>
    </div>
  );
}

