import { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, Plus, Upload, FileText, Filter } from 'lucide-react';
import { LearningAPIService } from '../services/LearningAPIService';
import { useTenantContext } from '../hooks/useTenantContext';

export default function AssignmentScheduler() {
  const { tenantContext, isLoading: contextLoading, tenantName } = useTenantContext();
  const [employees, setEmployees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('NORMAL');

  useEffect(() => {
    if (tenantContext) {
      loadData();
    }
  }, [tenantContext]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, coursesData, assignmentsData] = await Promise.all([
        LearningAPIService.getEmployees().catch(() => []),
        LearningAPIService.getCourses().catch(() => []),
        LearningAPIService.getAssignments().catch(() => [])
      ]);
      
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedCourse || selectedEmployees.length === 0 || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await LearningAPIService.bulkAssignCourse({
        courseId: selectedCourse,
        userIds: selectedEmployees,
        dueDate,
        priority
      });

      alert('Assignments created successfully!');
      setShowCreateForm(false);
      setSelectedCourse('');
      setSelectedEmployees([]);
      setDueDate('');
      setPriority('NORMAL');
      loadData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignments');
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assignment Scheduler</h1>
          <p className="text-gray-400">Assign courses to employees and manage training schedules</p>
          <p className="text-sm text-purple-400 mt-1">{tenantName}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg flex items-center gap-2 border border-[#2a2a2a] transition-colors">
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Assignments</p>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{assignments.length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Active Employees</p>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">{employees.filter(e => e.status === 'ACTIVE').length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Available Courses</p>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">{courses.length}</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Completion Rate</p>
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {assignments.length > 0 ? Math.round((assignments.filter(a => a.status === 'COMPLETED').length / assignments.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Create Training Assignment</h2>
            
            {/* Course Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 bg-[#0F1419] border border-[#2a2a2a] rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.courseName || course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Employees ({selectedEmployees.length} selected)
              </label>
              <div className="bg-[#0F1419] border border-[#2a2a2a] rounded-lg max-h-60 overflow-y-auto p-4">
                {employees.filter(e => e.status === 'ACTIVE').map(employee => (
                  <label key={employee.employeeId || employee.id} className="flex items-center gap-3 py-2 hover:bg-[#2a2a2a]/30 rounded px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.employeeId || employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.employeeId || employee.id)}
                      className="w-4 h-4 text-purple-600 bg-[#2a2a2a] border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-white">{employee.name}</span>
                    <span className="text-sm text-gray-400">({employee.role || employee.department})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-[#0F1419] border border-[#2a2a2a] rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Priority */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <div className="grid grid-cols-4 gap-2">
                {['LOW', 'NORMAL', 'HIGH', 'CRITICAL'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      priority === p
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-[#0F1419] border-[#2a2a2a] text-gray-400 hover:border-purple-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Assignments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Assignments</h2>
          <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg flex items-center gap-2 border border-[#2a2a2a] transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-[#2a2a2a] rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-[#2a2a2a] rounded w-1/2"></div>
              </div>
            ))
          ) : assignments.length > 0 ? (
            assignments.slice(0, 10).map((assignment, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50 rounded-xl p-6 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{assignment.courseName}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Assigned to {assignment.userIds?.length || 1} employee(s) • Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    assignment.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    assignment.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {assignment.priority}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <Calendar className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No assignments yet</h3>
              <p className="text-gray-400 mb-4">Create your first training assignment to get started</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

