'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, clearMessages } from '@/store/slices/chat-slice';

export function AiChatPanel() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    dispatch(addMessage(userMessage));
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Ошибка AI');
      }
      dispatch(addMessage({ role: 'assistant', content: result.reply }));
    } catch (error) {
      dispatch(addMessage({ role: 'assistant', content: error instanceof Error ? error.message : 'Не удалось получить ответ.' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="glass p-8">
        <div className="mb-4 space-y-2">
          <div className="badge">AI assistant</div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Встроенный чат с ИИ</h1>
          <p className="text-slate-600">
            Подходит для объяснения темы, плана подготовки, разбора структуры отчёта и генерации учебного roadmap.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p>Примеры запросов:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Помоги составить план защиты проекта по базам данных.</li>
            <li>Объясни простыми словами, чем отличается LEFT JOIN от INNER JOIN.</li>
            <li>Проверь структуру моего доклада и предложи улучшения.</li>
          </ul>
        </div>
        <button onClick={() => dispatch(clearMessages())} className="btn-secondary mt-6">Очистить историю</button>
      </section>

      <section className="glass flex min-h-[560px] flex-col p-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Начните диалог — история сообщений хранится в Redux Toolkit.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === 'user'
                  ? 'ml-auto max-w-[80%] rounded-3xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-7 text-white'
                  : 'max-w-[80%] rounded-3xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-7 text-slate-700'}
              >
                {message.content}
              </div>
            ))
          )}
          {loading ? <div className="max-w-[80%] rounded-3xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">ИИ думает...</div> : null}
        </div>

        <div className="mt-6 flex gap-3">
          <textarea
            className="input min-h-24 flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <button onClick={handleSend} disabled={loading} className="btn-primary h-fit">Отправить</button>
        </div>
      </section>
    </div>
  );
}
