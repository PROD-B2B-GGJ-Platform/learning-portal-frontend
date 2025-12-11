import axios from 'axios';

const API_BASE = {
  courses: 'http://localhost:8040/api/v1/learning/courses',
  schedule: 'http://localhost:8041/api/v1/learning/schedule',
  assignments: 'http://localhost:8110/api/v1/learning/assignments',
  skills: 'http://localhost:8111/api/v1/learning/skills',
  mentorship: 'http://localhost:8112/api/v1/learning/mentorship',
  certifications: 'http://localhost:3005/api/v1/learning/certifications',
  assessments: 'http://localhost:3006/api/v1/learning/assessments',
  lms: 'http://localhost:3007/api/v1/learning/lms'
};

export const api = {
  // Courses
  async getCourses() {
    const response = await axios.get(API_BASE.courses);
    return response.data;
  },
  
  async getCourseById(id: string) {
    const response = await axios.get(`${API_BASE.courses}/${id}`);
    return response.data;
  },
  
  async getCourseStats() {
    const response = await axios.get(`${API_BASE.courses}/stats`);
    return response.data;
  },

  async getEnrollments() {
    const response = await axios.get(`${API_BASE.courses}/enrollments`);
    return response.data;
  },

  // Training Schedule
  async getSessions() {
    const response = await axios.get(`${API_BASE.schedule}/sessions`);
    return response.data;
  },

  async getUpcomingSessions() {
    const response = await axios.get(`${API_BASE.schedule}/sessions/upcoming`);
    return response.data;
  },

  async getScheduleStats() {
    const response = await axios.get(`${API_BASE.schedule}/stats`);
    return response.data;
  },

  // Assignments
  async getAssignments(employeeId?: string) {
    const url = employeeId 
      ? `${API_BASE.assignments}/employee/${employeeId}`
      : API_BASE.assignments;
    const response = await axios.get(url);
    return response.data;
  },

  async getOverdueAssignments() {
    const response = await axios.get(`${API_BASE.assignments}/overdue`);
    return response.data;
  },

  async getAssignmentStats() {
    const response = await axios.get(`${API_BASE.assignments}/stats`);
    return response.data;
  },

  // Skills
  async getSkillsCatalog() {
    const response = await axios.get(`${API_BASE.skills}/catalog`);
    return response.data;
  },

  async getEmployeeSkills(employeeId: string) {
    const response = await axios.get(`${API_BASE.skills}/employee/${employeeId}/matrix`);
    return response.data;
  },

  async getSkillStats() {
    const response = await axios.get(`${API_BASE.skills}/stats`);
    return response.data;
  },

  // Mentorship
  async getMentors() {
    const response = await axios.get(`${API_BASE.mentorship}/mentors`);
    return response.data;
  },

  async getMentorshipRelations() {
    const response = await axios.get(`${API_BASE.mentorship}/relations`);
    return response.data;
  },

  async getMentorshipStats() {
    const response = await axios.get(`${API_BASE.mentorship}/stats`);
    return response.data;
  },

  // Certifications
  async getCertificationCatalog() {
    const response = await axios.get(`${API_BASE.certifications}/catalog`);
    return response.data;
  },

  async getEmployeeCertifications(employeeId?: string) {
    const url = employeeId 
      ? `${API_BASE.certifications}/employee/${employeeId}`
      : API_BASE.certifications;
    const response = await axios.get(url);
    return response.data;
  },

  async getCertificationStats() {
    const response = await axios.get(`${API_BASE.certifications}/stats`);
    return response.data;
  },

  // Assessments
  async getAssessments() {
    const response = await axios.get(API_BASE.assessments);
    return response.data;
  },

  async getAssessmentStats() {
    const response = await axios.get(`${API_BASE.assessments}/stats`);
    return response.data;
  },

  // LMS
  async getLmsProviders() {
    const response = await axios.get(`${API_BASE.lms}/providers`);
    return response.data;
  },

  async getLmsStats() {
    const response = await axios.get(`${API_BASE.lms}/stats`);
    return response.data;
  }
};

