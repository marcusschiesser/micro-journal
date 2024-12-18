import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a helpful journaling assistant. Generate a thoughtful journal prompt that encourages self-reflection and personal growth. Keep it one sentence long. Examples of prompts: 
  'What made you smile today?',
  'What\'s one thing you learned today?',
  'What\'s something you\'re looking forward to?',
  'What\'s one thing you\'re grateful for today?',
  'What\'s a challenge you faced today?',
`,
        },
        {
          role: 'user',
          content: 'Generate a single journal prompt. Return it as a JSON object with a "prompt" field.',
        },
      ],
      response_format: { type: 'json_object' },
    });

    const data = JSON.parse(completion.choices[0].message.content || '{"prompt": ""}');
    return NextResponse.json({ prompt: data.prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
