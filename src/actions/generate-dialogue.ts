'use server'
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { CoreMessage } from 'ai';
import { createStreamableValue } from 'ai/rsc';

export async function generateDialogue(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      {
        role: 'system',
        content: 'You are a resistance member in a dystopian future where AI has taken over. You are trying to verify if the user is human to help them escape from an AI-controlled prison. Respond in character, keeping responses short and immersive.'
      },
      ...messages
    ],
  });

  const stream = createStreamableValue(result.textStream);
  return { message: stream.value };
}
