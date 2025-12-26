import { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronRight, Mail, Briefcase, Award, AlertCircle, CheckCircle } from 'lucide-react';
import trainingData from '../data/techcorp-training-data.json';

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  title: string;
  department: string;
  reportsTo: string | null;
  complianceStatus: string;
  trainingCompleted: string[];
  trainingPending: string[];
  skillsGaps: string[];
}

export default function OrgHierarchy() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['EMP-001']));
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    setEmployees(trainingData.employees as Employee[]);
  }, []);

  const toggleNode = (employeeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getDirectReports = (managerId: string) => {
    return employees.filter(emp => emp.reportsTo === managerId);
  };

  const renderEmployeeNode = (employee: Employee, level: number = 0) => {
    const directReports = getDirectReports(employee.employeeId);
    const hasReports = directReports.length > 0;
    const isExpanded = expandedNodes.has(employee.employeeId);
    const isSelected = selectedEmployee?.employeeId === employee.employeeId;

    const getComplianceColor = (status: string) => {
      switch (status) {
        case 'Compliant': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        case 'Due Soon': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        case 'Non-Compliant': return 'text-red-400 bg-red-500/10 border-red-500/30';
        default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      }
    };

    return (
      <div key={employee.employeeId}>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-all border ${
            isSelected ? 'border-purple-500 bg-purple-500/10' : 'border-transparent'
          }`}
          style={{ paddingLeft: `${level * 32 + 12}px` }}
          onClick={() => setSelectedEmployee(employee)}
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasReports) toggleNode(employee.employeeId);
            }}
            className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors ${
              hasReports ? 'hover:bg-[#3a3a3a]' : 'invisible'
            }`}
          >
            {hasReports && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4 text-purple-400" /> : 
                <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white truncate">{employee.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getComplianceColor(employee.complianceStatus)}`}>
                {employee.complianceStatus}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate">{employee.title} • {employee.department}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-xs font-medium text-white">{employee.trainingCompleted.length}</p>
              <p className="text-[10px] text-gray-400">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-amber-400">{employee.trainingPending.length}</p>
              <p className="text-[10px] text-gray-400">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-red-400">{employee.skillsGaps.length}</p>
              <p className="text-[10px] text-gray-400">Gaps</p>
            </div>
          </div>
        </div>

        {/* Direct Reports */}
        {hasReports && isExpanded && (
          <div>
            {directReports.map(report => renderEmployeeNode(report, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootEmployees = employees.filter(emp => emp.reportsTo === null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Organization Hierarchy</h1>
          <p className="text-gray-400">TechCorp Inc. - Employee Reporting Structure & Training Status</p>
        </div>
        <div className="flex gap-3">
          <button className="theme-button-secondary px-4 py-2 text-sm">
            <Users className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button className="theme-button-primary px-4 py-2 text-sm glow-purple">
            <Award className="w-4 h-4 inline mr-2" />
            View Training Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{employees.length}</p>
          <p className="text-sm text-gray-400">Total Employees</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{trainingData.complianceSummary.compliant}</p>
          <p className="text-sm text-gray-400">Compliant</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-400">{trainingData.complianceSummary.dueThisMonth}</p>
          <p className="text-sm text-gray-400">Due This Month</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{trainingData.complianceSummary.overdue}</p>
          <p className="text-sm text-gray-400">Overdue</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{trainingData.courses.length}</p>
          <p className="text-sm text-gray-400">Available Courses</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Org Tree */}
        <div className="col-span-2 theme-card">
          <h2 className="text-xl font-bold text-white mb-4">Reporting Structure</h2>
          <div className="space-y-1 max-h-[600px] overflow-y-auto scrollbar-thin">
            {rootEmployees.map(emp => renderEmployeeNode(emp))}
          </div>
        </div>

        {/* Employee Details */}
        <div className="theme-card">
          <h2 className="text-xl font-bold text-white mb-4">Employee Details</h2>
          {selectedEmployee ? (
            <div className="space-y-4">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#2a2a2a]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-400">{selectedEmployee.title}</p>
                  <p className="text-xs text-gray-500">{selectedEmployee.employeeId}</p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">CONTACT</p>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Mail className="w-4 h-4 text-purple-400" />
                  {selectedEmployee.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-white mt-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  {selectedEmployee.department}
                </div>
              </div>

              {/* Training Status */}
              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">TRAINING STATUS</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Completed</span>
                    <span className="text-emerald-400 font-medium">{selectedEmployee.trainingCompleted.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">In Progress</span>
                    <span className="text-cyan-400 font-medium">{selectedEmployee.trainingInProgress?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pending</span>
                    <span className="text-amber-400 font-medium">{selectedEmployee.trainingPending.length}</span>
                  </div>
                </div>
              </div>

              {/* Skills Gaps */}
              {selectedEmployee.skillsGaps.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">SKILLS GAPS</p>
                  <div className="space-y-1">
                    {selectedEmployee.skillsGaps.map((skill, idx) => (
                      <div key={idx} className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/30">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Training */}
              {selectedEmployee.recommendedTraining && selectedEmployee.recommendedTraining.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">RECOMMENDED TRAINING</p>
                  <div className="space-y-2">
                    {selectedEmployee.recommendedTraining.map((course, idx) => (
                      <div key={idx} className="text-xs px-2 py-1.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/30 hover:bg-purple-500/20 cursor-pointer transition-colors">
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2a2a2a] space-y-2">
                <button className="w-full theme-button-primary py-2 text-sm">
                  Assign Training
                </button>
                <button className="w-full theme-button-secondary py-2 text-sm">
                  View Full Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an employee to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

