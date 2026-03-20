export const helpTypeLabels = {
  LAB_GUIDANCE: 'Лабораторная — консультация',
  PRACTICE_COACHING: 'Практическая — разбор',
  REPORT_REVIEW: 'Доклад — ревью',
  COURSE_PROJECT_MENTORING: 'Курсовой проект — менторство',
  THESIS_CONSULTING: 'Дипломное исследование — консультация'
} as const;

export const materialTypeLabels = {
  NOTES: 'Конспект',
  TEMPLATE: 'Шаблон',
  GUIDE: 'Гайд',
  PRESENTATION: 'Презентация',
  CHEATSHEET: 'Памятка',
  CODE_EXAMPLE: 'Пример кода'
} as const;

export const defaultStartingPrices = {
  LAB_GUIDANCE: 1200,
  PRACTICE_COACHING: 1000,
  REPORT_REVIEW: 900,
  COURSE_PROJECT_MENTORING: 2800,
  THESIS_CONSULTING: 4500
} as const;

export type HelpTypeKey = keyof typeof helpTypeLabels;
export type MaterialTypeKey = keyof typeof materialTypeLabels;
