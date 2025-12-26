import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, Download, Filter } from 'lucide-react';
import trainingData from '../data/techcorp-training-data.json';

export default function TrainingCompliance() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  useEffect(() => {
    setEmployees(trainingData.employees);
  }, []);

  const getFilteredEmployees = () => {
    return employees.filter(emp => {
      const statusMatch = filterStatus === 'all' || emp.complianceStatus === filterStatus;
      const deptMatch = filterDepartment === 'all' || emp.department === filterDepartment;
      return statusMatch && deptMatch;
    });
  };

  const filteredEmployees = getFilteredEmployees();
  const departments = [...new Set(employees.map(emp => emp.department))];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Due Soon': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Non-Compliant': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Due Soon': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Non-Compliant': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Training & Compliance</h1>
          <p className="text-gray-400">Monitor employee training completion and compliance status</p>
        </div>
        <div className="flex gap-3">
          <button className="theme-button-secondary px-4 py-2 text-sm">
            <Filter className="w-4 h-4 inline mr-2" />
            Advanced Filters
          </button>
          <button className="theme-button-primary px-4 py-2 text-sm glow-purple">
            <Download className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Compliance Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-medium border border-emerald-500/30">
              {((trainingData.complianceSummary.compliant / trainingData.complianceSummary.total) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{trainingData.complianceSummary.compliant}</p>
          <p className="text-sm text-gray-400">Compliant Employees</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full font-medium border border-amber-500/30">
              Due Soon
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{trainingData.complianceSummary.dueThisMonth}</p>
          <p className="text-sm text-gray-400">Due This Month</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-medium border border-red-500/30">
              Overdue
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{trainingData.complianceSummary.overdue}</p>
          <p className="text-sm text-gray-400">Non-Compliant</p>
        </div>

        <div className="theme-card">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-medium border border-purple-500/30">
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">92%</p>
          <p className="text-sm text-gray-400">Completion Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Status Filter</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="Compliant">Compliant</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Department Filter</label>
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-400">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>

      {/* Employee Compliance Table */}
      <div className="theme-card">
        <h2 className="text-xl font-bold text-white mb-4">Employee Compliance Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Employee</th>
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Department</th>
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Last Compliance</th>
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Completed</th>
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Pending</th>
                <th className="text-left text-xs font-medium text-gray-400 pb-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredEmployees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-[#2a2a2a] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-xs">
                        {emp.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{emp.name}</p>
                        <p className="text-xs text-gray-400">{emp.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-300">{emp.department}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(emp.complianceStatus)}`}>
                      {getStatusIcon(emp.complianceStatus)}
                      {emp.complianceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-300">
                    {emp.lastComplianceDate ? new Date(emp.lastComplianceDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm font-medium text-emerald-400">{emp.trainingCompleted.length}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm font-medium text-amber-400">{emp.trainingPending.length}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors border border-purple-500/30">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Training Status */}
      <div className="theme-card">
        <h2 className="text-xl font-bold text-white mb-4">Mandatory Training Completion</h2>
        <div className="space-y-4">
          {trainingData.courses.filter(c => c.mandatory).map((course, idx) => {
            const completedCount = employees.filter(emp => 
              emp.trainingCompleted.includes(course.title)
            ).length;
            const completionRate = (completedCount / employees.length) * 100;
            
            return (
              <div key={idx} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{course.title}</h3>
                    <p className="text-xs text-gray-400">{course.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ml-4 ${
                    completionRate >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    completionRate >= 70 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {completionRate.toFixed(0)}% Complete
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="progress-bar h-full rounded-full" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {completedCount} / {employees.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

