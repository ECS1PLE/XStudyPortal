# Student Support Portal (production-ready starter)

Безопасная версия студенческого портала на **Next.js + TypeScript + PostgreSQL + Prisma 7 + Redux Toolkit + Tailwind CSS v4 + Lottie**. Рекомендованная версия Node.js: **22.12+ или 24+**.

## Что изменено по сравнению с прошлой сборкой

- исправлена совместимость с **Prisma 7** через `prisma.config.ts` и `@prisma/adapter-pg`;
- проект переведён на структуру с `src/app`, `src/components`, `src/server`, `src/store`, ближе к привычному production-подходу;
- добавлена **рейтинговая система исполнителей**: отзывы, средний рейтинг, количество отзывов, отображение в каталоге и профиле;
- добавлена **верификация исполнителей** из админки;
- добавлены production-атрибуты: security headers, `output: standalone`, Dockerfile, docker-compose, env validation.

## Важно

Этот проект **не** реализует marketplace для выполнения учебных работ за студента. Вместо этого используются безопасные форматы помощи:

- консультация по лабораторной;
- разбор практики;
- ревью доклада;
- менторство по курсовому проекту;
- консультация по дипломному исследованию.

## Структура

```text
public/
prisma/
src/
  app/
  components/
    Blocks/
    Main/
    UI/
  lib/
  server/
  store/
```

## Быстрый старт

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Открой `http://localhost:3000`.

## Демо-пользователи после seed

- Администратор: `admin@portal.local` / `Admin123!`
- Исполнитель: `mentor@portal.local` / `Mentor123!`
- Студент: `student@portal.local` / `Student123!`

## Docker

```bash
docker compose up --build
```

## Как подключён ИИ

Проект поддерживает те же переменные окружения, что и присланный пример API:

- `API_KEY` или `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_REFERER`
- `OPENROUTER_TITLE`

Используется один серверный helper `src/lib/openrouter.ts`, а дальше он подключается в:

- `/api/chat` — чат с ИИ;
- `src/lib/moderation.ts` — проверка материалов.

## Что ещё стоит сделать перед реальным запуском

- заменить кастомную auth на полноценную production auth-систему с email verification / reset password / OAuth;
- подключить настоящий upload файлов через S3 / Supabase Storage;
- добавить rate limiting и audit logging для route handlers;
- подключить observability: Sentry, structured logs, health checks;
- вынести email и moderation jobs в очередь;
- покрыть форму регистрации, отзывы и модерацию e2e-тестами.
