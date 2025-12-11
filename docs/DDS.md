# Learning Portal Frontend - Design Document Specification (DDS)

## Document Information

| Field | Value |
|-------|-------|
| Application Name | learning-portal-frontend |
| Version | 10.0.0.1 |
| Port | 3030 |
| Cluster | Learning & Development |
| Last Updated | December 2025 |

---

## 1. Overview

### 1.1 Purpose
The Learning Portal Frontend is the employee-facing user interface for the L&D cluster, providing course browsing, enrollment, progress tracking, and certification management.

### 1.2 Scope
- Course catalog and search
- Enrollment and progress tracking
- Certification gallery
- Skill matrix visualization
- Mentorship management

---

## 2. Architecture

### 2.1 Technology Stack
| Component | Technology |
|-----------|------------|
| Framework | React 18+ |
| Build Tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| HTTP Client | Axios |
| Routing | React Router DOM |

### 2.2 Backend Services
| Service | Port | Purpose |
|---------|------|---------|
| Course Management | 8040 | Courses, enrollment |
| Training Schedule | 8041 | Sessions |
| Training Assignment | 8110 | Assignments |
| Skill Matrix | 8111 | Skills |
| Mentorship | 8112 | Mentorship |
| Certification | 3035 | Certificates |
| Skill Assessment | 3006 | Assessments |
| LMS Integration | 3007 | External LMS |

---

## 3. Component Structure

### 3.1 Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | / | Learning overview |
| Course Catalog | /courses | Browse courses |
| My Learning | /my-learning | Enrolled courses |
| Certifications | /certifications | Earned certs |
| Skills | /skills | Skill matrix |
| Mentorship | /mentorship | Mentorship |

### 3.2 Components
| Component | Purpose |
|-----------|---------|
| Layout | Sidebar navigation |
| CourseCard | Course display |
| ProgressBar | Progress indicator |
| CertificateCard | Certificate display |
| SkillBadge | Skill indicator |

---

## 4. Design System

### 4.1 Theme
- Dark mode matching main platform
- Primary color: Cyan (#06b6d4)
- Background: Dark gray (#1e1e2e)
- Cards: Slightly lighter (#2e2e3e)

### 4.2 Typography
- Font: Inter
- Headings: Bold, large
- Body: Regular, readable

---

## 5. State Management

### 5.1 Approach
- React Query for server state
- React Context for global state
- Local state for UI components

### 5.2 Data Fetching
- Axios for HTTP requests
- Error boundaries for failures
- Loading states for async operations

