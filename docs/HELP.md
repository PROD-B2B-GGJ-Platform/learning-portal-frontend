# Learning Portal Frontend - Help Guide

## Quick Start

### Installation
```bash
cd learning-development-cluster/learning-portal-frontend
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:3030
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

---

## Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API | http://localhost:8040 |

### Backend Requirements
Ensure these services are running:
| Service | Port |
|---------|------|
| Course Management | 8040 |
| Training Schedule | 8041 |
| Training Assignment | 8110 |
| Skill Matrix | 8111 |
| Mentorship | 8112 |
| Certification | 3035 |
| Skill Assessment | 3006 |

---

## Features

### Course Catalog
1. Browse all available courses
2. Filter by category, level
3. Search by keyword
4. Click to view details
5. Enroll in courses

### My Learning
1. View enrolled courses
2. See progress percentage
3. Continue where you left off
4. View completed courses

### Certifications
1. View all earned certificates
2. Download PDF certificates
3. See expiry dates
4. Track renewal status

### Skills
1. View skill matrix
2. See proficiency levels
3. Identify skill gaps
4. Get course recommendations

### Mentorship
1. View mentor/mentee relationship
2. Schedule sessions
3. Track goals
4. Provide feedback

---

## Troubleshooting

### Blank Page
- Check if backend services are running
- Verify CORS settings in backend
- Check browser console for errors

### API Errors
- Verify API base URLs in `src/services/api.ts`
- Check network tab for failed requests

### Styling Issues
- Run `npm run dev` to regenerate CSS
- Check Tailwind config

---

## Project Structure

```
src/
├── App.tsx           # Main app component
├── main.tsx          # Entry point
├── components/
│   └── Layout.tsx    # Sidebar layout
├── pages/
│   ├── Dashboard.tsx
│   ├── CourseCatalog.tsx
│   ├── MyLearning.tsx
│   ├── Certifications.tsx
│   ├── Skills.tsx
│   └── Mentorship.tsx
├── services/
│   └── api.ts        # API client
└── styles/
    └── index.css     # Global styles
```

## Version
10.0.0.1

