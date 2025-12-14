import { AITutorResponse } from '@/types';

export async function getAIHint(
  apiKey: string,
  exerciseDescription: string,
  studentCode: string,
  testResults: Array<{ name: string; passed: boolean; error: string }>,
  language: 'python' | 'csharp'
): Promise<AITutorResponse> {
  const failedTests = testResults.filter(t => !t.passed);
  const failureContext = failedTests
    .map(t => `Test: ${t.name}\nError: ${t.error}`)
    .join('\n');

  const languageName = language === 'python' ? 'Python' : 'C#';

  const prompt = `You are an expert programming tutor helping a student learn ${languageName}.

## Exercise
${exerciseDescription}

## Student's Code
\`\`\`${language}
${studentCode}
\`\`\`

## Test Results
${failureContext}

Your task is to:
1. Diagnose what the student misunderstands
2. Provide a hint without giving away the full solution
3. Guide them to the right concept

IMPORTANT: 
- Never give the complete working solution
- Ask clarifying questions if needed
- Reference the failing tests by name
- Guide step by step

Respond in JSON format:
{
  "diagnosis": "What the student is missing (2-3 sentences)",
  "hint_level_1": "Conceptual reminder (1-2 sentences)",
  "hint_level_2": "Specific area to check (class/function/method name)",
  "minimal_fix": "Smallest code change to try (not a full solution)",
  "concepts_to_review": ["concept1", "concept2"],
  "confidence": 0.85
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1024,
      }),
    });

    const data = await response.json() as any;
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const responseText = data.choices?.[0]?.message?.content || '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      diagnosis: parsed.diagnosis || 'Unable to diagnose',
      hint_level_1: parsed.hint_level_1 || '',
      hint_level_2: parsed.hint_level_2 || '',
      minimal_fix: parsed.minimal_fix || '',
      concepts_to_review: parsed.concepts_to_review || [],
      confidence: parsed.confidence || 0.5,
    };
  } catch (err: any) {
    return {
      diagnosis: err.message || 'Unable to connect to AI tutor',
      hint_level_1: 'Review the test output carefully',
      hint_level_2: 'Check your logic step by step',
      minimal_fix: 'Start with the first failing test',
      concepts_to_review: [],
      confidence: 0.3,
    };
  }
}

export async function generateExerciseHint(
  apiKey: string,
  exerciseDescription: string,
  language: 'python' | 'csharp'
): Promise<string> {
  const languageName = language === 'python' ? 'Python' : 'C#';

  const prompt = `You are a helpful programming tutor. A student is starting this ${languageName} exercise:

${exerciseDescription}

Generate a brief hint to get them started, WITHOUT giving away the solution.
Mention key concepts or approach to consider.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json() as any;
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    return 'Unable to generate hint at this time.';
  }
}
