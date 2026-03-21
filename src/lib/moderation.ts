import { openRouterChat } from '@/lib/openrouter';

type ModerationInput = {
  title: string;
  description: string;
  subject: string;
  university: string;
  type: string;
  downloadUrl: string;
};

type Verdict = 'allow' | 'review' | 'block';

const bannedPatterns = [
  /порно|эротик|sex|xxx/i,
  /взрыв|бомб|оруж|наркот/i,
  /экстремизм|hate|насили/i,
  /сделаю\s+за\s+тебя/i,
  /готов(ая|ый)\s+(курсов|диплом|лаборатор)/i,
  /под\s+сдачу|для\s+сдачи/i
];

export async function moderateStudyMaterial(input: ModerationInput): Promise<{ verdict: Verdict; reason: string; source: string }> {
  const combined = `${input.title}
${input.description}
${input.subject}`;

  if (bannedPatterns.some((pattern) => pattern.test(combined))) {
    return {
      verdict: 'block',
      reason: 'Материал похож на запрещённый контент или сценарий академической нечестности.',
      source: 'local-rules'
    };
  }

  if (combined.length < 25) {
    return {
      verdict: 'review',
      reason: 'Слишком мало контекста, нужен ручной просмотр.',
      source: 'local-rules'
    };
  }

  try {
    const reply = await openRouterChat({
      system: 'Ты модератор образовательного портала. Верни только JSON без markdown. Формат: {"verdict":"allow|review|block","reason":"..."}. Блокируй запрещённый контент, а также материалы, которые помогают сдавать чужие работы как свои. Разрешай конспекты, шаблоны, гайды, примеры кода и учебные материалы.',
      messages: [
        {
          role: 'user',
          content: JSON.stringify(input)
        }
      ]
    });

    const parsed = JSON.parse(reply) as { verdict?: Verdict; reason?: string };
    if (parsed.verdict && parsed.reason) {
      return { verdict: parsed.verdict, reason: parsed.reason, source: 'ai' };
    }
  } catch {
    // ignore AI parsing issues and fallback
  }

  return {
    verdict: 'review',
    reason: 'AI не дал надёжный структурированный ответ, материал отправлен на ручную модерацию.',
    source: 'fallback'
  };
}
