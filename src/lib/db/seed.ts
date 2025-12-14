import { getDb } from '@/lib/db/init';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  const db = getDb();

  // Check if already seeded
  const existing = db
    .prepare("SELECT COUNT(*) as count FROM roadmaps WHERE title = 'Backend Masterclass 30 Days'")
    .get() as { count: number };

  if (existing.count > 0) {
    console.log('Database already seeded');
    return;
  }

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@edupath.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, name, password, role, enabled, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(adminId, adminEmail, 'Admin', hashedPassword, 'Admin', 1, now, now);

    console.log(`✅ Admin user created: ${adminEmail}`);
  }

  const userId = uuidv4();
  const roadmapId = uuidv4();
  const now = new Date().toISOString();

  // Create default demo user
  const demoExists = db.prepare('SELECT id FROM users WHERE email = ?').get('student@edupath.os');
  if (!demoExists) {
    const hashedPassword = await bcrypt.hash('student123', 10);
    db.prepare(`
      INSERT INTO users (id, email, name, password, role, enabled, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, 'student@edupath.os', 'Student', hashedPassword, 'User', 1, now, now);
  }

  // Create roadmap
  db.prepare(`
    INSERT INTO roadmaps (id, userId, title, description, duration, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    roadmapId,
    userId,
    'Backend Masterclass 30 Days',
    'Master backend development with Object-Oriented Programming, REST APIs, and Authentication',
    30,
    now,
    now
  );

  // 30-day roadmap structure
  const roadmapDays = [
    {
      dayNumber: 1,
      title: 'OOP Foundations',
      goals: 'Understand classes, objects, and encapsulation',
      topics: ['Classes', 'Objects', 'Attributes', 'Methods', 'Encapsulation'],
      expectedTime: 120,
      difficulty: 'beginner',
      resources: [
        'https://en.wikipedia.org/wiki/Object-oriented_programming',
        'OOP in Python/C# documentation',
      ],
    },
    {
      dayNumber: 2,
      title: 'Inheritance & Polymorphism',
      goals: 'Learn inheritance, method overriding, and polymorphism',
      topics: ['Inheritance', 'Polymorphism', 'Method Overriding', 'Super'],
      expectedTime: 120,
      difficulty: 'beginner',
      resources: ['Inheritance patterns guide'],
    },
    {
      dayNumber: 3,
      title: 'Abstract Classes & Interfaces',
      goals: 'Work with abstract classes and interfaces',
      topics: ['Abstract Classes', 'Interfaces', 'Contracts', 'Implementation'],
      expectedTime: 120,
      difficulty: 'intermediate',
      resources: ['Interface design patterns'],
    },
    {
      dayNumber: 4,
      title: 'Collections & Data Structures',
      goals: 'Master lists, dictionaries, sets, and queues',
      topics: ['Lists', 'Dictionaries', 'Sets', 'Queues', 'Stacks'],
      expectedTime: 150,
      difficulty: 'intermediate',
      resources: ['Data Structures guide'],
    },
    {
      dayNumber: 5,
      title: 'Functional Programming Basics',
      goals: 'Understand lambdas, higher-order functions, map, filter, reduce',
      topics: ['Lambda Functions', 'Map', 'Filter', 'Reduce', 'Comprehensions'],
      expectedTime: 120,
      difficulty: 'intermediate',
      resources: ['Functional Programming 101'],
    },
    {
      dayNumber: 6,
      title: 'Exception Handling',
      goals: 'Handle errors gracefully with try-catch-finally',
      topics: ['Try-Catch', 'Finally', 'Custom Exceptions', 'Error Handling'],
      expectedTime: 90,
      difficulty: 'intermediate',
      resources: ['Exception Handling Best Practices'],
    },
    {
      dayNumber: 7,
      title: 'Project: Class Design',
      goals: 'Build a small OOP project from scratch',
      topics: ['Design', 'Classes', 'Relationships', 'Abstraction'],
      expectedTime: 240,
      difficulty: 'intermediate',
      resources: [],
    },
    {
      dayNumber: 8,
      title: 'REST API Fundamentals',
      goals: 'Understand HTTP methods, status codes, and REST principles',
      topics: ['HTTP', 'REST', 'Resources', 'Status Codes', 'Headers'],
      expectedTime: 120,
      difficulty: 'intermediate',
      resources: ['REST API Design Guide'],
    },
    {
      dayNumber: 9,
      title: 'Building a Simple API',
      goals: 'Create basic GET/POST endpoints',
      topics: ['Routing', 'Request/Response', 'Body Parsing', 'Error Handling'],
      expectedTime: 150,
      difficulty: 'intermediate',
      resources: ['API Development Guide'],
    },
    {
      dayNumber: 10,
      title: 'API CRUD Operations',
      goals: 'Implement Create, Read, Update, Delete operations',
      topics: ['CRUD', 'Routing', 'Idempotency', 'Resource Updates'],
      expectedTime: 150,
      difficulty: 'intermediate',
      resources: ['CRUD Best Practices'],
    },
    {
      dayNumber: 11,
      title: 'Input Validation & Error Handling',
      goals: 'Validate inputs and provide meaningful error messages',
      topics: ['Validation', 'Error Responses', 'Status Codes', 'Logging'],
      expectedTime: 120,
      difficulty: 'intermediate',
      resources: ['Input Validation Patterns'],
    },
    {
      dayNumber: 12,
      title: 'Database Integration Basics',
      goals: 'Connect your API to a database',
      topics: ['SQLite', 'SQL', 'Queries', 'Connections', 'Transactions'],
      expectedTime: 150,
      difficulty: 'intermediate',
      resources: ['Database Integration Guide'],
    },
    {
      dayNumber: 13,
      title: 'ORMs & Query Builders',
      goals: 'Use ORMs to simplify database operations',
      topics: ['ORM Concepts', 'Query Builders', 'Models', 'Relationships'],
      expectedTime: 120,
      difficulty: 'intermediate',
      resources: ['ORM Documentation'],
    },
    {
      dayNumber: 14,
      title: 'Project: Todo API',
      goals: 'Build a working Todo API with CRUD operations',
      topics: ['API Design', 'Database', 'Error Handling', 'Validation'],
      expectedTime: 240,
      difficulty: 'intermediate',
      resources: [],
    },
    {
      dayNumber: 15,
      title: 'Authentication Basics',
      goals: 'Understand authentication vs authorization',
      topics: ['Authentication', 'Authorization', 'Credentials', 'Sessions'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['Auth Fundamentals'],
    },
    {
      dayNumber: 16,
      title: 'Password Security',
      goals: 'Hash and salt passwords properly',
      topics: ['Hashing', 'Salting', 'bcrypt', 'PBKDF2', 'Password Policies'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['Password Security Guide'],
    },
    {
      dayNumber: 17,
      title: 'JWT Tokens',
      goals: 'Create and validate JWT tokens',
      topics: ['JWT', 'Tokens', 'Payload', 'Signature', 'Expiry'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['JWT Standard & Usage'],
    },
    {
      dayNumber: 18,
      title: 'OAuth2 & Third-party Auth',
      goals: 'Implement third-party authentication',
      topics: ['OAuth2', 'Social Login', 'Scopes', 'Authorization Code Flow'],
      expectedTime: 150,
      difficulty: 'advanced',
      resources: ['OAuth2 Implementation Guide'],
    },
    {
      dayNumber: 19,
      title: 'Protected Routes & Middleware',
      goals: 'Secure routes with middleware',
      topics: ['Middleware', 'Route Protection', 'Permissions', 'Roles'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['Middleware Patterns'],
    },
    {
      dayNumber: 20,
      title: 'Role-Based Access Control',
      goals: 'Implement RBAC for multi-user systems',
      topics: ['Roles', 'Permissions', 'Access Control', 'Authorization'],
      expectedTime: 150,
      difficulty: 'advanced',
      resources: ['RBAC Design Guide'],
    },
    {
      dayNumber: 21,
      title: 'Project: Secure Todo API',
      goals: 'Add authentication and authorization to Todo API',
      topics: ['Auth', 'RBAC', 'Protected Routes', 'User Management'],
      expectedTime: 240,
      difficulty: 'advanced',
      resources: [],
    },
    {
      dayNumber: 22,
      title: 'Testing Fundamentals',
      goals: 'Write unit tests and integration tests',
      topics: ['Unit Tests', 'Integration Tests', 'Test Fixtures', 'Mocking'],
      expectedTime: 150,
      difficulty: 'advanced',
      resources: ['Testing Best Practices'],
    },
    {
      dayNumber: 23,
      title: 'API Testing',
      goals: 'Test API endpoints and edge cases',
      topics: ['API Testing', 'HTTP Testing', 'Edge Cases', 'Coverage'],
      expectedTime: 150,
      difficulty: 'advanced',
      resources: ['API Testing Tools Guide'],
    },
    {
      dayNumber: 24,
      title: 'Logging & Monitoring',
      goals: 'Implement logging and error tracking',
      topics: ['Logging', 'Log Levels', 'Monitoring', 'Error Tracking'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['Logging & Monitoring Guide'],
    },
    {
      dayNumber: 25,
      title: 'Performance & Optimization',
      goals: 'Optimize database queries and API responses',
      topics: ['Query Optimization', 'Caching', 'Pagination', 'Compression'],
      expectedTime: 150,
      difficulty: 'advanced',
      resources: ['Performance Optimization Guide'],
    },
    {
      dayNumber: 26,
      title: 'Deployment Basics',
      goals: 'Deploy your API to a server',
      topics: ['Deployment', 'Environment Variables', 'Containerization', 'CI/CD'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['Deployment Guide'],
    },
    {
      dayNumber: 27,
      title: 'Docker & Containerization',
      goals: 'Containerize your application',
      topics: ['Docker', 'Images', 'Containers', 'Compose'],
      expectedTime: 150,
      difficulty: 'advanced',
      resources: ['Docker Guide'],
    },
    {
      dayNumber: 28,
      title: 'API Documentation',
      goals: 'Document your API properly',
      topics: ['OpenAPI', 'Swagger', 'Documentation', 'Examples'],
      expectedTime: 120,
      difficulty: 'advanced',
      resources: ['API Documentation Standards'],
    },
    {
      dayNumber: 29,
      title: 'Capstone Project Part 1',
      goals: 'Build Task Manager API - Backend',
      topics: [
        'Full-Stack',
        'OOP',
        'API',
        'Database',
        'Auth',
        'Testing',
        'Logging',
      ],
      expectedTime: 300,
      difficulty: 'advanced',
      resources: [],
    },
    {
      dayNumber: 30,
      title: 'Capstone Project Part 2',
      goals: 'Complete Task Manager API - Testing & Deployment',
      topics: ['Testing', 'Deployment', 'Documentation', 'Monitoring'],
      expectedTime: 240,
      difficulty: 'advanced',
      resources: [],
    },
  ];

  // Insert roadmap days and exercises
  for (const day of roadmapDays) {
    const dayId = uuidv4();

    db.prepare(`
      INSERT INTO roadmap_days (id, roadmapId, dayNumber, title, goals, topics, expectedTime, difficulty, resources, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      dayId,
      roadmapId,
      day.dayNumber,
      day.title,
      day.goals,
      JSON.stringify(day.topics),
      day.expectedTime,
      day.difficulty,
      JSON.stringify(day.resources),
      '',
      new Date().toISOString()
    );

    // Add sample exercise for each day
    const exerciseId = uuidv4();
    const exerciseTitle = `${day.title} - Coding Exercise`;
    const exerciseDescription = `Practice: ${day.goals}`;

    db.prepare(`
      INSERT INTO exercises (id, roadmapDayId, title, description, difficulty, languages, starterCodePython, starterCodeCSharp, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      exerciseId,
      dayId,
      exerciseTitle,
      exerciseDescription,
      day.difficulty,
      JSON.stringify(['python', 'csharp']),
      '# Write your code here\npass',
      '// Write your code here\n',
      new Date().toISOString()
    );

    // Add sample test cases
    const testId = uuidv4();
    db.prepare(`
      INSERT INTO exercise_test_cases (id, exerciseId, name, visible, input, expectedOutput, language, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testId,
      exerciseId,
      'Sample Test',
      1,
      '',
      'Success',
      'python',
      new Date().toISOString()
    );
  }

  // Create skills
  const skills = [
    { name: 'Object-Oriented Programming', category: 'fundamentals' },
    { name: 'Encapsulation', category: 'oop' },
    { name: 'Inheritance', category: 'oop' },
    { name: 'Polymorphism', category: 'oop' },
    { name: 'Abstract Classes', category: 'oop' },
    { name: 'Interfaces', category: 'oop' },
    { name: 'Collections', category: 'data-structures' },
    { name: 'Functional Programming', category: 'paradigms' },
    { name: 'Exception Handling', category: 'fundamentals' },
    { name: 'REST APIs', category: 'backend' },
    { name: 'HTTP Protocol', category: 'backend' },
    { name: 'CRUD Operations', category: 'backend' },
    { name: 'Database Design', category: 'database' },
    { name: 'SQL', category: 'database' },
    { name: 'Authentication', category: 'security' },
    { name: 'Authorization', category: 'security' },
    { name: 'Password Security', category: 'security' },
    { name: 'JWT Tokens', category: 'security' },
    { name: 'OAuth2', category: 'security' },
    { name: 'Testing', category: 'quality' },
    { name: 'Logging', category: 'operations' },
    { name: 'Performance Optimization', category: 'operations' },
    { name: 'Deployment', category: 'operations' },
    { name: 'Docker', category: 'devops' },
  ];

  for (const skill of skills) {
    const skillId = uuidv4();
    db.prepare(`
      INSERT INTO skills (id, name, description, category, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      skillId,
      skill.name,
      `Master ${skill.name}`,
      skill.category,
      new Date().toISOString()
    );

    // Create user skill entry
    db.prepare(`
      INSERT INTO user_skills (id, userId, skillId, proficiencyLevel, confidence, reviewCount, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      skillId,
      0,
      0,
      0,
      new Date().toISOString()
    );
  }

  console.log('Database seeded successfully!');
}
