import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Target,
  Users,
  Search,
  Bell,
  User,
  Zap,
  HelpCircle
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Course Catalog' },
  { to: '/my-learning', icon: GraduationCap, label: 'My Learning' },
  { to: '/certifications', icon: Award, label: 'Certifications' },
  { to: '/skills', icon: Target, label: 'Skills' },
  { to: '/mentorship', icon: Users, label: 'Mentorship' },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar - matching main platform */}
      <aside className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="text-base font-semibold text-white">Learning Portal</div>
              <div className="text-xs font-medium text-cyan-400 -mt-0.5">GoGrabJob L&D</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive 
                      ? 'bg-cyan-500/10' 
                      : 'hover:bg-gray-700/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-br from-cyan-400/80 via-cyan-500/70 to-blue-500/60 shadow-md shadow-cyan-500/20' 
                        : 'bg-gray-700/50 group-hover:bg-gray-700'
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
          <div className="theme-card space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Your Progress</h3>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">This Month</span>
                <span className="text-cyan-400 font-semibold">12 hrs</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="progress-bar h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-700/50 rounded-lg p-2">
                <p className="text-lg font-bold text-white">4</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
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
            className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-200 border border-transparent hover:border-gray-600/50"
          >
            <HelpCircle className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
            <span className="ml-3 overflow-hidden whitespace-nowrap">Help Center</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 sticky top-0 z-50 flex-shrink-0">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search courses, skills, certifications..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">Rajesh Kumar</p>
                  <p className="text-xs text-gray-400">Senior Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
