import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpNameSync } from 'tmp';

const execAsync = promisify(exec);

interface RunResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
}

export async function runPythonCode(code: string, timeout: number = 5000): Promise<RunResult> {
  const startTime = Date.now();
  const tmpFile = tmpNameSync({ postfix: '.py' });

  try {
    writeFileSync(tmpFile, code);

    const { stdout, stderr } = await execAsync(
      `timeout ${Math.ceil(timeout / 1000)} python3 ${tmpFile}`,
      { maxBuffer: 1024 * 1024 * 10 }
    );

    unlinkSync(tmpFile);

    return {
      output: stdout,
      error: '',
      exitCode: 0,
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    try {
      unlinkSync(tmpFile);
    } catch {}

    const executionTime = Date.now() - startTime;

    if (err.code === 124) {
      return {
        output: '',
        error: `Timeout: Code execution exceeded ${timeout}ms`,
        exitCode: 124,
        executionTime,
      };
    }

    return {
      output: err.stdout || '',
      error: err.stderr || err.message,
      exitCode: err.code || 1,
      executionTime,
    };
  }
}

export async function runPythonTests(
  code: string,
  testCases: Array<{ name: string; input?: string; expectedOutput: string }>
): Promise<Array<{ name: string; passed: boolean; output: string; error: string }>> {
  const results = [];

  for (const testCase of testCases) {
    const testCode = generatePythonTestCode(code, testCase);
    const result = await runPythonCode(testCode);

    const passed = result.output.trim() === testCase.expectedOutput.trim();
    results.push({
      name: testCase.name,
      passed,
      output: result.output,
      error: result.error,
    });
  }

  return results;
}

function generatePythonTestCode(
  code: string,
  testCase: { name: string; input?: string; expectedOutput: string }
): string {
  return `
import sys
from io import StringIO

# Capture output
old_stdout = sys.stdout
sys.stdout = StringIO()

try:
  ${code.split('\n').map(line => '  ' + line).join('\n')}
  output = sys.stdout.getvalue()
  sys.stdout = old_stdout
  print(output.strip())
except Exception as e:
  sys.stdout = old_stdout
  print(f"Error: {str(e)}", file=sys.stderr)
`;
}
