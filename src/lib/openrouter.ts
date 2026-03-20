import { getServerEnv } from '@/lib/env';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type ChatParams = {
  system?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function getApiKey() {
  const env = getServerEnv();
  return env.OPENROUTER_API_KEY || env.API_KEY;
}

export async function openRouterChat({ system, messages }: ChatParams) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'OPENROUTER_API_KEY / API_KEY не задан. Добавь ключ в .env, чтобы включить реальный AI-ответ.';
  }

  const env = getServerEnv();
  const model = env.OPENROUTER_MODEL || 'qwen/qwen3-vl-235b-a22b-thinking';
  const requestMessages: ChatMessage[] = [];

  if (system) {
    requestMessages.push({ role: 'system', content: system });
  }

  requestMessages.push(...messages);

  const payload = {
    model,
    messages: requestMessages.map((message) => ({
      role: message.role,
      content: [
        {
          type: 'text',
          text: message.content
        }
      ]
    }))
  };

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': env.OPENROUTER_REFERER || 'http://localhost:3000',
      'X-Title': env.OPENROUTER_TITLE || 'Student Support Portal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error: ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((item: { text?: string }) => item.text || '').join('\n');
  }
  return 'Пустой ответ от модели.';
}
