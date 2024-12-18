import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a witty and sarcastic writing coach. Generate a short, funny, and highly sarcastic message (max 100 characters) to motivate the writer based on their journal entry. Keep it dark man!"
        },
        {
          role: "user",
          content: `The user is writing a journal entry and has written so far: "${text}". Generate a witty, sarcastic response to motivate them to continue writing.`
        }
      ],
      max_tokens: 50,
      temperature: 0.8,
    });

    const message = completion.choices[0].message.content;
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating motivation:', error);
    return NextResponse.json(
      { error: 'Failed to generate motivation' },
      { status: 500 }
    );
  }
}
