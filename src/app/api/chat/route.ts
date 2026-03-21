import { NextResponse } from 'next/server';
import { openRouterChat } from '@/lib/openrouter';
import { chatSchema } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = chatSchema.parse(body);

    const reply = await openRouterChat({
      system: 'Ты встроенный помощник студенческого support-портала. Помогай разбираться в темах, планировать обучение, проверять структуру текста, объяснять концепции. Не выполняй задания нечестным способом за студента.',
      messages: data.messages
    });

    return NextResponse.json({ ok: true, reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка общения с ИИ.' }, { status: 400 });
  }
}
