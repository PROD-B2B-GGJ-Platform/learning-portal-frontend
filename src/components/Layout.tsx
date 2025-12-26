import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Target,
  Users,
  GitGraph,
  ClipboardCheck,
  Calendar,
  BarChart2,
  Trophy,
  Zap,
  Briefcase,
  Map,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const navItems = [
  // LEARNING SECTION (6 tabs)
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', category: 'LEARNING' },
  { to: '/courses', icon: BookOpen, label: 'Course Catalog', category: 'LEARNING' },
  { to: '/learning-progress', icon: GraduationCap, label: 'Learning Progress', category: 'LEARNING' },
  { to: '/certifications', icon: Award, label: 'Certifications', category: 'LEARNING' },
  { to: '/skills', icon: Target, label: 'Skills', category: 'LEARNING' },
  { to: '/mentorship', icon: Users, label: 'Mentorship', category: 'LEARNING' },
  
  // ADMINISTRATION SECTION (5 tabs)
  { to: '/org-hierarchy', icon: GitGraph, label: 'Org Hierarchy', category: 'ADMIN' },
  { to: '/training-compliance', icon: ClipboardCheck, label: 'Training & Compliance', category: 'ADMIN' },
  { to: '/assignment-scheduler', icon: Calendar, label: 'Assignment Scheduler', category: 'ADMIN' },
  { to: '/skills-gap', icon: BarChart2, label: 'Skills Gap Analysis', category: 'ADMIN' },
  { to: '/performance-mapping', icon: Trophy, label: 'Performance Mapping', category: 'ADMIN' },
  
  // PROJECTS SECTION (5 tabs - main + 4 detail pages)
  { to: '/projects', icon: Briefcase, label: 'Projects Overview', category: 'PROJECTS' },
  { to: '/project-skills/demo', icon: Map, label: 'Skills Mapping', category: 'PROJECTS', note: 'Select project first' },
  { to: '/project-gap/demo', icon: AlertTriangle, label: 'Gap Analysis', category: 'PROJECTS', note: 'Select project first' },
  { to: '/training-auto-assign/demo', icon: Zap, label: 'Training Assignment', category: 'PROJECTS', note: 'Select project first' },
  { to: '/project-readiness/demo', icon: CheckCircle, label: 'Readiness Score', category: 'PROJECTS', note: 'Select project first' },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[#0F1419]">
      {/* Sidebar - matching main platform */}
      <aside className="w-60 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col h-screen">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-[#2a2a2a] flex-shrink-0">
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="text-base font-semibold text-white">Learning Portal</div>
              <div className="text-xs font-medium text-purple-400 -mt-0.5">GoGrabJob L&D</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          {/* Learning Section (6 tabs) */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Learning</h3>
          <nav className="space-y-1">
            {navItems.filter(item => item.category === 'LEARNING').map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive 
                      ? 'bg-purple-500/10' 
                      : 'hover:bg-[#2a2a2a]/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-400/80 via-purple-500/70 to-pink-500/60 shadow-md shadow-purple-500/20' 
                        : 'bg-[#2a2a2a]/50 group-hover:bg-[#2a2a2a]'
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    </div>
                    <span className={`flex-1 text-sm font-medium whitespace-nowrap ${
                      isActive ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Administration Section (5 tabs) */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Administration</h3>
          <nav className="space-y-1">
            {navItems.filter(item => item.category === 'ADMIN').map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive 
                      ? 'bg-purple-500/10' 
                      : 'hover:bg-[#2a2a2a]/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-400/80 via-purple-500/70 to-pink-500/60 shadow-md shadow-purple-500/20' 
                        : 'bg-[#2a2a2a]/50 group-hover:bg-[#2a2a2a]'
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    </div>
                    <span className={`flex-1 text-sm font-medium whitespace-nowrap ${
                      isActive ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Projects Section (5 tabs - collapsed to 1 main entry) */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Projects</h3>
          <nav className="space-y-1">
            {navItems.filter(item => item.category === 'PROJECTS').map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive 
                      ? 'bg-purple-500/10' 
                      : 'hover:bg-[#2a2a2a]/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-400/80 via-purple-500/70 to-pink-500/60 shadow-md shadow-purple-500/20' 
                        : 'bg-[#2a2a2a]/50 group-hover:bg-[#2a2a2a]'
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    </div>
                    <span className={`flex-1 text-sm font-medium whitespace-nowrap ${
                      isActive ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Stats Card */}
        <div className="px-4 pb-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Your Progress</h3>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">This Month</span>
                <span className="text-purple-400 font-semibold">12 hrs</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#2a2a2a] rounded-lg p-2">
                <p className="text-lg font-bold text-white">4</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-lg p-2">
                <p className="text-lg font-bold text-emerald-400">8</p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Center */}
        <div className="px-4 pb-4">
          <button 
            onClick={() => window.open('/help', '_blank')}
            className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-[#2a2a2a]/50 hover:text-white transition-all duration-200 border border-transparent hover:border-[#2a2a2a]/50"
          >
            <HelpCircle className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
            <span className="ml-3 overflow-hidden whitespace-nowrap">Help Center</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto bg-[#0F1419]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
