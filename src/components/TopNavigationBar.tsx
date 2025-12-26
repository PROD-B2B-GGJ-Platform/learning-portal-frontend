import React, { useState, useRef } from 'react';
import { Search, GraduationCap, Bell, HelpCircle } from 'lucide-react';

interface TopNavigationBarProps {
  userName?: string;
  userEmail?: string;
}

export function TopNavigationBar({ userName = 'User', userEmail = '' }: TopNavigationBarProps) {
  const [showMessageTray, setShowMessageTray] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Refs for button positions
  const notificationRef = useRef<HTMLButtonElement>(null);
  const recentRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Get dropdown position based on ref
  const getDropdownPosition = (ref: React.RefObject<HTMLElement>) => {
    if (!ref.current) return { top: 50, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    return {
      top: rect.bottom + 2,
      left: rect.left
    };
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = 'http://localhost:3005/login';
  };

  const handleNavigation = (path: string) => {
    window.location.hash = `#${path}`;
    setShowRecent(false);
    setShowNavigation(false);
    setShowSearch(false);
  };

  return (
    <nav className="bg-[#181818] border-b border-[#2a2a2a] mt-2">
      {/* Single Row: Logo | Notification icon + Recent + Navigation + Search + Help + User + LogOff */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="/#/" className="flex items-center gap-2 hover:opacity-90 cursor-pointer">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(168, 85, 247) 100%)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-start justify-center -space-y-0.5">
            <span className="text-[14px] font-bold text-white leading-none">GoGrabJob</span>
            <span className="text-[8px] font-medium text-gray-400 leading-none">Learning & Development</span>
          </div>
        </a>

        {/* Right: All nav items including notification */}
        <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <button 
              ref={notificationRef}
              onClick={() => setShowMessageTray(!showMessageTray)}
              className="relative p-1.5 hover:bg-[#2a2a2a] rounded transition-colors"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 bg-purple-600 text-white text-[7px] font-medium rounded-full h-3 w-3 flex items-center justify-center">3</span>
            </button>

            {/* Recent Dropdown */}
            <button 
              ref={recentRef}
              onClick={() => {
                setShowRecent(!showRecent);
                setShowNavigation(false);
                setShowSearch(false);
                setShowMessageTray(false);
              }}
              className="px-2 py-1 text-[11px] font-medium text-white hover:bg-[#2a2a2a] rounded flex items-center gap-1 transition-colors"
            >
              Recent
              <span className="text-[9px]">▼</span>
            </button>

            {/* Navigation Dropdown */}
            <button 
              ref={navigationRef}
              onClick={() => {
                setShowNavigation(!showNavigation);
                setShowRecent(false);
                setShowSearch(false);
                setShowMessageTray(false);
              }}
              className="px-2 py-1 text-[11px] font-medium text-white hover:bg-[#2a2a2a] rounded flex items-center gap-1 transition-colors"
            >
              Navigation
              <span className="text-[9px]">▼</span>
            </button>

            {/* Search */}
            <div ref={searchRef} className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setShowRecent(false);
                  setShowNavigation(false);
                  setShowMessageTray(false);
                }}
                className="w-32 h-7 pl-7 pr-6 bg-[#0F1419] border border-[#2a2a2a] text-[10px] text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 cursor-pointer transition-colors"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 pointer-events-none">▼</span>
            </div>

          {/* Help */}
          <button className="px-2 py-1 text-[11px] font-medium text-white hover:bg-[#2a2a2a] rounded transition-colors flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Help
          </button>

          {/* User Name */}
          <button 
            onClick={() => handleNavigation('/profile')}
            className="px-2 py-1 text-[11px] font-medium text-purple-400 hover:bg-[#2a2a2a] rounded hover:underline transition-colors"
            title="Click to view profile"
          >
            {userName}
          </button>

          {/* Log Off */}
          <button 
            onClick={handleLogout}
            className="px-2 py-1 text-[11px] font-medium text-white hover:bg-[#2a2a2a] rounded transition-colors"
          >
            Log Off
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {(showRecent || showNavigation || showSearch || showMessageTray) && (
        <div className="fixed inset-0 z-40" onClick={() => {
          setShowRecent(false);
          setShowNavigation(false);
          setShowSearch(false);
          setShowMessageTray(false);
        }} />
      )}

      {/* Recent Dropdown */}
      {showRecent && (() => {
        const pos = getDropdownPosition(recentRef);
        return (
          <div style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px` }} className="w-64 bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl z-50 max-h-[70vh] overflow-y-auto rounded-lg">
            <div className="px-3 py-2 border-b border-[#2a2a2a] bg-[#181818]">
              <h3 className="text-[10px] font-semibold text-[#e0e0e0]">Recent Items</h3>
            </div>
            <div className="py-1">
              <a href="/#/" onClick={() => setShowRecent(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Dashboard</a>
              <a href="/#/my-learning" onClick={() => setShowRecent(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">My Learning</a>
              <a href="/#/certifications" onClick={() => setShowRecent(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Certifications</a>
              <a href="/#/skills" onClick={() => setShowRecent(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Skills</a>
            </div>
          </div>
        );
      })()}

      {/* Navigation Dropdown with Flyouts */}
      {showNavigation && (() => {
        const pos = getDropdownPosition(navigationRef);
        const navDropdownLeft = pos.left;
        const navDropdownWidth = 224; // w-56 = 14rem = 224px
        
        return (
          <>
            <div style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px` }} className="w-56 bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl z-50 max-h-[95vh] overflow-y-auto rounded-lg">
              <div className="px-3 py-2 border-b border-[#2a2a2a] bg-[#181818]">
                <h3 className="text-[10px] font-semibold text-[#e0e0e0]">Navigation</h3>
              </div>
              <div className="py-1">
                {/* Learning - with flyout */}
                <div 
                  onMouseEnter={() => setHoveredCategory('learning')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer flex items-center justify-between">
                    <span>Learning</span>
                    <span className="text-[8px]">▶</span>
                  </div>
                </div>

                {/* Administration - with flyout */}
                <div 
                  onMouseEnter={() => setHoveredCategory('admin')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer flex items-center justify-between">
                    <span>Administration</span>
                    <span className="text-[8px]">▶</span>
                  </div>
                </div>

                {/* Reports - with flyout */}
                <div 
                  onMouseEnter={() => setHoveredCategory('reports')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer flex items-center justify-between">
                    <span>Reports & Analytics</span>
                    <span className="text-[8px]">▶</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flyout submenu for Learning */}
            {hoveredCategory === 'learning' && (
              <div 
                style={{ position: 'fixed', top: `${pos.top}px`, left: `${navDropdownLeft + navDropdownWidth}px` }}
                className="w-56 bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl z-50 rounded-lg"
                onMouseEnter={() => setHoveredCategory('learning')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="py-1">
                  <a href="/#/" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Dashboard</a>
                  <a href="/#/courses" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Course Catalog</a>
                  <a href="/#/my-learning" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">My Learning</a>
                  <a href="/#/certifications" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Certifications</a>
                  <a href="/#/skills" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Skills Assessment</a>
                  <a href="/#/mentorship" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Mentorship</a>
                </div>
              </div>
            )}

            {/* Flyout submenu for Admin */}
            {hoveredCategory === 'admin' && (
              <div 
                style={{ position: 'fixed', top: `${pos.top}px`, left: `${navDropdownLeft + navDropdownWidth}px` }}
                className="w-56 bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl z-50 rounded-lg"
                onMouseEnter={() => setHoveredCategory('admin')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="py-1">
                  <a href="/#/org-hierarchy" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Organization Hierarchy</a>
                  <a href="/#/training-compliance" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Training & Compliance</a>
                  <a href="/#/skills-gap" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Skills Gap Analysis</a>
                  <a href="/#/course-management" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Course Management</a>
                  <a href="/#/performance-tracking" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Performance Tracking</a>
                </div>
              </div>
            )}

            {/* Flyout submenu for Reports */}
            {hoveredCategory === 'reports' && (
              <div 
                style={{ position: 'fixed', top: `${pos.top}px`, left: `${navDropdownLeft + navDropdownWidth}px` }}
                className="w-56 bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl z-50 rounded-lg"
                onMouseEnter={() => setHoveredCategory('reports')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="py-1">
                  <a href="/#/reports/training-completion" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Training Completion</a>
                  <a href="/#/reports/compliance" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Compliance Report</a>
                  <a href="/#/reports/skills-matrix" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Skills Matrix</a>
                  <a href="/#/reports/certification-status" onClick={() => setShowNavigation(false)} className="block px-3 py-1.5 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer">Certification Status</a>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* Message Tray */}
      {showMessageTray && (() => {
        const pos = getDropdownPosition(notificationRef);
        return (
          <div style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px` }} className="w-80 bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl z-50 max-h-[70vh] overflow-y-auto rounded-lg">
            <div className="px-3 py-2 border-b border-[#2a2a2a] bg-[#181818]">
              <h3 className="text-[10px] font-semibold text-[#e0e0e0]">Notifications</h3>
            </div>
            <div className="py-1">
              <div className="px-3 py-2 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer border-l-2 border-purple-500">
                <p className="font-medium">New Course Assigned</p>
                <p className="text-gray-400 text-[9px] mt-0.5">AWS Solutions Architect - Due: Jan 30</p>
              </div>
              <div className="px-3 py-2 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer border-l-2 border-amber-500">
                <p className="font-medium">Compliance Training Due</p>
                <p className="text-gray-400 text-[9px] mt-0.5">Security Awareness 2025 - Due in 5 days</p>
              </div>
              <div className="px-3 py-2 text-[10px] text-white hover:bg-[#2a2a2a] cursor-pointer border-l-2 border-green-500">
                <p className="font-medium">Certificate Issued</p>
                <p className="text-gray-400 text-[9px] mt-0.5">Java Advanced Programming - View Certificate</p>
              </div>
            </div>
          </div>
        );
      })()}
    </nav>
  );
}

