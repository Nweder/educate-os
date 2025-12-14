import { NextRequest, NextResponse } from 'next/server';
import { runPythonCode, runPythonTests } from '@/lib/runners/pythonRunner';
import { runCSharpCode, runCSharpTests } from '@/lib/runners/csharpRunner';
import { getDb } from '@/lib/db/init';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, exerciseId, userId, testCases } = body;

    if (!code || !language || !userId || !exerciseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Run code based on language
    let result;
    if (language === 'python') {
      result = await runPythonCode(code);
    } else if (language === 'csharp') {
      result = await runCSharpCode(code);
    } else {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // Save submission to database
    const db = getDb();
    const submissionId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO code_submissions (id, userId, exerciseId, roadmapDayId, code, language, status, submittedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      submissionId,
      userId,
      exerciseId,
      exerciseId, // TODO: Get actual roadmapDayId
      code,
      language,
      'submitted',
      new Date().toISOString()
    );

    return NextResponse.json({
      submissionId,
      output: result.output,
      error: result.error,
      exitCode: result.exitCode,
      executionTime: result.executionTime,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Execution failed' },
      { status: 500 }
    );
  }
}
