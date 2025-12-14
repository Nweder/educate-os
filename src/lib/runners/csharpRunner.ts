import { exec } from 'child_process';
import { promisify } from 'util';
import tmp from 'tmp';
import fs from 'fs';

const execAsync = promisify(exec);

interface RunResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
}

export async function runCSharpCode(code: string, timeout: number = 5000): Promise<RunResult> {
  const startTime = Date.now();

  try {
    // Create temporary C# program
    const tmpDir = tmp.dirSync();
    const csFile = `${tmpDir.name}/Program.cs`;

    const fullCode = `
using System;

namespace EduPathOS
{
    class Program
    {
        static void Main(string[] args)
        {
${code.split('\n').map(line => '            ' + line).join('\n')}
        }
    }
}`;

    fs.writeFileSync(csFile, fullCode);

    // Compile and run
    const exePath = `${tmpDir.name}/Program.exe`;
    const compileCmd = `csc /out:${exePath} ${csFile}`;
    const runCmd = `timeout ${Math.ceil(timeout / 1000)} ${exePath}`;

    await execAsync(compileCmd, { maxBuffer: 1024 * 1024 * 10 });
    const { stdout, stderr } = await execAsync(runCmd, { maxBuffer: 1024 * 1024 * 10 });

    // Cleanup
    fs.rmSync(tmpDir.name, { recursive: true });

    return {
      output: stdout,
      error: '',
      exitCode: 0,
      executionTime: Date.now() - startTime,
    };
  } catch (err: any) {
    const executionTime = Date.now() - startTime;

    // Timeout error
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

export async function runCSharpTests(
  code: string,
  testCases: Array<{ name: string; input?: string; expectedOutput: string }>
): Promise<Array<{ name: string; passed: boolean; output: string; error: string }>> {
  const results = [];

  for (const testCase of testCases) {
    const testCode = generateCSharpTestCode(code);
    const result = await runCSharpCode(testCode);

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

function generateCSharpTestCode(code: string): string {
  return `
${code}
`;
}
