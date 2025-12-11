import { useEffect, useState } from 'react';
import { Users, Star, Calendar, MessageCircle, Clock, ChevronRight, UserPlus } from 'lucide-react';
import { api } from '../services/api';

export default function Mentorship() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-mentors' | 'find-mentor'>('my-mentors');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mentorRes, relationsRes, statsRes] = await Promise.all([
        api.getMentors().catch(() => ({ data: [] })),
        api.getMentorshipRelations().catch(() => ({ data: [] })),
        api.getMentorshipStats().catch(() => ({ data: {} }))
      ]);
      setMentors(mentorRes.data || []);
      setRelations(relationsRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mentorship</h1>
          <p className="text-gray-400">Connect with mentors to accelerate your growth</p>
        </div>
        <button className="theme-button-primary flex items-center gap-2 px-5 py-2.5">
          <UserPlus className="w-4 h-4" />
          Find a Mentor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/80 via-purple-500/70 to-pink-500/60 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.totalMentors || 0}</p>
            <p className="text-sm text-gray-400">Total Mentors</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/80 via-emerald-500/70 to-teal-500/60 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.availableMentors || 0}</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/80 via-cyan-500/70 to-blue-500/60 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.activeRelations || 0}</p>
            <p className="text-sm text-gray-400">Active Mentorships</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/80 via-amber-500/70 to-orange-500/60 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.averageRating?.toFixed(1) || '0'}</p>
            <p className="text-sm text-gray-400">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('my-mentors')}
          className={`pb-4 px-2 font-medium transition-all border-b-2 ${
            activeTab === 'my-mentors'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          My Mentorships
        </button>
        <button
          onClick={() => setActiveTab('find-mentor')}
          className={`pb-4 px-2 font-medium transition-all border-b-2 ${
            activeTab === 'find-mentor'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Find a Mentor
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="theme-card animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'my-mentors' ? (
        <div className="space-y-6">
          {relations.length > 0 ? relations.map((relation, i) => (
            <div key={i} className="theme-card card-hover">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {relation.mentorName.split(' ').map((n: string) => n[0]).join('')}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{relation.mentorName}</h3>
                      <p className="text-gray-400">{relation.focusAreas?.join(', ')}</p>
                    </div>
                    <span className={`badge ${relation.status === 'ACTIVE' ? 'badge-success' : 'badge-info'}`}>
                      {relation.status}
                    </span>
                  </div>

                  {/* Goals */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Goals:</p>
                    <div className="flex flex-wrap gap-2">
                      {relation.goals?.map((goal: string, j: number) => (
                        <span key={j} className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300 border border-gray-600/50">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{relation.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="progress-bar h-full" style={{ width: `${relation.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="text-center px-4 border-l border-gray-700">
                      <p className="text-xl font-bold text-white">{relation.sessionsCompleted}</p>
                      <p className="text-xs text-gray-400">Sessions</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg transition-all border border-cyan-500/30">
                      <Calendar className="w-4 h-4" />
                      Schedule Session
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-all border border-gray-600/50">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-16 theme-card">
              <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No active mentorships</h3>
              <p className="text-gray-400 mb-4">Start the Mentorship service or find a mentor to get started</p>
              <button className="theme-button-primary px-5 py-2.5">
                Find a Mentor
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {mentors.length > 0 ? mentors.map((mentor, i) => (
            <div key={i} className="theme-card card-hover cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {mentor.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {mentor.name}
                      </h3>
                      <p className="text-sm text-gray-400">{mentor.title}</p>
                    </div>
                    <span className={`badge ${
                      mentor.availability === 'AVAILABLE' ? 'badge-success' :
                      mentor.availability === 'LIMITED' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {mentor.availability}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{mentor.bio}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mentor.expertise?.slice(0, 3).map((exp: string, j: number) => (
                      <span key={j} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600/50">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white">{mentor.rating}</span>
                      </div>
                      <span className="text-gray-400">{mentor.totalSessions} sessions</span>
                    </div>
                    <button className="text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 text-sm font-medium">
                      Request <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-16 theme-card">
              <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No mentors available</h3>
              <p className="text-gray-400">Start the Mentorship service to see available mentors</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
