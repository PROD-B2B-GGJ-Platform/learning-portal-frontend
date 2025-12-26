/**
 * Learning Portal API Service
 * Centralized API client with tenant isolation
 * All API calls automatically include tenantId from JWT
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API Base URLs (from environment or defaults)
// Multiple microservices - route to correct service
const COURSE_API = 'http://localhost:8091/api/v1';
const ENROLLMENT_API = 'http://localhost:8092/api/v1';
const SKILLS_API = 'http://localhost:8094/api/v1';
const PROJECT_API = 'http://localhost:8096/api/v1';
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
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.get<T>(endpoint, {
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
  private async post<T>(endpoint: string, data: any): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.post<T>(endpoint, {
      tenantId,
      ...data,
    });
    return response.data;
  }

  /**
   * Generic PUT request with tenant filtering
   */
  private async put<T>(endpoint: string, data: any): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.put<T>(endpoint, {
      tenantId,
      ...data,
    });
    return response.data;
  }

  /**
   * Generic DELETE request with tenant filtering
   */
  private async delete<T>(endpoint: string): Promise<T> {
    const tenantId = this.getTenantContext().tenantId;
    const response = await this.apiClient.delete<T>(endpoint, {
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
  // COURSES API
  // ========================================================================

  async getCourses(filters?: { category?: string; type?: string; search?: string }) {
    return this.get('/courses', filters);
  }

  async getCourseById(courseId: string) {
    return this.get(`/courses/${courseId}`);
  }

  async getMandatoryCourses() {
    return this.get('/courses/mandatory');
  }

  // ========================================================================
  // ENROLLMENTS API
  // ========================================================================

  async getEnrollments(userId: string, status?: string) {
    return this.get('/enrollments', { userId, status });
  }

  async enrollInCourse(userId: string, courseId: string) {
    return this.post('/enrollments', { userId, courseId });
  }

  async updateEnrollmentProgress(enrollmentId: string, progress: number) {
    return this.put(`/enrollments/${enrollmentId}/progress`, { progress });
  }

  // ========================================================================
  // CERTIFICATIONS API
  // ========================================================================

  async getCertifications(userId: string) {
    return this.get('/certifications', { userId });
  }

  async getRequiredCertifications() {
    return this.get('/certifications/required');
  }

  // ========================================================================
  // SKILLS API
  // ========================================================================

  async getUserSkills(userId: string) {
    return this.get('/skills/user', { userId });
  }

  async getSkillsFramework() {
    return this.get('/skills/framework');
  }

  async getSkillsGapAnalysis(userId?: string) {
    return this.get('/skills/gap-analysis', userId ? { userId } : {});
  }

  async updateUserSkill(userId: string, skillId: string, level: number) {
    return this.put('/skills/user', { userId, skillId, currentLevel: level });
  }

  // ========================================================================
  // MENTORSHIP API
  // ========================================================================

  async getMentors() {
    return this.get('/mentors');
  }

  async getUserMentorships(userId: string) {
    return this.get('/mentorship/sessions', { userId });
  }

  async requestMentorship(mentorId: string, focusAreas: string[]) {
    const userId = this.getTenantContext().userId;
    return this.post('/mentorship', { menteeId: userId, mentorId, focusAreas });
  }

  // ========================================================================
  // EMPLOYEES API (from employee_references table)
  // ========================================================================

  async getEmployees(filters?: { department?: string; status?: string }) {
    return this.get('/employees', filters);
  }

  async getOrgHierarchy() {
    return this.get('/org-structure');
  }

  // ========================================================================
  // TRAINING COMPLIANCE API
  // ========================================================================

  async getComplianceStatus() {
    return this.get('/compliance');
  }

  async getComplianceByCourse() {
    return this.get('/compliance/by-course');
  }

  // ========================================================================
  // TRAINING ASSIGNMENTS API
  // ========================================================================

  async getAssignments(userId?: string) {
    return this.get('/assignments', userId ? { userId } : {});
  }

  async createAssignment(data: {
    userId: string;
    courseId: string;
    dueDate: string;
    priority: string;
  }) {
    return this.post('/assignments', data);
  }

  async bulkAssignCourse(data: {
    courseId: string;
    userIds: string[];
    dueDate: string;
    priority: string;
  }) {
    return this.post('/assignments/bulk', data);
  }

  // ========================================================================
  // PROJECTS API
  // ========================================================================

  async getProjects(status?: string) {
    return this.get('/projects', status ? { status } : {});
  }

  async getProjectById(projectId: string) {
    return this.get(`/projects/${projectId}`);
  }

  async createProject(data: {
    projectName: string;
    startDate: string;
    endDate: string;
    requiredSkills: Array<{ skillId: string; requiredLevel: number }>;
  }) {
    return this.post('/projects', data);
  }

  async getProjectSkillsMap(projectId: string) {
    return this.get(`/projects/${projectId}/skills-map`);
  }

  async getProjectGapAnalysis(projectId: string) {
    return this.post(`/projects/${projectId}/analyze-gaps`, {});
  }

  async getProjectTrainingAssignments(projectId: string) {
    return this.get(`/projects/${projectId}/training-assignments`);
  }

  async getProjectReadinessScore(projectId: string) {
    return this.get(`/projects/${projectId}/readiness-score`);
  }

  async autoAssignTraining(projectId: string) {
    return this.post(`/projects/${projectId}/auto-assign-training`, {});
  }

  // ========================================================================
  // PERFORMANCE MAPPING API
  // ========================================================================

  async getUserPerformance(userId: string) {
    return this.get('/performance', { userId });
  }

  async getTrainingImpact() {
    return this.get('/training-impact');
  }

  async getPerformanceData() {
    return this.get('/performance');
  }

  // ========================================================================
  // ASSIGNMENT & BULK OPERATIONS
  // ========================================================================

  async bulkAssignCourse(data: any) {
    return this.post('/assignments/bulk', data);
  }

  // ========================================================================
  // PROJECT SKILLS MANAGEMENT
  // ========================================================================

  async addProjectSkill(projectId: string, data: any) {
    return this.post(`/projects/${projectId}/skills`, data);
  }

  async removeProjectSkill(projectId: string, skillId: string) {
    return this.delete(`/projects/${projectId}/skills/${skillId}`);
  }

  async getProjectGapAnalysis(projectId: string) {
    return this.get(`/projects/${projectId}/gap-analysis`);
  }

  async analyzeProjectGaps(projectId: string) {
    return this.post(`/projects/${projectId}/analyze-gaps`, {});
  }

  async autoAssignProjectTraining(projectId: string) {
    return this.post(`/projects/${projectId}/auto-assign-training`, {});
  }

  async getProjectRiskAssessment(projectId: string) {
    return this.get(`/projects/${projectId}/risk-assessment`);
  }
}

// Export singleton instance
export const LearningAPIService = new LearningAPIServiceClass();

// Export types
export type { TenantContext };

