import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('API route called');
  const { messages } = await req.json();
  console.log('Received messages:', messages);

  try {
    console.log('Calling Anthropic API...');
    const stream = await anthropic.messages.stream({
      messages,
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            if ('text' in chunk.delta) {
              console.log('Sending chunk:', chunk.delta.text);
              controller.enqueue(encoder.encode(chunk.delta.text));
            } else if ('json' in chunk.delta) {
              console.log('Sending JSON chunk:', JSON.stringify(chunk.delta.json));
              controller.enqueue(encoder.encode(JSON.stringify(chunk.delta.json)));
            }
          }
        }
        controller.close();
      },
    });

    console.log('Stream created, sending response');
    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in Anthropic API call:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}