import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Target, Users, TrendingUp } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function ProjectSkillsMapping() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { tenantContext } = useTenantContext();
  const [project, setProject] = useState<any>(null);
  const [skillsMap, setSkillsMap] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [requiredLevel, setRequiredLevel] = useState(3);

  useEffect(() => {
    if (tenantContext && projectId) {
      loadData();
    }
  }, [tenantContext, projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectData, skillsData, allSkills] = await Promise.all([
        LearningAPIService.getProjectDetails(projectId!).catch(() => ({})),
        LearningAPIService.getProjectSkillsMap(projectId!).catch(() => []),
        LearningAPIService.getSkillFramework().catch(() => ({ skills: [] }))
      ]);
      
      setProject(projectData);
      setSkillsMap(Array.isArray(skillsData) ? skillsData : []);
      setAvailableSkills(Array.isArray(allSkills.skills) ? allSkills.skills : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkill) return;

    try {
      await LearningAPIService.addProjectSkill(projectId!, {
        skillId: selectedSkill,
        requiredLevel
      });
      
      alert('Skill added successfully!');
      setShowAddSkill(false);
      setSelectedSkill('');
      setRequiredLevel(3);
      loadData();
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!confirm('Remove this skill requirement?')) return;

    try {
      await LearningAPIService.removeProjectSkill(projectId!, skillId);
      alert('Skill removed!');
      loadData();
    } catch (error) {
      console.error('Error removing skill:', error);
      alert('Failed to remove skill');
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (level >= 3) return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
    if (level >= 2) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading project skills...</p>
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
            {project?.projectName || 'Project'} - Skills Mapping
          </h1>
          <p className="text-gray-400">Define required skills and proficiency levels for this project</p>
        </div>
        <button 
          onClick={() => setShowAddSkill(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Required Skills</p>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{skillsMap.length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Team Size</p>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{project?.teamSize || 0}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Avg Required Level</p>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {skillsMap.length > 0 
              ? (skillsMap.reduce((acc, s) => acc + s.requiredLevel, 0) / skillsMap.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Add Required Skill</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Skill</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F1419] border border-[#2a2a2a] rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose a skill...</option>
                  {availableSkills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skillName} ({skill.skillCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Required Level: {requiredLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={requiredLevel}
                  onChange={(e) => setRequiredLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowAddSkill(false)}
                className="px-5 py-2.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-3">
        {skillsMap.length > 0 ? (
          skillsMap.map((skillMapping) => (
            <div 
              key={skillMapping.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-xl p-6 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{skillMapping.skillName}</h3>
                  <p className="text-sm text-gray-400">{skillMapping.skillCategory}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Required Level</p>
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getLevelColor(skillMapping.requiredLevel)}`}>
                      Level {skillMapping.requiredLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveSkill(skillMapping.skillId)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
            <Target className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No skills defined yet</h3>
            <p className="text-gray-400 mb-4">Add required skills to start mapping team capabilities</p>
            <button 
              onClick={() => setShowAddSkill(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Add First Skill
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {skillsMap.length > 0 && (
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => navigate(`/project-gap/${projectId}`)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Analyze Skill Gaps
          </button>
          <button 
            onClick={() => navigate(`/project-readiness/${projectId}`)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Calculate Readiness Score
          </button>
        </div>
      )}
    </div>
  );
}

