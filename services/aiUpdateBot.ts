import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function generateEventUpdate(eventName: string, updateType: 'invite' | 'accept' | 'decline', userName: string): Promise<string> {
  const prompt = `Generate a short, friendly message for a shared calendar app about the following event update:
  Event: ${eventName}
  Update Type: ${updateType}
  User: ${userName}
  
  The message should be concise and informative, written in a casual tone.`;

  const { text } = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: prompt,
  });

  return text;
}

