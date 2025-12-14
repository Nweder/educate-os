# 🎓 EduPath OS

**Production-Ready Education Operating System** — Master backend development with structured learning, AI guidance, authentication, and code execution.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)

## 🌟 Features

### Core Learning
- ✨ **Live Code Editor**: Python 3 & C# (.NET) with instant execution
- 🤖 **AI Tutor**: OpenAI-powered Socratic hints and guidance
- 🗺️ **30-Day Roadmap**: Structured curriculum from OOP to production
- 📊 **Skill Graph**: Track expertise with evidence-based proof
- ✅ **Evidence System**: Save submissions as learning proof
- 📈 **Analytics**: Monitor progress, streaks, and friction points

### Authentication & Security ✅ NEW
- 🔐 **JWT Authentication**: HTTP-only cookies (no localStorage)
- 👥 **Role-Based Access**: User and Admin roles
- 🛡️ **Admin Panel**: User management, submission monitoring
- 📝 **Password Security**: bcrypt hashing
- ✔️ **Input Validation**: Strict name/email/password rules

### Admin Features ✅ NEW
- 👨‍💼 **User Management**: View all users, enable/disable accounts
- 📊 **Submissions Monitoring**: View all code submissions
- 🔍 **Advanced Filtering**: Filter by language (Python/C#) and status
- 📈 **Activity Insights**: Track user engagement and submission history

## 📋 Tech Stack

**Frontend:**
- Next.js 14 (TypeScript + App Router)
- Tailwind CSS
- React Hooks
- JWT + HTTP-only cookies

**Backend:**
- Node.js (Next.js API routes)
- SQLite 3 (better-sqlite3)
- Python 3 & C# (.NET) runners
- bcrypt (password hashing)
- jsonwebtoken (JWT)

**AI:**
- OpenAI API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- .NET SDK (for C#)

### 1. Install & Setup
```bash
git clone https://github.com/yourusername/edupath-os.git
cd edupath-os
npm install
```

### 2. Configure Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@edupath.local
ADMIN_PASSWORD=admin123
OPENAI_API_KEY=sk-your-key-here  # Optional
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: **`http://localhost:3000`**

### 4. Login
**Admin Account:**
```
Email: admin@edupath.local
Password: admin123
```

or **Create your own** via registration page!

## 🔐 Authentication

### Public Routes
- `/` - Landing page
- `/login` - Login form  
- `/register` - Registration form

### Protected Routes
- `/dashboard` - User dashboard
- `/codelab` - Code editor
- `/roadmap` - Learning roadmap
- `/admin` - Admin panel (Admin only)

## 📊 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── api/
│   │   ├── auth/             # Auth endpoints
│   │   │   ├── register      # Registration
│   │   │   ├── login         # Login
│   │   │   ├── logout        # Logout
│   │   │   └── me            # Current user
│   │   ├── admin/            # Admin endpoints
│   │   │   ├── users         # Manage users
│   │   │   └── submissions   # View submissions
│   │   └── execute           # Code execution
│   ├── login/                # Login page
│   ├── register/             # Register page
│   ├── dashboard/            # User dashboard
│   ├── admin/                # Admin panel
│   ├── codelab/              # Code editor
│   ├── roadmap/              # Roadmap view
│   ├── skills/               # Skill graph
│   ├── evidence/             # Evidence vault
│   ├── analytics/            # Analytics
│   └── settings/             # Settings
├── lib/
│   ├── auth/
│   │   ├── utils.ts          # JWT, bcrypt, validation
│   │   └── middleware.ts     # Auth middleware
│   ├── db/
│   │   ├── init.ts           # Schema
│   │   └── seed.ts           # Seed data
│   ├── runners/
│   │   ├── pythonRunner.ts   # Python executor
│   │   └── csharpRunner.ts   # C# executor
│   └── ai/
│       └── tutor.ts          # AI integration
├── types/
│   └── index.ts              # TypeScript definitions
└── components/               # Reusable components

data/
└── edupath.db                # SQLite database (auto-created)
```

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new account
POST   /api/auth/login        # Login with email/password
POST   /api/auth/logout       # Logout (clear cookie)
GET    /api/auth/me           # Get current user
```

### Code Execution
```
POST   /api/execute           # Run code with tests
```

### Admin (Protected - Admin role required)
```
GET    /api/admin/users       # List all users
PATCH  /api/admin/users/:id   # Toggle user enabled/disabled
GET    /api/admin/submissions # View all submissions (filterable)
```

## 👥 User Roles

### User (Student)
- ✅ Access Code Lab
- ✅ View Roadmap
- ✅ Submit code
- ✅ Track skills

### Admin
- ✅ All User permissions
- ✅ View all users
- ✅ Enable/disable accounts
- ✅ Monitor submissions
- ✅ Filter by language & status

## 30-Day Roadmap

**Week 1-2: OOP & Fundamentals (Days 1-7)**
- Classes, objects, encapsulation
- Inheritance & polymorphism
- Abstract classes & interfaces
- Collections & data structures
- Project: Class Design

**Week 3-4: REST APIs (Days 8-14)**
- HTTP fundamentals
- CRUD operations
- Input validation
- Database integration
- Project: Todo API

**Week 5-6: Authentication & Security (Days 15-21)**
- Password security & hashing
- JWT tokens
- OAuth2
- Role-based access control
- Project: Secure API

**Week 7-8: Testing & Operations (Days 22-28)**
- Unit testing
- API testing
- Logging & monitoring
- Performance optimization
- Project: Deployment

**Final Week: Capstone (Days 29-30)**
- Task Manager API (full-stack)
- Testing & documentation

## 💻 Code Lab Features

- **Editor**: Syntax highlighting, auto-formatting
- **Languages**: Python 3 & C# (.NET)
- **Execution**: 5-second timeout, sandboxed
- **Tests**: Visible and hidden test cases
- **Results**: Stdout, stderr, execution time

## 🛠️ Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm test          # Run tests
npm run lint      # Lint code
```

## 🔒 Security

✅ **Implemented**
- Bcrypt password hashing (10 rounds)
- JWT in HTTP-only cookies
- Input validation & sanitization
- Role-based access control
- Admin route protection

⚠️ **For Production**
- Change JWT_SECRET
- Set NODE_ENV=production
- Use HTTPS only
- Implement rate limiting
- Set up database backups

## 📝 Database Schema

### Core Tables
- `users` — User accounts with auth & roles
- `roadmaps` — Learning paths
- `roadmap_days` — Daily lessons
- `exercises` — Coding challenges
- `exercise_test_cases` — Test validation
- `code_submissions` — User code attempts
- `submission_results` — Test results
- `skills` — Skill definitions
- `user_skills` — Proficiency tracking
- `evidence_items` — Learning proof
- `study_sessions` — Learning sessions

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**Note**: For production, migrate SQLite to PostgreSQL or MongoDB

## 📚 Documentation

- **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - Complete project overview & status
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture details
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Implementation checklist
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide

## 🎯 What's Included

✅ **Complete Authentication System**
- User registration with validation
- Password hashing (bcrypt)
- JWT login/logout
- HTTP-only cookies
- Role-based access

✅ **Admin Panel**
- User management interface
- Submit view & filtering
- Activity monitoring
- Enable/disable users

✅ **Code Lab**
- Python 3 & C# support
- Instant execution
- Test case running
- Submission tracking

✅ **Database**
- SQLite with schema
- Auto-initialization
- Admin seeding
- 30-day curriculum data

✅ **Learning Platform**
- Structured 30-day path
- Exercise system
- Skill tracking
- Evidence vault

## 🤝 Contributing

Contributions welcome!
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and create PR

## 📄 License

MIT License - see LICENSE file

## 🙋 Support

For questions or issues:
1. Check documentation files
2. Review PROJECT_CONTEXT.md
3. Create a GitHub issue

## 🚀 Next Steps

After deployment, consider:
- Integrate Prisma ORM
- Add WebSocket support
- Implement AI hints
- Create mobile app
- Add more exercise types
- Set up CI/CD pipeline

---

**Built with ❤️ for backend developers** — Master fundamentals, prove skills, advance careers.

Happy learning! 🚀

# educate-os
