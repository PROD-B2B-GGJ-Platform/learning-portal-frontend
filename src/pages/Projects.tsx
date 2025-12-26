import { useState, useEffect } from 'react';
import { Plus, Zap, Calendar, Users, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const navigate = useNavigate();
  const { tenantContext, tenantName } = useTenantContext();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    startDate: '',
    endDate: '',
    requiredSkills: []
  });

  useEffect(() => {
    if (tenantContext) {
      loadProjects();
    }
  }, [tenantContext]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await LearningAPIService.getProjects().catch(() => []);
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!formData.projectName || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await LearningAPIService.createProject(formData);
      alert('Project created successfully!');
      setShowCreateForm(false);
      setFormData({ projectName: '', startDate: '', endDate: '', requiredSkills: [] });
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'PLANNED': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      case 'COMPLETED': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage projects and track team skill readiness</p>
          <p className="text-sm text-purple-400 mt-1">{tenantName}</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Projects</p>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{projects.length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Active Projects</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'ACTIVE').length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Planned Projects</p>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{projects.filter(p => p.status === 'PLANNED').length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Avg Readiness</p>
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {projects.length > 0 
              ? Math.round(projects.reduce((acc, p) => acc + (p.readinessScore || 0), 0) / projects.length) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0F1419] border border-[#2a2a2a] rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Enter project name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-[#0F1419] border border-[#2a2a2a] rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 bg-[#0F1419] border border-[#2a2a2a] rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-[#2a2a2a] rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-[#2a2a2a] rounded w-2/3"></div>
            </div>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-xl p-6 cursor-pointer group transition-all"
              onClick={() => navigate(`/project-skills/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {project.projectName}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{project.projectDescription || 'No description provided'}</p>
                </div>
                
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getReadinessColor(project.readinessScore || 0)}`}>
                    {project.readinessScore || 0}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Readiness</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team: {project.teamSize || 0}
                  </span>
                  {project.readinessScore < 75 && (
                    <span className="flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      Training Required
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project-gap/${project.id}`);
                    }}
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-600 text-amber-400 hover:text-white rounded-lg text-sm border border-amber-500/30 transition-colors"
                  >
                    Gap Analysis
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project-readiness/${project.id}`);
                    }}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg text-sm border border-purple-500/30 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <Zap className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-4">Create your first project to start tracking team readiness</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

