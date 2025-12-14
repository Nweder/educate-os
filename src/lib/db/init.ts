import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'edupath.db');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'User',
      enabled INTEGER DEFAULT 1,
      openAiKey TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS roadmaps (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS roadmap_days (
      id TEXT PRIMARY KEY,
      roadmapId TEXT NOT NULL,
      dayNumber INTEGER NOT NULL,
      title TEXT NOT NULL,
      goals TEXT NOT NULL,
      topics TEXT NOT NULL,
      expectedTime INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      resources TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (roadmapId) REFERENCES roadmaps(id)
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skill_dependencies (
      id TEXT PRIMARY KEY,
      skillId TEXT NOT NULL,
      dependsOnSkillId TEXT NOT NULL,
      FOREIGN KEY (skillId) REFERENCES skills(id),
      FOREIGN KEY (dependsOnSkillId) REFERENCES skills(id)
    );

    CREATE TABLE IF NOT EXISTS user_skills (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      skillId TEXT NOT NULL,
      proficiencyLevel INTEGER DEFAULT 0,
      confidence INTEGER DEFAULT 0,
      reviewCount INTEGER DEFAULT 0,
      lastReviewDate TEXT,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (skillId) REFERENCES skills(id)
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      roadmapDayId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      languages TEXT NOT NULL,
      starterCodePython TEXT,
      starterCodeCSharp TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (roadmapDayId) REFERENCES roadmap_days(id)
    );

    CREATE TABLE IF NOT EXISTS exercise_test_cases (
      id TEXT PRIMARY KEY,
      exerciseId TEXT NOT NULL,
      name TEXT NOT NULL,
      visible INTEGER NOT NULL,
      input TEXT,
      expectedOutput TEXT NOT NULL,
      language TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS code_submissions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      exerciseId TEXT NOT NULL,
      roadmapDayId TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      status TEXT NOT NULL,
      submittedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id),
      FOREIGN KEY (roadmapDayId) REFERENCES roadmap_days(id)
    );

    CREATE TABLE IF NOT EXISTS submission_results (
      id TEXT PRIMARY KEY,
      submissionId TEXT NOT NULL,
      testCaseId TEXT NOT NULL,
      passed INTEGER NOT NULL,
      output TEXT NOT NULL,
      error TEXT,
      executionTime INTEGER NOT NULL,
      FOREIGN KEY (submissionId) REFERENCES code_submissions(id),
      FOREIGN KEY (testCaseId) REFERENCES exercise_test_cases(id)
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      roadmapDayId TEXT NOT NULL,
      exerciseId TEXT,
      startTime TEXT NOT NULL,
      endTime TEXT,
      frictionReason TEXT,
      notes TEXT,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (roadmapDayId) REFERENCES roadmap_days(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS evidence_items (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      skillId TEXT NOT NULL,
      roadmapDayId TEXT NOT NULL,
      submissionId TEXT NOT NULL,
      reflection TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (skillId) REFERENCES skills(id),
      FOREIGN KEY (roadmapDayId) REFERENCES roadmap_days(id),
      FOREIGN KEY (submissionId) REFERENCES code_submissions(id)
    );
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
