import { useEffect, useState } from 'react';
import { Award, Calendar, CheckCircle, Clock, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Certifications() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [myCerts, setMyCerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-certs' | 'catalog'>('my-certs');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catalogRes, certsRes, statsRes] = await Promise.all([
        api.getCertificationCatalog().catch(() => ({ data: [] })),
        api.getEmployeeCertifications().catch(() => ({ data: [] })),
        api.getCertificationStats().catch(() => ({ data: {} }))
      ]);
      setCatalog(catalogRes.data || []);
      setMyCerts(certsRes.data || []);
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
        <p className="text-gray-400">Manage your professional certifications and credentials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/80 via-emerald-500/70 to-teal-500/60 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.activeCertifications || 0}</p>
            <p className="text-sm text-gray-400">Active Certs</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/80 via-amber-500/70 to-orange-500/60 flex items-center justify-center shadow-md shadow-amber-500/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.expiringIn30Days || 0}</p>
            <p className="text-sm text-gray-400">Expiring Soon</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400/80 via-red-500/70 to-rose-500/60 flex items-center justify-center shadow-md shadow-red-500/20">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.expiredCertifications || 0}</p>
            <p className="text-sm text-gray-400">Expired</p>
          </div>
        </div>
        <div className="theme-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/80 via-cyan-500/70 to-blue-500/60 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats?.totalCertifications || 0}</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('my-certs')}
          className={`pb-4 px-2 font-medium transition-all border-b-2 ${
            activeTab === 'my-certs'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          My Certifications
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-4 px-2 font-medium transition-all border-b-2 ${
            activeTab === 'catalog'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Certification Catalog
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="theme-card animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : activeTab === 'my-certs' ? (
        <div className="grid grid-cols-2 gap-6">
          {myCerts.length > 0 ? myCerts.map((cert, i) => (
            <div key={i} className="theme-card card-hover">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  cert.status === 'ACTIVE' ? 'bg-gradient-to-br from-emerald-400/80 via-emerald-500/70 to-teal-500/60 shadow-md shadow-emerald-500/20' :
                  cert.status === 'EXPIRED' ? 'bg-gradient-to-br from-red-400/80 via-red-500/70 to-rose-500/60 shadow-md shadow-red-500/20' : 
                  'bg-gradient-to-br from-amber-400/80 via-amber-500/70 to-orange-500/60 shadow-md shadow-amber-500/20'
                }`}>
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white">{cert.certificationName}</h3>
                    <span className={`badge ${
                      cert.status === 'ACTIVE' ? 'badge-success' :
                      cert.status === 'EXPIRED' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {cert.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{cert.issuedBy}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Issue Date</p>
                      <p className="text-white">{new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expiry Date</p>
                      <p className="text-white">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Certificate #</p>
                      <p className="text-white font-mono text-xs">{cert.certificateNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Score</p>
                      <p className="text-white">{cert.score || 'N/A'}</p>
                    </div>
                  </div>

                  <button className="mt-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                    <ExternalLink className="w-4 h-4" />
                    View Certificate
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-16 theme-card">
              <Award className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No certifications yet</h3>
              <p className="text-gray-400">Start the Certification service to see your certifications</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {catalog.length > 0 ? catalog.map((cert, i) => (
            <div key={i} className="theme-card card-hover cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-gray-600/50">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <span className={`badge ${
                  cert.level === 'EXPERT' ? 'badge-danger' :
                  cert.level === 'ADVANCED' ? 'badge-warning' :
                  cert.level === 'INTERMEDIATE' ? 'badge-info' : 'badge-success'
                }`}>
                  {cert.level}
                </span>
              </div>
              
              <h3 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {cert.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{cert.description}</p>
              
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{cert.issuingAuthority}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                <span>{cert.validityMonths ? `${cert.validityMonths} months` : 'Lifetime'}</span>
              </div>

              <button className="mt-4 w-full py-2 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-lg transition-all font-medium border border-cyan-500/30">
                Learn More
              </button>
            </div>
          )) : (
            <div className="col-span-3 text-center py-16 theme-card">
              <Award className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No certifications available</h3>
              <p className="text-gray-400">Start the Certification service to browse the catalog</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
