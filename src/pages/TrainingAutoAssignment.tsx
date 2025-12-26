import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle, Calendar, BookOpen } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function TrainingAutoAssignment() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { tenantContext } = useTenantContext();
  const [project, setProject] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const employeeId = searchParams.get('employeeId');

  useEffect(() => {
    if (tenantContext && projectId) {
      loadData();
    }
  }, [tenantContext, projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectData, assignmentsData] = await Promise.all([
        LearningAPIService.getProjectDetails(projectId!).catch(() => ({})),
        LearningAPIService.getProjectTrainingAssignments(projectId!).catch(() => [])
      ]);
      
      setProject(projectData);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    if (!confirm('Auto-assign training courses to all employees with skill gaps?')) return;

    setAssigning(true);
    try {
      const result = await LearningAPIService.autoAssignProjectTraining(projectId!);
      alert(`Successfully assigned ${result.assignmentCount || 0} training courses!`);
      loadData();
    } catch (error) {
      console.error('Error auto-assigning:', error);
      alert('Failed to auto-assign training');
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'IN_PROGRESS': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      case 'PENDING': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading training assignments...</p>
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
            {project?.projectName || 'Project'} - Training Auto-Assignment
          </h1>
          <p className="text-gray-400">Automatically assign training courses based on skill gaps</p>
        </div>
        <button 
          onClick={handleAutoAssign}
          disabled={assigning}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          {assigning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Assigning...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Auto-Assign Training
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Assignments</p>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{assignments.length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Completed</p>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {assignments.filter(a => a.status === 'COMPLETED').length}
          </p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">In Progress</p>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {assignments.filter(a => a.status === 'IN_PROGRESS').length}
          </p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Completion Rate</p>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {assignments.length > 0 
              ? Math.round((assignments.filter(a => a.status === 'COMPLETED').length / assignments.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Assignments List */}
      {assignments.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Training Assignments</h2>
          <div className="space-y-3">
            {assignments
              .filter(a => !employeeId || a.userId === employeeId)
              .map((assignment, index) => (
                <div 
                  key={index}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{assignment.courseName}</h3>
                      <p className="text-sm text-gray-400">
                        Assigned to: {assignment.employeeName} • {assignment.role}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Assigned: {assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : 'N/A'}
                      </span>
                      {assignment.dueDate && (
                        <span className="flex items-center gap-2">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        assignment.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                        assignment.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {assignment.priority} Priority
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {assignment.status === 'IN_PROGRESS' && (
                      <div className="flex items-center gap-3 w-48">
                        <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${assignment.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white font-medium">{assignment.progress || 0}%</span>
                      </div>
                    )}
                  </div>

                  {/* Target Skill */}
                  {assignment.targetSkill && (
                    <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                      <p className="text-sm text-gray-400">
                        Target Skill: <span className="text-purple-400 font-medium">{assignment.targetSkill}</span>
                        {' '}(Level {assignment.currentLevel} → Level {assignment.targetLevel})
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
          <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Training Assigned Yet</h3>
          <p className="text-gray-400 mb-4">Run gap analysis first, then auto-assign training courses</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => navigate(`/project-gap/${projectId}`)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Run Gap Analysis
            </button>
            <button 
              onClick={handleAutoAssign}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Auto-Assign Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

