# EduPath OS - Project Context & Progress

**Project**: Education Operating System  
**Status**: Foundation Built + Auth System Required ✅  
**Last Updated**: December 14, 2025

---

## 🎯 MASTER PROMPT — EduPath OS (Local DB + Auth + Admin + Code Lab)

Build a complete, production-ready web app called **EduPath OS**.

This version MUST be fully runnable **locally** with:
- A **local SQLite database**
- Login / Register
- Role-based access
- Admin panel
- Minimal backend
- Code Lab supporting **Python + C#**

This is not a demo. It must work end-to-end on a local machine.

---

## 📋 Project Overview

**EduPath OS** is a fullstack education platform for learning backend development through structured 30-day roadmaps, live code execution (Python 3 & C#), automatic grading, and AI-powered tutoring with secure authentication and role-based access control.

### Core Philosophy
1. **Thinking before answers** - Socratic method in AI tutoring
2. **Hints before solutions** - Graduated hint system
3. **Proof-based learning** - Evidence-first approach with skill tracking
4. **Progress in skills, not time** - Skill graph-based advancement
5. **Security by default** - JWT auth, HTTP-only cookies, role-based access

---

## 🏗️ TECH STACK (MANDATORY)

### Frontend
- **Framework**: Next.js + TypeScript + Tailwind
- **Styling**: Tailwind CSS (dark theme, premium feel)
- **App Router**: `/src/app` directory structure
- **UI Pattern**: Component-based, client/server separation

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API routes
- **Database**: **SQLite (local file-based DB)** stored at `./data/edupath.db`
- **ORM**: Prisma (ready to add)
- **Auth**: JWT via HTTP-only cookies
- **Password Hashing**: bcrypt
- **Code Execution**: Sandboxed Python & C# runners
- **AI Integration**: OpenAI API (user-provided key)

### Code Runners
- **Python 3**: Direct execution via shell with timeout
- **C# (.NET)**: CSC compilation + execution with timeout
- **Sandbox**: 5-second timeout, memory limits, no network access

### Authentication & Security
- **Auth**: JWT tokens in HTTP-only cookies (no localStorage)
- **Password Hashing**: bcrypt for secure password storage
- **Roles**: User and Admin roles with middleware protection
- **Admin Account**: Seeded from `.env` configuration
- **No Self-Promotion**: No UI to self-promote to Admin

---

## 📁 Project Structure

```
edupath-os/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page (hero + features)
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global Tailwind styles
│   │   ├── api/
│   │   │   └── execute/
│   │   │       └── route.ts         # Code execution endpoint
│   │   ├── codelab/
│   │   │   └── page.tsx             # Code Lab (Python/C# editor + runner)
│   │   ├── dashboard/               # Dashboard page (stub)
│   │   ├── roadmap/                 # Roadmap view (stub)
│   │   ├── skills/                  # Skill Graph (stub)
│   │   ├── evidence/                # Evidence Vault (stub)
│   │   ├── analytics/               # Analytics Dashboard (stub)
│   │   └── settings/                # Settings page (stub)
│   ├── lib/
│   │   ├── db/
│   │   │   ├── init.ts              # Database initialization & schema
│   │   │   └── seed.ts              # 30-day roadmap seed data
│   │   ├── runners/
│   │   │   ├── pythonRunner.ts      # Python code executor
│   │   │   └── csharpRunner.ts      # C# code executor
│   │   └── ai/
│   │       └── tutor.ts             # OpenAI AI tutor integration
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── components/                  # Reusable UI components (ready for expansion)
├── data/
│   └── edupath.db                   # SQLite database (auto-created)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── .env.local                       # Environment variables
└── README.md                        # Project documentation
```

---

## 💾 LOCAL DATABASE (REQUIRED)

* SQLite file stored locally at `./data/edupath.db`
* Data persists between restarts
* Migrations + seed scripts provided
* Database initialization on first run

### Setup Commands
```bash
npm run db:migrate  # Run migrations
npm run db:seed    # Seed initial data
```

---

## 🔐 AUTH & VALIDATION RULES (STRICT)

### Register Endpoint

**Name Validation**
- Minimum 3 characters
- No spaces allowed
- Letters and numbers only
- Return clear validation error if invalid

**Email Validation**
- Must be valid email format
- Must be unique in database
- Return clear validation error if invalid or duplicate

**Password Validation**
- Minimum 4 characters
- Letters and/or numbers only
- Hash with bcrypt before storage
- Return clear validation error if invalid

### Auth API Endpoints

```
POST   /api/auth/register    # Create new user account
POST   /api/auth/login       # Login with email/password
POST   /api/auth/logout      # Clear JWT cookie
GET    /api/auth/me          # Get current user info
```

### Auth Storage
- **Tokens**: HTTP-only cookies ONLY (no localStorage)
- **Passwords**: bcrypt hashed
- **Sessions**: JWT-based

---

## 👥 ROLES & ACCESS CONTROL

### User Roles
- `User` - Regular student/learner
- `Admin` - Platform administrator

### User Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'User',  -- 'User' or 'Admin'
  enabled BOOLEAN DEFAULT 1,
  openAiKey TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Account
- Seeded from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`
- No UI to self-promote to Admin
- Requires middleware protection on admin routes

---

## 🛡️ ADMIN PANEL (PROTECTED)

Admin-only routes require middleware authentication.

### Admin Capabilities
- **View all users** - List all registered users with details
- **Disable/Enable users** - Toggle user `enabled` status
- **View user activity summary** - Sessions, submissions, progress
- **View all code submissions** - Browse all submitted code
- **Filter submissions** - By user, language (Python/C#), status (pass/fail)

### Admin Routes (Protected with middleware)
```
GET    /admin                    # Admin dashboard
GET    /admin/users              # All users list
PATCH  /admin/users/:id/toggle   # Enable/disable user
GET    /admin/submissions        # All code submissions
GET    /admin/analytics          # Activity & metrics
```

---

## 💻 CODE LAB (REQUIRED)

The Code Lab is the centerpiece for hands-on learning.

### Editor Features
- **Language Toggle**: Python 3 or C# (.NET console)
- **Code Editor**: Monaco or similar with syntax highlighting
- **Run Button**: Execute code with loading state
- **Output Display**: Console output with color-coded results

### Code Execution
- **Sandbox**: Server-side isolated execution
- **Timeout**: 5 seconds maximum per execution
- **Network**: No network access from executed code
- **Resources**: Limited memory, no file system access
- **Returns**: stdout, stderr, execution time, exit code

### Test Results
- Display test case results with ✅/❌ indicators
- Show expected vs. actual output
- Track execution time
- Save submissions to database

---

## 🎯 CORE FEATURES

All features required for complete platform:

1. **Dashboard** - User progress overview, current day/exercise, quick start
2. **Roadmap Builder** - Browse/edit 30-day learning plan, mark complete
3. **Skill Graph** - Visual skill tree with dependencies, progress tracking
4. **Code Lab** - Editor with Python/C# support, test runner, AI hints
5. **Evidence Vault** - Save proof of learning with reflections
6. **Analytics** - Momentum, streaks, friction tracking, activity insights
7. **Settings** - OpenAI API key configuration, user profile

---

## 📊 DATABASE SCHEMA (MINIMUM)

### Core Tables
1. **users** - User accounts with auth & roles
2. **roadmaps** - Learning paths (30-day curriculum)
3. **roadmap_days** - Daily goals (Days 1-30)
4. **skills** - Competency definitions
5. **skill_dependencies** - Skill prerequisites (DAG)
6. **user_skills** - User's skill progress
7. **exercises** - Programming challenges
8. **exercise_test_cases** - Test validation
9. **code_submissions** - User code attempts
10. **submission_results** - Test execution results
11. **evidence_items** - Proof of learning
12. **study_sessions** - Time tracking & friction

### Table Schema Details

**users**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'User',        -- 'User' or 'Admin'
  enabled BOOLEAN DEFAULT 1,
  openAiKey TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

2. **roadmaps**
   - `id` (PRIMARY KEY)
   - `userId` (FOREIGN KEY)
   - `title`
   - `description`
   - `duration` (days)
   - `createdAt`, `updatedAt`

3. **roadmap_days**
   - `id` (PRIMARY KEY)
   - `roadmapId` (FOREIGN KEY)
   - `dayNumber` (1-30)
   - `title`, `goals`, `topics` (JSON)
   - `expectedTime` (minutes)
   - `difficulty` (beginner/intermediate/advanced)
   - `resources` (JSON array)
   - `notes`
   - `createdAt`

4. **skills**
   - `id` (PRIMARY KEY)
   - `name`
   - `description`
   - `category` (fundamentals, oop, data-structures, paradigms, backend, database, security, quality, operations, devops)
   - `createdAt`

5. **skill_dependencies**
   - `id` (PRIMARY KEY)
   - `skillId` (FOREIGN KEY)
   - `dependsOnSkillId` (FOREIGN KEY)

6. **user_skills**
   - `id` (PRIMARY KEY)
   - `userId` (FOREIGN KEY)
   - `skillId` (FOREIGN KEY)
   - `proficiencyLevel` (0-100)
   - `confidence` (0-100)
   - `reviewCount`
   - `lastReviewDate`
   - `updatedAt`

7. **exercises**
   - `id` (PRIMARY KEY)
   - `roadmapDayId` (FOREIGN KEY)
   - `title`, `description`
   - `difficulty`
   - `languages` (JSON: ["python", "csharp"])
   - `starterCodePython`, `starterCodeCSharp`
   - `createdAt`

8. **exercise_test_cases**
   - `id` (PRIMARY KEY)
   - `exerciseId` (FOREIGN KEY)
   - `name` (visible in UI)
   - `visible` (boolean)
   - `input`, `expectedOutput`
   - `language` (python/csharp)
   - `createdAt`

9. **code_submissions**
   - `id` (PRIMARY KEY)
   - `userId` (FOREIGN KEY)
   - `exerciseId` (FOREIGN KEY)
   - `roadmapDayId` (FOREIGN KEY)
   - `code`
   - `language` (python/csharp)
   - `status` (submitted/testing/passed/failed)
   - `submittedAt`

10. **submission_results**
    - `id` (PRIMARY KEY)
    - `submissionId` (FOREIGN KEY)
    - `testCaseId` (FOREIGN KEY)
    - `passed` (boolean)
    - `output`, `error`
    - `executionTime` (ms)

11. **study_sessions**
    - `id` (PRIMARY KEY)
    - `userId` (FOREIGN KEY)
    - `roadmapDayId` (FOREIGN KEY)
    - `exerciseId` (FOREIGN KEY, optional)
    - `startTime`, `endTime`
    - `frictionReason` (too_hard/unclear_next_step/tired/missing_resource)
    - `notes`

12. **evidence_items**
    - `id` (PRIMARY KEY)
    - `userId` (FOREIGN KEY)
    - `skillId` (FOREIGN KEY)
    - `roadmapDayId` (FOREIGN KEY)
    - `submissionId` (FOREIGN KEY)
    - `reflection` (user reflection)
    - `createdAt`

---

## � SEED DATA (REQUIRED)

Database must be seeded with:

### Initial Data on First Run
- **30-day roadmap** (Days 1-30 pre-populated)
- **Exercises for Days 1-5** with Python & C# versions
- **Admin user account** created from `.env` (ADMIN_EMAIL + ADMIN_PASSWORD)
- **24 skills** pre-created with categories & dependencies
- **Sample test cases** for each exercise

### Seed Commands
```bash
npm run db:seed     # Populate database with curriculum & exercises
```

### Environment Variables for Admin
```
ADMIN_EMAIL=admin@edupath.local
ADMIN_PASSWORD=admin123
```

---

## 📖 README (MANDATORY)

README.md must include:

### Setup Instructions
- Local development setup steps
- Prerequisites (Node.js, Python 3, .NET SDK)
- Installation commands

### Environment Configuration
- Example `.env.local` file
- All required environment variables
- How to obtain API keys (OpenAI)

### Database Setup
- How to run migrations
- How to seed initial data
- Database location (`./data/edupath.db`)
- How to reset database

### Running the Application
- Dev server command (`npm run dev`)
- Build command
- Production server command
- Expected URLs and ports

### Features Overview
- List all major features with brief descriptions
- Links to feature documentation

---

## �🎯 30-Day Roadmap Structure

### Seed Data Implemented
The database is pre-populated with a complete 30-day backend curriculum:

**Week 1-2: OOP & Fundamentals (Days 1-7)**
- Day 1: OOP Foundations (Classes, Objects, Encapsulation)
- Day 2: Inheritance & Polymorphism
- Day 3: Abstract Classes & Interfaces
- Day 4: Collections & Data Structures
- Day 5: Functional Programming Basics
- Day 6: Exception Handling
- Day 7: **PROJECT** - Class Design

**Week 3-4: REST APIs (Days 8-14)**
- Day 8: REST API Fundamentals
- Day 9: Building a Simple API
- Day 10: API CRUD Operations
- Day 11: Input Validation & Error Handling
- Day 12: Database Integration Basics
- Day 13: ORMs & Query Builders
- Day 14: **PROJECT** - Todo API

**Week 5-6: Authentication & Security (Days 15-21)**
- Day 15: Authentication Basics
- Day 16: Password Security & Hashing
- Day 17: JWT Tokens
- Day 18: OAuth2 & Third-party Auth
- Day 19: Protected Routes & Middleware
- Day 20: Role-Based Access Control (RBAC)
- Day 21: **PROJECT** - Secure Todo API

**Week 7-8: Testing & Operations (Days 22-28)**
- Day 22: Testing Fundamentals
- Day 23: API Testing
- Day 24: Logging & Monitoring
- Day 25: Performance & Optimization
- Day 26: Deployment Basics
- Day 27: Docker & Containerization
- Day 28: API Documentation

**Final Week: Capstone (Days 29-30)**
- Day 29: Capstone Part 1 - Task Manager API Backend
- Day 30: Capstone Part 2 - Testing & Deployment

### Skills Tracked (24 total)
- Object-Oriented Programming, Encapsulation, Inheritance, Polymorphism
- Abstract Classes, Interfaces
- Collections, Functional Programming, Exception Handling
- REST APIs, HTTP Protocol, CRUD Operations
- Database Design, SQL
- Authentication, Authorization, Password Security, JWT, OAuth2
- Testing, Logging, Performance Optimization, Deployment, Docker

---

## 🎨 Pages Implemented

### ✅ COMPLETED
1. **Landing Page** (`/`)
   - Hero section with gradient title
   - Feature cards (6 features)
   - 30-day roadmap preview
   - Navigation to Dashboard & Code Lab
   - Dark theme with premium feel

2. **Code Lab** (`/codelab`)
   - **CRITICAL FEATURE**: Live Python & C# editor
   - Language toggle (Python 3 / C# .NET)
   - Code editor (textarea with mono font)
   - ▶ Run Code button with loading state
   - Console output display (green text)
   - Test results with ✅/❌ indicators
   - Starter code templates for each language
   - Dark UI optimized for coding

### 🚧 STUBBED (Ready for expansion)
3. **Dashboard** (`/dashboard`) - User overview, progress summary
4. **Roadmap Builder** (`/roadmap`) - View/edit 30-day plan
5. **Skill Graph** (`/skills`) - Visual skill tree with dependencies
6. **Evidence Vault** (`/evidence`) - Proof of learning
7. **Analytics** (`/analytics`) - Momentum, streaks, friction insights
8. **Settings** (`/settings`) - OpenAI API key configuration

---

## 🔌 API Endpoints

### Code Execution
**POST** `/api/execute`

Request body:
```json
{
  "code": "print('Hello')",
  "language": "python",
  "userId": "user-id",
  "exerciseId": "exercise-id",
  "testCases": []
}
```

Response:
```json
{
  "submissionId": "submission-id",
  "output": "Hello\n",
  "error": "",
  "exitCode": 0,
  "executionTime": 145
}
```

**Features**:
- Saves submission to database
- Returns console output & errors
- Tracks execution time
- Supports Python 3 & C# (.NET)

---

## 🤖 AI Tutor Integration

### `src/lib/ai/tutor.ts`

#### Function: `getAIHint()`
Provides graduated hints when student's code fails tests.

**Inputs**:
- OpenAI API key
- Exercise description
- Student's code
- Test results (name, passed, error)
- Language (python/csharp)

**Output** (JSON):
```json
{
  "diagnosis": "You forgot to check for empty lists",
  "hint_level_1": "Think about edge cases",
  "hint_level_2": "Add a check at the start of the function",
  "minimal_fix": "if not lst: return None",
  "concepts_to_review": ["list validation", "edge cases"],
  "confidence": 0.85
}
```

**Philosophy**:
- ✅ Asks Socratic questions first
- ✅ Never gives complete solution
- ✅ References exact test names
- ❌ Avoids spoiling the learning

#### Function: `generateExerciseHint()`
Provides starting hint for new exercise.

---

## 🐍 Code Runners

### Python Runner (`pythonRunner.ts`)
```typescript
runPythonCode(code: string, timeout: number = 5000): Promise<RunResult>
```

**Features**:
- Executes Python 3 code
- 5-second timeout (configurable)
- Captures stdout & stderr
- Returns execution time
- Isolates per execution

**Implementation**: `child_process.exec` → Python subprocess → Capture output

### C# Runner (`csharpRunner.ts`)
```typescript
runCSharpCode(code: string, timeout: number = 5000): Promise<RunResult>
```

**Features**:
- Compiles C# with CSC (C# compiler)
- Executes compiled .exe
- 5-second timeout
- Cleans up temp files
- Captures output & errors

**Implementation**: Create temp folder → Write .cs → CSC compile → Execute → Cleanup

---

## 📦 Dependencies Installed

### Core
```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "typescript": "latest",
  "tailwindcss": "latest",
  "@tailwindcss/postcss": "latest"
}
```

### Backend & Database
```json
{
  "better-sqlite3": "^9.x",
  "@types/better-sqlite3": "^7.x",
  "uuid": "^9.x",
  "dotenv": "^16.x",
  "tmp": "^0.2.x",
  "@types/tmp": "^0.2.x"
}
```

### API & AI
```json
{
  "axios": "^1.x",
  "openai": "^4.x",
  "zod": "^3.x"
}
```

### Linting
```json
{
  "eslint": "latest",
  "eslint-config-next": "latest"
}
```

---

## 🔑 Environment Variables

**Create `.env.local`**:
```bash
OPENAI_API_KEY=your-api-key-here
DATABASE_URL=./data/edupath.db
NODE_ENV=development
```

---

## 🚀 Running the Project

### Development
```bash
cd /Users/test/Desktop/edupath-os
npm run dev
```

**Runs on**: `http://localhost:3000`

### Build
```bash
npm run build
npm start
```

### Database Seeding
Seeds happen automatically on first app load via `seedDatabase()` in `src/lib/db/seed.ts`

---

## ✅ What's Implemented

### Database & Data
- ✅ SQLite schema with 12 tables
- ✅ 30-day roadmap seeded (Days 1-30)
- ✅ 24 skills pre-created
- ✅ Sample exercises & test cases
- ✅ User management ready

### Code Execution
- ✅ Python 3 runner with sandbox
- ✅ C# (.NET) runner with compilation
- ✅ Timeout handling (5 seconds)
- ✅ Error capture & logging
- ✅ Execution time tracking

### Frontend Pages
- ✅ Landing page (hero + features)
- ✅ Code Lab (editor + runner)
- ✅ Navigation structure
- ✅ Dark theme (Tailwind)

### AI Integration
- ✅ OpenAI API integration
- ✅ Socratic hint generation
- ✅ Graduated hint levels
- ✅ Minimal fix suggestions
- ✅ Concept review lists

### API
- ✅ Code execution endpoint
- ✅ Submission persistence
- ✅ Test result tracking

---

## 🚧 What Needs Completion

### High Priority
- [ ] **Dashboard** - User progress overview, current day/exercise
- [ ] **Roadmap Viewer** - Browse all 30 days, mark complete
- [ ] **Exercise Integration** - Link exercises to Code Lab
- [ ] **Test Case UI** - Display test results with details
- [ ] **AI Tutor Button** - "Get a hint" button in Code Lab
- [ ] **Evidence Collection** - "Save as evidence" after passing

### Medium Priority
- [ ] **Skill Graph Visualization** - Interactive skill tree
- [ ] **Analytics Dashboard** - Momentum, streaks, friction tracking
- [ ] **Settings UI** - OpenAI key input, user profile
- [ ] **Auth System** - User login/registration (optional for MVP)
- [ ] **Study Sessions** - Track time spent per exercise

### Lower Priority
- [ ] **OAuth2 Integration** - Social login
- [ ] **Advanced Testing** - Hidden test cases
- [ ] **Performance** - Query optimization, caching
- [ ] **Deployment** - Docker, CI/CD, production server

---

## 🎯 MVP Checklist for Launch

### Core User Flow
- [ ] User sees landing page
- [ ] Clicks "Start Learning"
- [ ] Goes to Code Lab
- [ ] Selects Python or C#
- [ ] Writes code
- [ ] Clicks "Run Code"
- [ ] Sees output ✅ / Sees error ❌
- [ ] If fails, clicks "Get a hint"
- [ ] Sees AI hint (no spoiler)
- [ ] Fixes code, submits again
- [ ] Code passes
- [ ] Clicks "Save as Evidence"
- [ ] Writes reflection
- [ ] Skill increases
- [ ] Moves to next exercise

### Technical Checklist
- ✅ Database created & seeded
- ✅ Code runners working
- ✅ API endpoint functioning
- ✅ Landing & Code Lab pages ready
- ✅ AI integration ready
- [ ] Exercise mapping complete
- [ ] Test case runner integrated
- [ ] Evidence saving UI
- [ ] Skill tracking display

---

## 📝 Code Quality

### TypeScript
- ✅ Strict mode enabled
- ✅ Full type coverage for models
- ✅ API responses typed

### ESLint
- ✅ Next.js recommended config
- ✅ Auto-formatting with Tailwind

### Database
- ✅ Migrations via SQL scripts
- ✅ Better-sqlite3 (sync) for simplicity
- ✅ Foreign key constraints

---

## 🔐 Security Considerations

### Code Execution
- ⚠️ Sandboxed subprocess execution
- ⚠️ 5-second timeout prevents infinite loops
- ⚠️ No file system access (temp files only)
- ⚠️ No network access from executed code

### API Keys
- ⚠️ OpenAI key stored in `.env.local`
- ⚠️ Never exposed to frontend
- ⚠️ Backend-only API calls

### Database
- ⚠️ SQLite good for MVP
- ⚠️ Foreign key constraints enabled
- ⚠️ Should add input validation on API

---

## 📚 Learning Resources

### For Students
- 30-day curriculum guides them step-by-step
- Exercises are language-agnostic (Python or C#)
- Tests validate correctness
- AI hints guide without spoiling

### For Developers
- Code is well-structured
- Types are clear
- Seeds are data-driven
- Database schema is documented

---

## 🎓 Next Steps Priority Order

1. **Dashboard** (5 hours)
   - Show current day/exercise
   - Progress bar
   - Quick start button

2. **Exercise Integration** (8 hours)
   - Link exercises to Code Lab
   - Load starter code
   - Display test cases

3. **Roadmap Viewer** (4 hours)
   - List all 30 days
   - Show completed/current/locked
   - Mark complete

4. **AI Tutor UI** (3 hours)
   - "Get hint" button
   - Display hints with levels
   - Track hint usage

5. **Evidence System** (4 hours)
   - Save reflection
   - Link to skill
   - Display in vault

6. **Skill Graph** (6 hours)
   - D3 or similar visualization
   - Show dependencies
   - Update on evidence

7. **Analytics** (5 hours)
   - Momentum chart
   - Skill radar
   - Friction tracker

---

## 📖 File Reference Quick Links

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript interfaces |
| `src/lib/db/init.ts` | Database schema & initialization |
| `src/lib/db/seed.ts` | 30-day roadmap data |
| `src/lib/runners/pythonRunner.ts` | Python 3 executor |
| `src/lib/runners/csharpRunner.ts` | C# (.NET) executor |
| `src/lib/ai/tutor.ts` | OpenAI integration |
| `src/app/page.tsx` | Landing page |
| `src/app/codelab/page.tsx` | Code Lab editor |
| `src/app/api/execute/route.ts` | Execution endpoint |
| `.env.local` | Configuration |
| `package.json` | Dependencies |

---

## 💡 Design Philosophy

**EduPath OS** is NOT a course platform—it's an **Education Operating System**.

Key differences:
1. **Roadmaps are living documents** - Students can customize their path
2. **Evidence over time** - Proof of learning, not just completion
3. **Skills are first-class citizens** - Progress measured in skills, not hours
4. **AI enables, not teaches** - Hints guide thinking, don't replace learning
5. **Code is the only proof** - No quizzes, only working programs

---

## 📞 Support & Debugging

### Common Issues

**"Code doesn't run"**
- Check Python 3 / CSC (C# compiler) installed
- Verify timeout in environment
- Check error message

**"Database missing"**
- Delete `/data/edupath.db` and restart
- `seedDatabase()` auto-runs on init

**"AI hints not working"**
- Check `OPENAI_API_KEY` in `.env.local`
- Verify API key validity
- Check network connection

---

## 🔒 HARD CONSTRAINTS (NON-NEGOTIABLE)

These requirements are **mandatory** for the project:

1. **Must work fully locally** - No external services except OpenAI API
2. **SQLite required** - Local file-based database at `./data/edupath.db`
3. **Auth & roles required** - Login/Register/JWT not optional
4. **Role-based access** - User and Admin roles enforced
5. **Password security** - bcrypt hashing mandatory
6. **HTTP-only cookies** - JWT stored in cookies, not localStorage
7. **Admin account seeded** - From `.env` at database initialization
8. **No self-promotion UI** - Cannot promote User to Admin via UI
9. **Code execution sandbox** - 5-second timeout, no network, memory limits
10. **Clean readable code** - Proper TypeScript types, documented functions

### What FAILS the project
- ❌ Storing auth in localStorage
- ❌ Plaintext passwords in database
- ❌ Missing admin panel
- ❌ Code execution without sandbox
- ❌ Dependent on external services (except OpenAI)
- ❌ Missing database migrations
- ❌ No seed data

---

## 🎉 Project Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Database | ✅ Complete | 12 tables, seeded, ready |
| Python Runner | ✅ Complete | Works, timeout enabled |
| C# Runner | ✅ Complete | Compiles & runs |
| Code Lab UI | ✅ Complete | Editor, output, test display |
| Landing Page | ✅ Complete | Features + roadmap preview |
| AI Tutor | ✅ Complete | OpenAI integration ready |
| API Execution | ✅ Complete | `/api/execute` functional |
| **Auth System** | 🚧 TODO | Register/Login/Logout/Me endpoints |
| **Admin Panel** | 🚧 TODO | User management, submission review |
| **Role-Based Access** | 🚧 TODO | Middleware, user/admin routes |
| Dashboard | 🚧 Stub | Needs implementation |
| Roadmap Viewer | 🚧 Stub | Needs implementation |
| Skill Graph | 🚧 Stub | Needs D3 visualization |
| Evidence System | 🚧 Stub | Needs UI & logic |
| Analytics | 🚧 Stub | Needs charts |

**Overall**: Foundation is solid ✅. **Auth & Admin system is CRITICAL NEXT STEP**.

---

## 📋 NEXT IMMEDIATE ACTIONS (PRIORITY ORDER)

Based on the new master prompt, these are the critical next steps:

### 🔴 CRITICAL (Must implement first)
1. **Auth System** (12 hours)
   - User registration with validation
   - Login with JWT + HTTP-only cookies
   - Logout endpoint
   - Current user endpoint (`/api/auth/me`)
   - Role-based middleware

2. **Admin Account Seeding** (2 hours)
   - Create admin user from `.env` variables
   - Seed on database initialization
   - No UI to self-promote

3. **Admin Panel** (8 hours)
   - User list view
   - Enable/disable users
   - View all code submissions
   - Filter by user/language/status

### 🟡 HIGH PRIORITY (After auth)
4. **Dashboard** (4 hours) - User's current progress
5. **Role-Based Middleware** (3 hours) - Protect routes
6. **Validation System** (2 hours) - Name/email/password validation

### 🟢 MEDIUM PRIORITY
7. Roadmap Viewer
8. Evidence System
9. Analytics Dashboard

---

Last updated: **December 14, 2025 (Updated with Master Prompt)**  
Project Location: `/Users/test/Desktop/edupath-os`
