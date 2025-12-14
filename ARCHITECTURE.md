# EduPath OS - Architecture & Design Document

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Landing   │  │  Code Lab    │  │   Dashboard     │   │
│  │   Page      │  │  (Editor)    │  │   (Roadmap)     │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │Skill Graph  │  │  Evidence    │  │   Analytics     │   │
│  │ (D3 viz)    │  │   Vault      │  │  (Charts)       │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
│                                                              │
│  All pages: Dark theme, Tailwind CSS, TypeScript           │
└─────────────────────────────────────────────────────────────┘
                            ↕ API Routes
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js Routes)              │
│                                                              │
│  POST /api/execute     → Code Execution                    │
│  POST /api/hint        → AI Hint Generation                │
│  POST /api/evidence    → Save Evidence                     │
│  GET  /api/user        → User Progress                     │
│  GET  /api/skills      → Skill Data                        │
│  ... more endpoints ready for implementation               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↕ Backend Logic
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND LOGIC (Node.js)                    │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ Code Execution   │  │ AI Tutor         │              │
│  │ Service          │  │ (OpenAI)         │              │
│  │                  │  │                  │              │
│  │ • Python Runner  │  │ • Hint Gen       │              │
│  │ • C# Runner      │  │ • Diagnosis      │              │
│  │ • Sandbox        │  │ • Guidance       │              │
│  │ • Timeout        │  │                  │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ Database Logic   │  │ Skill Tracking   │              │
│  │                  │  │                  │              │
│  │ • CRUD ops       │  │ • Update levels  │              │
│  │ • Queries        │  │ • Dependencies   │              │
│  │ • Transactions   │  │ • Evidence link  │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↕ Data Layer
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (SQLite)                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  users  │  roadmaps  │  roadmap_days  │ exercises   │  │
│  │  skills │ skill_deps │ user_skills    │ test_cases  │  │
│  │  submissions  │  results  │  evidence  │ sessions   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Format: better-sqlite3 (sync, simple)                     │
│  Location: ./data/edupath.db                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Code Submission → Evaluation → Learning

```
STUDENT WORKFLOW
┌─────────────────────────────────────────────────────────────┐
│ 1. NAVIGATION                                               │
│    User goes to /codelab                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CODE SELECTION                                           │
│    • Choose roadmap day                                     │
│    • Select exercise                                        │
│    • Pick language (Python / C#)                           │
│    • See starter code                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CODE ENTRY                                               │
│    User writes code in editor                               │
│    Real-time syntax highlighting (Tailwind monospace)      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SUBMISSION                                               │
│    Click "▶ Run Code"                                       │
│    POST /api/execute                                        │
│    Body: { code, language, exerciseId, userId, testCases } │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. EXECUTION (Backend)                                      │
│    ├─ Create submission record in DB                        │
│    ├─ Run code in sandbox:                                 │
│    │  ├─ Python: python3 {code} (timeout 5s)              │
│    │  └─ C#: csc compile → execute (timeout 5s)           │
│    ├─ Capture output & errors                              │
│    └─ Run against test cases                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. EVALUATION                                               │
│    ├─ Compare output vs expected                            │
│    ├─ Create SubmissionResult records                       │
│    ├─ Mark: PASSED or FAILED                               │
│    └─ Track execution time                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. RESPONSE TO FRONTEND                                     │
│    Return:                                                  │
│    {                                                        │
│      submissionId,                                          │
│      output,        // console output                       │
│      error,         // if any                               │
│      exitCode,      // 0 = success                          │
│      executionTime  // milliseconds                         │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. DISPLAY RESULTS                                          │
│    Frontend shows:                                          │
│    ├─ Console output (green text)                          │
│    ├─ Test results (✅ PASSED / ❌ FAILED)                 │
│    ├─ Error messages (red text)                            │
│    └─ Execution time                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        │                                       │
        ↓ IF PASSED                        ↓ IF FAILED
   ┌──────────────────┐              ┌──────────────────┐
   │ PASS FLOW        │              │ FAIL FLOW        │
   │                  │              │                  │
   │ "Save as Evidence"              │ "Get a Hint"     │
   │ "Next Exercise" │              │ "Try Again"      │
   │                  │              │                  │
   └──────────────────┘              └──────────────────┘
        ↓                                      ↓
   ┌──────────────────┐              ┌──────────────────┐
   │ EVIDENCE FLOW    │              │ HINT FLOW        │
   │                  │              │                  │
   │ 1. Prompt: Write │              │ 1. Send to AI:   │
   │    reflection    │              │    - Exercise    │
   │ 2. Save evidence │              │    - Code        │
   │    + skill link  │              │    - Test errors │
   │ 3. Update skill: │              │ 2. AI returns:   │
   │    ↑ Level       │              │    - Diagnosis   │
   │    ↑ Confidence  │              │    - Hint 1      │
   │ 4. Next exercise │              │    - Hint 2      │
   │                  │              │    - Concepts    │
   └──────────────────┘              │ 3. Display hints │
        ↓                            │    (no spoilers) │
   SKILL GRAPH UPDATES               │ 4. Student tries │
   - Add evidence node               │    again         │
   - Increase skill level            │                  │
   - Calculate momentum              └──────────────────┘
   - Check prerequisites                    ↓
                                   LOOP: Try Again
```

---

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE ENTITIES                            │
│                                                              │
│  Users                                                      │
│  ├─ id, email, name, openAiKey                            │
│  │                                                          │
│  ├─ 1→N Roadmaps (user can have multiple paths)            │
│  │  ├─ id, userId, title, duration (days)                 │
│  │  │                                                      │
│  │  └─ 1→N RoadmapDays (30 days per roadmap)              │
│  │     ├─ id, dayNumber, title, goals, topics             │
│  │     │                                                  │
│  │     ├─ 1→N Exercises (multiple exercises per day)      │
│  │     │  ├─ id, title, description, languages[]          │
│  │     │  │                                               │
│  │     │  ├─ 1→N TestCases (visible + hidden)            │
│  │     │  │  ├─ id, name, expectedOutput, language       │
│  │     │  │  └─ visible: boolean                          │
│  │     │  │                                               │
│  │     │  └─ 1→N CodeSubmissions (student attempts)       │
│  │     │     ├─ id, userId, code, language, status       │
│  │     │     │                                            │
│  │     │     ├─ 1→N SubmissionResults (per test case)    │
│  │     │     │  ├─ id, passed, output, error             │
│  │     │     │  └─ testCaseId (foreign key)              │
│  │     │     │                                            │
│  │     │     └─ 0→1 EvidenceItem (if passed)             │
│  │     │        ├─ id, reflection, skillId               │
│  │     │        └─ createdAt                              │
│  │     │                                                  │
│  │     └─ 0→1 StudySession (time tracking)               │
│  │        ├─ startTime, endTime, frictionReason          │
│  │        └─ notes                                        │
│  │                                                        │
│  └─ 1→N UserSkills (student progress on skills)          │
│     ├─ userId, skillId, proficiencyLevel (0-100)        │
│     ├─ confidence (0-100)                                │
│     ├─ reviewCount, lastReviewDate                       │
│     └─ updatedAt                                         │
│                                                          │
│  Skills (knowledge graph)                               │
│  ├─ id, name, description, category                    │
│  │                                                      │
│  └─ 1→N SkillDependencies                              │
│     ├─ skillId → dependsOnSkillId                      │
│     └─ (OOP depends on Classes, etc.)                 │
│                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoint Architecture

### Current Endpoints (Implemented)

**POST /api/execute** - Code Execution
```typescript
Request: {
  code: string
  language: 'python' | 'csharp'
  userId: string
  exerciseId: string
  testCases?: TestCase[]
}

Response: {
  submissionId: string
  output: string
  error: string
  exitCode: number
  executionTime: number  // ms
}
```

### Future Endpoints (Stubs Ready)

**POST /api/hint** - Get AI Hint
```typescript
Request: {
  submissionId: string
  hintLevel: 1 | 2  // graduated hints
}

Response: AITutorResponse {
  diagnosis, hint_level_1, hint_level_2,
  minimal_fix, concepts_to_review, confidence
}
```

**POST /api/evidence** - Save Evidence
```typescript
Request: {
  submissionId: string
  skillId: string
  reflection: string
}

Response: {
  evidenceId: string
  skillUpdate: { level, confidence }
}
```

**GET /api/user/:id** - Get User Progress
```typescript
Response: {
  user: User
  roadmaps: Roadmap[]
  currentDay: number
  skills: UserSkill[]
  streaks: { current, best }
  analytics: AnalyticsData
}
```

**GET /api/skills** - Get Skill Graph
```typescript
Response: {
  skills: Skill[]
  dependencies: SkillDependency[]
  userProgress: UserSkill[]
}
```

---

## Code Execution Architecture

### Python Sandbox

```
┌──────────────────────────┐
│  Student Code (string)   │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│  Create temp file        │
│  /tmp/student_code.py    │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│  Execute: timeout 5s     │
│  python3 /tmp/code.py    │
└──────────────────────────┘
            ↓
      ┌─────┴─────┐
      ↓           ↓
   SUCCESS      ERROR
   │             │
   ↓             ↓
STDOUT      STDERR
   │             │
   └─────┬───────┘
         ↓
   Capture output
        ↓
   Return result
```

### C# Compilation & Execution

```
┌──────────────────────────┐
│  Student Code (string)   │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│  Create temp directory   │
│  /tmp/csharp_xxx/        │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│  Write code to file      │
│  Program.cs + wrapper    │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│  Compile: csc            │
│  → Program.exe           │
└──────────────────────────┘
            ↓
      ┌─────┴─────┐
      ↓           ↓
   SUCCESS      ERROR
   │             │
   ↓             ↓
Execute exe    Return error
   │
   ↓
STDOUT
   │
   └──→ Capture & Return
```

### Test Case Execution

```
For each test case:
  1. Run code with test
  2. Capture output
  3. Compare vs expected
  4. Create SubmissionResult
  5. Mark passed/failed
  6. Store error message

Result: Array<{ name, passed, output, error }>
```

---

## Skill Graph & Evidence System

### Skill Update Logic

```
┌──────────────────────────────────────┐
│  Evidence Item Created               │
│  (Code passed + reflection)          │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Identify Related Skills             │
│  (From exercise + manual selection)  │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Update UserSkill                    │
│  • proficiencyLevel += 10            │
│  • confidence += 5                   │
│  • reviewCount += 1                  │
│  • lastReviewDate = now              │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Check Dependencies                  │
│  • If main skill ↑, check parent     │
│  • Propagate confidence updates      │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Update Momentum                     │
│  • Add to streak                     │
│  • Calculate daily activity          │
│  • Suggest next exercise             │
└──────────────────────────────────────┘
```

### Skill Categories

```
SKILL HIERARCHY

fundamentals/
├─ Object-Oriented Programming
│  ├─ Encapsulation
│  ├─ Inheritance
│  ├─ Polymorphism
│  ├─ Abstract Classes
│  └─ Interfaces
├─ Exception Handling
└─ Functional Programming

data-structures/
├─ Collections
├─ Lists
├─ Dictionaries
├─ Sets
└─ Queues

backend/
├─ REST APIs
├─ HTTP Protocol
├─ CRUD Operations
└─ Routing

security/
├─ Authentication
├─ Authorization
├─ Password Security
├─ JWT Tokens
└─ OAuth2

database/
├─ SQL
├─ Database Design
├─ Queries
└─ Transactions

devops/
├─ Docker
├─ Deployment
├─ CI/CD
└─ Monitoring
```

---

## AI Tutor Architecture

### Hint Generation Flow

```
┌────────────────────────────────────┐
│  Student's Failed Submission       │
│  • Code                            │
│  • Test failures                   │
│  • Error messages                  │
└────────────────────────────────────┘
            ↓
┌────────────────────────────────────┐
│  Build AI Prompt                   │
│  • Exercise description            │
│  • Student code                    │
│  • Test results (failed only)      │
│  • Programming language context    │
│  • Constraint: No full solution!   │
└────────────────────────────────────┘
            ↓
┌────────────────────────────────────┐
│  Call OpenAI API                   │
│  Model: gpt-4 (or claude-3)       │
│  Temperature: 0.7 (some creativity)│
│  Max tokens: 1024                  │
└────────────────────────────────────┘
            ↓
┌────────────────────────────────────┐
│  Parse JSON Response               │
│  {                                 │
│    diagnosis: "...",               │
│    hint_level_1: "...",            │
│    hint_level_2: "...",            │
│    minimal_fix: "...",             │
│    concepts_to_review: [...],      │
│    confidence: 0.85                │
│  }                                 │
└────────────────────────────────────┘
            ↓
┌────────────────────────────────────┐
│  Display to Student                │
│  ✅ Level 1 hint shown             │
│  ❌ Other levels locked             │
│  💡 Concepts listed                │
│  🎯 Minimal fix (not full solution)│
└────────────────────────────────────┘
            ↓
┌────────────────────────────────────┐
│  Student Tries Again               │
│  Loop back to code execution       │
└────────────────────────────────────┘
```

### Socratic Method Implementation

```
// Pseudocode for Socratic hint generation

function generateSocraticHint(exercise, studentCode, testErrors) {
  // Step 1: Ask clarifying questions
  const questions = [
    "What do you think this test is checking?",
    "Can you walk through your code with this input?"
  ];
  
  // Step 2: Let student think (don't auto-answer)
  // Step 3: If they ask for hint, give graduated levels
  
  const hintLevel1 = "Think about the data structure";
  const hintLevel2 = "You're modifying the wrong variable";
  const hintLevel3 = "Add a check here: if (x == null)";
  
  // Step 4: Never give complete solution
  // Step 5: Always reference test names
  
  return {
    socratic_questions: questions,
    hint_level_1: hintLevel1,
    hint_level_2: hintLevel2,
    minimal_fix: hintLevel3,  // Still not complete
    concepts: ["null checking", "data structures"],
    confidence: 0.8
  };
}
```

---

## Security & Sandboxing

### Code Execution Safety

```
┌─────────────────────────────────────┐
│  Student Submits Code               │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Validation Layer                   │
│  ✓ Length check (max 50KB)         │
│  ✓ No imports of dangerous modules  │
│  ✓ Syntax validation                │
│  ✗ Block: os.system, subprocess     │
│  ✗ Block: file I/O, network         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Isolated Execution                 │
│  • Temporary file (auto-deleted)    │
│  • Separate process                 │
│  • 5-second timeout                 │
│  • Memory limit (256MB)             │
│  • No file system access            │
│  • No network access                │
│  • No access to env vars            │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Output Capture                     │
│  • Only stdout/stderr captured      │
│  • No access to process internals   │
│  • Escaped for display              │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Cleanup                            │
│  • Delete temp files                │
│  • Kill process                     │
│  • Release resources                │
└─────────────────────────────────────┘
```

### API Key Security

```
┌──────────────────────────────────────┐
│  User enters OpenAI key in Settings  │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Stored in .env.local (server-side)  │
│  ✓ Never sent to frontend            │
│  ✓ Never logged                      │
│  ✓ Only loaded in backend            │
│  ✓ Accessed via process.env only    │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Backend API calls                   │
│  POST /api/hint                      │
│  ├─ Receives: submissionId           │
│  ├─ Loads key from env               │
│  ├─ Calls OpenAI privately           │
│  ├─ Returns: hint JSON               │
│  └─ Never exposes key                │
└──────────────────────────────────────┘
```

---

## Performance Considerations

### Database Optimization
- SQLite with WAL mode (concurrent reads)
- Indexes on foreign keys
- Prepared statements (via better-sqlite3)
- Query caching for static data (skills, roadmap)

### Code Execution Optimization
- 5-second timeout prevents resource exhaustion
- Temp file cleanup automatic
- Process termination on timeout
- Stream output instead of buffering

### Frontend Optimization
- Next.js static generation for landing page
- Client-side state for code editor
- Lazy loading for heavy components
- Tailwind CSS (minimal CSS)

---

## Deployment Architecture (Future)

```
┌────────────────────────────────────────┐
│  Production Environment                │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Vercel / Railway / Heroku       │ │
│  │  - Next.js Frontend + API Routes │ │
│  │  - SQLite database (persistent)  │ │
│  │  - Environment variables         │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  External Services               │ │
│  │  - OpenAI API (user key)         │ │
│  │  - Auth provider (optional)      │ │
│  │  - Monitoring (Sentry/LogRocket) │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Code Runners (Sandboxed)        │ │
│  │  - Python 3 executable           │ │
│  │  - C# compiler (CSC)             │ │
│  │  - Timeout enforcement           │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

---

## Scalability Notes

### Current Limitations
- SQLite: Good for < 100K submissions
- Single-process: Code execution serial
- No horizontal scaling yet

### Future Improvements
1. **PostgreSQL** for multi-server deployments
2. **Redis** for caching & sessions
3. **Celery/Bull** for async code execution
4. **Kubernetes** for scaling runners
5. **CDN** for static assets

---

## Testing Strategy

### Unit Tests (Ready to Add)
- Code runners (mock subprocess)
- AI tutor (mock OpenAI)
- Database operations (mock sqlite3)

### Integration Tests
- Full submission flow
- Database transactions
- API endpoints

### E2E Tests (Future)
- User landing → code submission → result display
- Complete learning flow

---

## Monitoring & Observability (Future)

```
Metrics to Track:
- Code execution success rate
- Average execution time
- Code submission frequency
- Skill completion rate
- Student engagement (DAU/MAU)
- API error rates
- AI hint quality (feedback)

Logs:
- Submission details
- Execution errors
- API calls
- Database operations
- User actions

Alerts:
- High error rate
- Timeout exceeded
- Database full
- API quota exceeded
```

---

## Conclusion

**EduPath OS** is built on a modular, scalable architecture:

- **Frontend**: React components with Next.js routing
- **Backend**: Node.js with SQLite data layer
- **Code Execution**: Sandboxed, timeout-protected runners
- **AI**: OpenAI integration for Socratic tutoring
- **Skills**: Graph-based knowledge tracking
- **Evidence**: Code + reflection-based learning proof

All components are designed to be extended with additional features without breaking existing functionality.

---

**Document Version**: 1.0  
**Last Updated**: December 14, 2025
