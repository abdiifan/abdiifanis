import Anthropic from '@anthropic-ai/sdk';
import { env } from './env';
import fs from 'fs';
import path from 'path';

export const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export async function askClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 1024
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userMessage,
      }],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    return '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

export function loadPrompt(promptName: string): string {
  try {
    const promptPath = path.join(process.cwd(), 'src', 'lib', 'prompts', `${promptName}.txt`);
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to load prompt: ${promptName}`, error);
    return '';
  }
}