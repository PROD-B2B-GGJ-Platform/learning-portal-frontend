import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import LearningProgress from './pages/LearningProgress';
import Certifications from './pages/Certifications';
import Skills from './pages/Skills';
import Mentorship from './pages/Mentorship';
import OrgHierarchy from './pages/OrgHierarchy';
import TrainingCompliance from './pages/TrainingCompliance';
import AssignmentScheduler from './pages/AssignmentScheduler';
import SkillsGapAnalysis from './pages/SkillsGapAnalysis';
import PerformanceMapping from './pages/PerformanceMapping';
import Projects from './pages/Projects';
import ProjectSkillsMapping from './pages/ProjectSkillsMapping';
import ProjectGapAnalysis from './pages/ProjectGapAnalysis';
import TrainingAutoAssignment from './pages/TrainingAutoAssignment';
import ProjectReadiness from './pages/ProjectReadiness';
import { TopNavigationBar } from './components/TopNavigationBar';
import { TenantProvider } from './hooks/useTenantContext';

const TENANT_NAME_MAP: Record<string, string> = {
  'techcorp': 'TechCorp Inc.',
  'acme': 'Acme Corporation',
  'globex': 'Globex Industries',
  'gograbjob-b2b': 'GoGrabJob Platform',
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [tenantName, setTenantName] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('token');
    
    if (ssoToken) {
      sessionStorage.setItem('access_token', ssoToken);
      const email = urlParams.get('email');
      const realm = urlParams.get('realm');
      if (email) {
        sessionStorage.setItem('userEmail', email);
        setUserEmail(email);
        const name = email.split('@')[0].replace('.', ' ').split(' ')
          .map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        setUserName(name);
      }
      if (realm) {
        sessionStorage.setItem('tenantRealm', realm);
        setTenantName(TENANT_NAME_MAP[realm] || realm);
      }
      
      window.history.replaceState({}, '', '/');
      setAuthenticated(true);
      setLoading(false);
    } else {
      const existingToken = sessionStorage.getItem('access_token');
      if (existingToken) {
        const email = sessionStorage.getItem('userEmail');
        if (email) {
          setUserEmail(email);
          const name = email.split('@')[0].replace('.', ' ').split(' ')
            .map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
          setUserName(name);
        }
        const realm = sessionStorage.getItem('tenantRealm');
        if (realm) {
          setTenantName(TENANT_NAME_MAP[realm] || realm);
        }
        setAuthenticated(true);
        setLoading(false);
      } else {
        window.location.href = 'http://localhost:3005/login';
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading Learning Portal...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <TenantProvider>
      <div className="min-h-screen bg-[#0F1419] flex flex-col">
        <TopNavigationBar userName={userName} userEmail={userEmail} tenantName={tenantName} />
        <div className="flex-1">
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Learning Section (6 tabs) */}
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<CourseCatalog />} />
                <Route path="learning-progress" element={<LearningProgress />} />
                <Route path="certifications" element={<Certifications />} />
                <Route path="skills" element={<Skills />} />
                <Route path="mentorship" element={<Mentorship />} />
                
                {/* Administration Section (5 tabs) */}
                <Route path="org-hierarchy" element={<OrgHierarchy />} />
                <Route path="training-compliance" element={<TrainingCompliance />} />
                <Route path="assignment-scheduler" element={<AssignmentScheduler />} />
                <Route path="skills-gap" element={<SkillsGapAnalysis />} />
                <Route path="performance-mapping" element={<PerformanceMapping />} />
                
                {/* Projects Section (5 tabs) */}
                <Route path="projects" element={<Projects />} />
                <Route path="project-skills/:projectId" element={<ProjectSkillsMapping />} />
                <Route path="project-gap/:projectId" element={<ProjectGapAnalysis />} />
                <Route path="training-auto-assign/:projectId" element={<TrainingAutoAssignment />} />
                <Route path="project-readiness/:projectId" element={<ProjectReadiness />} />
              </Route>
            </Routes>
          </HashRouter>
        </div>
        {/* Footer */}
        <div className="bg-[#181818] border-t border-[#2a2a2a] py-3 px-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 GoGrabJob B2B Platform - Learning & Development. All rights reserved.
          </p>
        </div>
      </div>
    </TenantProvider>
  );
}

export default App;

