/**
 * Learning Portal API Service
 * Centralized API client with tenant isolation
 * All API calls automatically include tenantId from JWT
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API Base URLs (from environment or defaults)
// Multiple microservices - route to correct service
const COURSE_API = 'http://localhost:8091/api/v1';
const ENROLLMENT_API = 'http://localhost:10092/api/v1';
const CERTIFICATION_API = 'http://localhost:10093/api/v1';
const SKILLS_API = 'http://localhost:10094/api/v1';
const ASSIGNMENT_API = 'http://localhost:10095/api/v1';
const PROJECT_API = 'http://localhost:8096/api/v1';
const EMPLOYEE_SYNC_API = 'http://localhost:8097/api/v1';
const API_BASE_URL = COURSE_API; // Default

interface TenantContext {
  tenantId: string;
  userId: string;
  userEmail: string;
  roles: string[];
}

class LearningAPIServiceClass {
  private apiClient: AxiosInstance;
  private tenantContext: TenantContext | null = null;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: Add tenant and auth headers
    this.apiClient.interceptors.request.use(
      (config) => {
        // Get token from sessionStorage
        const token = sessionStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add tenant ID header if available
        if (this.tenantContext?.tenantId) {
          config.headers['X-Tenant-ID'] = this.tenantContext.tenantId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle errors
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized: redirect to login
          sessionStorage.clear();
          window.location.href = 'http://localhost:3005/login';
        } else if (error.response?.status === 403) {
          console.error('Access forbidden: Tenant mismatch or insufficient permissions');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize tenant context from JWT token
   */
  initializeTenantContext(): TenantContext {
    const token = sessionStorage.getItem('access_token');
    const tenantRealm = sessionStorage.getItem('tenantRealm');
    const userEmail = sessionStorage.getItem('userEmail');

    if (!tenantRealm || !userEmail) {
      throw new Error('Tenant context not found in session');
    }

    // Parse JWT to get userId (in production, decode JWT properly)
    // For now, extract from email or session
    const userId = userEmail.split('@')[0].toUpperCase(); // Simplified

    this.tenantContext = {
      tenantId: tenantRealm,
      userId,
      userEmail,
      roles: ['USER'], // TODO: Extract from JWT
    };

    return this.tenantContext;
  }

  /**
   * Get current tenant context
   */
  getTenantContext(): TenantContext {
    if (!this.tenantContext) {
      return this.initializeTenantContext();
    }
    return this.tenantContext;
  }

  /**
   * Generic GET request with tenant filtering
   */
  private async get<T>(endpoint: string, params?: Record<string, any>, baseURL?: string): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.get<T>(endpoint, {
      baseURL: baseURL || API_BASE_URL,
      params: {
        tenantId,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * Generic POST request with tenant filtering
   */
  private async post<T>(endpoint: string, data: any, baseURL?: string): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.post<T>(endpoint, {
      tenantId,
      ...data,
    }, {
      baseURL: baseURL || API_BASE_URL,
    });
    return response.data;
  }

  /**
   * Generic PUT request with tenant filtering
   */
  private async put<T>(endpoint: string, data: any, baseURL?: string): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.put<T>(endpoint, {
      tenantId,
      ...data,
    }, {
      baseURL: baseURL || API_BASE_URL,
    });
    return response.data;
  }

  /**
   * Generic DELETE request with tenant filtering
   */
  private async delete<T>(endpoint: string, baseURL?: string): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.delete<T>(endpoint, {
      baseURL: baseURL || API_BASE_URL,
      params: { tenantId },
    });
    return response.data;
  }

  // ========================================================================
  // DASHBOARD API
  // ========================================================================

  async getDashboard(userId: string) {
    return this.get(`/dashboard`, { userId });
  }

  // ========================================================================
  // COURSES API (Port 8091)
  // ========================================================================

  async getCourses(filters?: { category?: string; type?: string; search?: string }) {
    return this.get('/courses', filters, COURSE_API);
  }

  async getCourseById(courseId: string) {
    return this.get(`/courses/${courseId}`, {}, COURSE_API);
  }

  async getMandatoryCourses() {
    return this.get('/courses', { mandatory: true }, COURSE_API);
  }

  // ========================================================================
  // ENROLLMENTS API (Port 10092)
  // ========================================================================

  async getEnrollments(userId: string, status?: string) {
    return this.get('/enrollments', { userId, status }, ENROLLMENT_API);
  }

  async enrollInCourse(userId: string, courseId: string) {
    return this.post('/enrollments', { userId, courseId }, ENROLLMENT_API);
  }

  async updateEnrollmentProgress(enrollmentId: string, progress: number) {
    return this.put(`/enrollments/${enrollmentId}`, { progress }, ENROLLMENT_API);
  }

  // ========================================================================
  // CERTIFICATIONS API (Port 10093)
  // ========================================================================

  async getCertifications(userId: string) {
    return this.get('/certifications', { userId }, CERTIFICATION_API);
  }

  async getRequiredCertifications() {
    return this.get('/certifications', { required: true }, CERTIFICATION_API);
  }

  // ========================================================================
  // SKILLS API (Port 10094)
  // ========================================================================

  async getUserSkills(userId: string) {
    return this.get('/user-skills', { userId }, SKILLS_API);
  }

  async getSkillsFramework() {
    return this.get('/skills', {}, SKILLS_API);
  }

  async getSkillsGapAnalysis(userId?: string) {
    return this.get('/skills/gap-analysis', userId ? { userId } : {}, SKILLS_API);
  }

  async updateUserSkill(userId: string, skillId: string, level: number) {
    return this.put('/user-skills', { userId, skillId, currentLevel: level }, SKILLS_API);
  }

  // ========================================================================
  // EMPLOYEES API (Port 8097 - Employee Sync Service)
  // ========================================================================

  async getEmployees(filters?: { department?: string; status?: string }) {
    return this.get('/employees/list', filters, EMPLOYEE_SYNC_API);
  }

  async getEmployeeById(employeeId: string) {
    return this.get(`/employees/${employeeId}`, {}, EMPLOYEE_SYNC_API);
  }

  async getEmployeeCount() {
    return this.get('/employees/count', {}, EMPLOYEE_SYNC_API);
  }

  async getOrgHierarchy() {
    return this.get('/employees/list', {}, EMPLOYEE_SYNC_API);
  }

  // ========================================================================
  // TRAINING COMPLIANCE API
  // ========================================================================

  async getComplianceStatus() {
    return this.get('/assignments', { status: 'PENDING' }, ASSIGNMENT_API);
  }

  async getComplianceByCourse() {
    return this.get('/assignments/by-course', {}, ASSIGNMENT_API);
  }

  // ========================================================================
  // TRAINING ASSIGNMENTS API (Port 10095)
  // ========================================================================

  async getAssignments(userId?: string) {
    return this.get('/assignments', userId ? { userId } : {}, ASSIGNMENT_API);
  }

  async createAssignment(data: {
    employeeId: string;
    courseId: string;
    dueDate: string;
    priority: string;
  }) {
    return this.post('/assignments', data, ASSIGNMENT_API);
  }

  async bulkAssignCourse(data: {
    courseId: string;
    employeeIds: string[];
    dueDate: string;
    priority: string;
    notes?: string;
  }) {
    return this.post('/assignments/bulk', data, ASSIGNMENT_API);
  }

  // ========================================================================
  // PROJECTS API (Port 8096)
  // ========================================================================

  async getProjects(status?: string) {
    return this.get('/projects', status ? { status } : {}, PROJECT_API);
  }

  async getProjectById(projectId: string) {
    return this.get(`/projects/${projectId}`, {}, PROJECT_API);
  }

  async createProject(data: {
    projectName: string;
    description?: string;
    startDate: string;
    endDate: string;
    status?: string;
  }) {
    return this.post('/projects', data, PROJECT_API);
  }

  async updateProject(projectId: string, data: any) {
    return this.put(`/projects/${projectId}`, data, PROJECT_API);
  }

  async deleteProject(projectId: string) {
    return this.delete(`/projects/${projectId}`, PROJECT_API);
  }

  // ========================================================================
  // PROJECT SKILLS MANAGEMENT
  // ========================================================================

  async addProjectSkill(projectId: string, data: { skillId: string; requiredLevel: number }) {
    return this.post(`/projects/${projectId}/skills`, data, PROJECT_API);
  }

  async removeProjectSkill(projectId: string, skillId: string) {
    return this.delete(`/projects/${projectId}/skills/${skillId}`, PROJECT_API);
  }

  async getProjectSkillsMap(projectId: string) {
    return this.get(`/projects/${projectId}/skills`, {}, PROJECT_API);
  }

  async getProjectGapAnalysis(projectId: string) {
    return this.get(`/projects/${projectId}/gap-analysis`, {}, PROJECT_API);
  }

  async analyzeProjectGaps(projectId: string) {
    return this.post(`/projects/${projectId}/analyze-gaps`, {}, PROJECT_API);
  }

  async getProjectTrainingAssignments(projectId: string) {
    return this.get(`/projects/${projectId}/training-assignments`, {}, PROJECT_API);
  }

  async autoAssignProjectTraining(projectId: string) {
    return this.post(`/projects/${projectId}/auto-assign-training`, {}, PROJECT_API);
  }

  async getProjectReadinessScore(projectId: string) {
    return this.get(`/projects/${projectId}/readiness-score`, {}, PROJECT_API);
  }

  async getProjectRiskAssessment(projectId: string) {
    return this.get(`/projects/${projectId}/risk-assessment`, {}, PROJECT_API);
  }

  // ========================================================================
  // PERFORMANCE MAPPING API
  // ========================================================================

  async getUserPerformance(userId: string) {
    return this.get('/performance', { userId }, ENROLLMENT_API);
  }

  async getTrainingImpact() {
    return this.get('/training-impact', {}, ENROLLMENT_API);
  }

  async getPerformanceData() {
    return this.get('/performance', {}, ENROLLMENT_API);
  }

  // ========================================================================
  // MENTORSHIP API
  // ========================================================================

  async getMentors() {
    return this.get('/mentors', {}, SKILLS_API);
  }

  async getUserMentorships(userId: string) {
    return this.get('/mentorship/sessions', { userId }, SKILLS_API);
  }

  async requestMentorship(mentorId: string, focusAreas: string[]) {
    const userId = this.getTenantContext().userId;
    return this.post('/mentorship', { menteeId: userId, mentorId, focusAreas }, SKILLS_API);
  }
}

// Export singleton instance
export const LearningAPIService = new LearningAPIServiceClass();

// Export types
export type { TenantContext };

