# 🚀 EduPath OS - Quick Start Guide

## Getting Started

```bash
cd /Users/test/Desktop/edupath-os
npm install
npm run dev
```

Visit: **http://localhost:3000**

---

## 📍 What You Can Do Right Now

### 1. **View Landing Page**
- Go to `http://localhost:3000`
- See hero section, features, roadmap preview
- Links to Dashboard & Code Lab

### 2. **Try Code Lab**
- Click "Start Learning" or go to `/codelab`
- Choose **Python 3** or **C#**
- Write code
- Click "▶ Run Code"
- See output instantly

#### Python Example:
```python
def add(a, b):
    return a + b

print(add(5, 3))  # Output: 8
```

#### C# Example:
```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello from C#!");
    }
}
```

---

## 🔧 Key Files to Understand

### Database
- `src/lib/db/init.ts` - Schema & tables
- `src/lib/db/seed.ts` - 30-day roadmap data
- `data/edupath.db` - SQLite file (auto-created)

### Code Execution
- `src/lib/runners/pythonRunner.ts` - Python executor
- `src/lib/runners/csharpRunner.ts` - C# executor
- `src/app/api/execute/route.ts` - API endpoint

### AI Integration
- `src/lib/ai/tutor.ts` - OpenAI hints

### Pages
- `src/app/page.tsx` - Landing page
- `src/app/codelab/page.tsx` - Code Lab

---

## 📝 Database

### View Data
```bash
# Install sqlite3 CLI
brew install sqlite3

# Open database
sqlite3 data/edupath.db

# View all tables
.tables

# Check roadmap days
SELECT dayNumber, title FROM roadmap_days LIMIT 10;

# Check skills
SELECT name, category FROM skills;
```

---

## 🤖 AI Tutor Setup

Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-your-key-here
```

Then in Code Lab, click "Get a hint" to test (UI coming soon).

---

## 🐛 Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Delete database (to re-seed)
rm data/edupath.db
```

---

## 📂 Project Structure at a Glance

```
src/
├── app/                 # Pages & API routes
│   ├── page.tsx         # Landing page
│   ├── codelab/         # Code Lab page
│   ├── api/execute/     # Code execution endpoint
│   └── [dashboard, roadmap, skills, evidence, analytics, settings]/
├── lib/
│   ├── db/              # Database init & seed
│   ├── runners/         # Python & C# executors
│   ├── ai/              # OpenAI integration
│   └── components/      # Reusable UI (ready for expansion)
└── types/
    └── index.ts         # TypeScript definitions
```

---

## ✅ Working Features

- ✅ Landing page with dark theme
- ✅ Code Lab with Python & C# editor
- ✅ Code execution with sandbox
- ✅ Console output display
- ✅ Error messages
- ✅ Database with seeded roadmap
- ✅ AI tutor integration (backend ready)

---

## 🚧 Coming Next

Priority features:
1. **Dashboard** - Show current day & progress
2. **Exercise mapping** - Link exercises to Code Lab
3. **Test case UI** - Show passing/failing tests
4. **Skill tracking** - Visual skill updates
5. **Evidence system** - Save code + reflection

---

## 🎯 Architecture Overview

```
User Input (Code Lab)
        ↓
Frontend: Code Editor (React)
        ↓
API POST /api/execute
        ↓
Backend: Code Validator
        ↓
Runner (Python/C#) in Sandbox
        ↓
Save to Database
        ↓
Return: Output + Test Results
        ↓
Frontend: Display Results
        ↓
[Optional] Get AI Hint
        ↓
[Optional] Save as Evidence
        ↓
Update Skill Graph
```

---

## 🎓 The 30-Day Curriculum

Days seeded in database:

| Days | Topic | Projects |
|------|-------|----------|
| 1-7 | OOP Fundamentals | Class Design |
| 8-14 | REST APIs | Todo API |
| 15-21 | Authentication | Secure API |
| 22-28 | Testing & Ops | DevOps basics |
| 29-30 | Capstone | Task Manager API |

---

## 🔑 Environment Variables

Create `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-xxxxx    # Your OpenAI key
DATABASE_URL=./data/edupath.db  # SQLite path
NODE_ENV=development
```

---

## 📱 Pages Map

- `/` - Landing page ✅
- `/codelab` - Code Lab ✅
- `/dashboard` - Dashboard (stub)
- `/roadmap` - Roadmap viewer (stub)
- `/skills` - Skill graph (stub)
- `/evidence` - Evidence vault (stub)
- `/analytics` - Analytics (stub)
- `/settings` - Settings (stub)
- `/api/execute` - Code execution ✅

---

## 🚨 Troubleshooting

### "Module not found"
```bash
npm install
npm run dev
```

### "Database locked"
```bash
# Delete and re-create
rm data/edupath.db
npm run dev
```

### "Python not found"
```bash
# Install Python 3
brew install python3

# Verify
python3 --version
```

### "C# compiler not found"
- Windows: Use CSC from .NET SDK
- Mac: Use Mono or .NET SDK
- Adjust path in `csharpRunner.ts`

---

## 💡 Development Tips

### Add a New Page
1. Create `src/app/mypage/page.tsx`
2. Use `'use client'` for client components
3. Import from `src/types` for models
4. Use Tailwind for styling

### Add Database Table
1. Update schema in `src/lib/db/init.ts`
2. Create corresponding type in `src/types/index.ts`
3. Delete `data/edupath.db` to re-seed

### Modify Roadmap
Edit `src/lib/db/seed.ts` and regenerate database.

### Add AI Feature
Call `getAIHint()` from `src/lib/ai/tutor.ts` in your page.

---

## 📞 Debug Tips

```typescript
// Log database queries
const db = getDb();
const results = db.prepare("SELECT * FROM users").all();
console.log(results);

// Test code runner
import { runPythonCode } from '@/lib/runners/pythonRunner';
const result = await runPythonCode("print('test')");
console.log(result);

// Test AI
import { getAIHint } from '@/lib/ai/tutor';
const hint = await getAIHint(apiKey, description, code, results, 'python');
console.log(hint);
```

---

## 🎉 You're Ready!

The foundation is built. Start implementing the missing pages and you'll have a complete education platform in days.

Happy coding! 🚀

---

**Last Updated**: December 14, 2025  
**Project Root**: `/Users/test/Desktop/edupath-os`
