# Learning Portal Frontend

## Overview

The Learning Portal Frontend is the employee-facing user interface for the Learning & Development cluster. It provides a modern, dark-themed interface matching the main B2B platform design.

## Port

**3030**

## Tech Stack

- React 18+
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React (icons)

## Pages/Routes

| Route | Component | Description |
|-------|-----------|-------------|
| / | Dashboard | Learning overview and quick stats |
| /courses | CourseCatalog | Browse available courses |
| /my-learning | MyLearning | Enrolled courses and progress |
| /certifications | Certifications | Earned certificates |
| /skills | Skills | Skill matrix and gap analysis |
| /mentorship | Mentorship | Mentorship programs |

## Features

- Dark theme matching main platform
- Course browsing with filters
- Enrollment and progress tracking
- Certificate gallery
- Skill matrix visualization
- Mentorship session management

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:8040 |

## Backend Services

| Service | Port | Purpose |
|---------|------|---------|
| Course Management | 8040 | Course catalog |
| Training Schedule | 8041 | Training sessions |
| Certification | 3035 | Certificates |
| Skill Assessment | 3006 | Assessments |
| Skill Matrix | 8111 | Skills tracking |
| Mentorship | 8112 | Mentorship |

## Version

10.0.0.1

