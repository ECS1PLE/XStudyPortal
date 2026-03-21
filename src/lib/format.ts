export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatReviewCount(value: number) {
  if (value % 10 === 1 && value % 100 !== 11) return `${value} отзыв`;
  if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) return `${value} отзыва`;
  return `${value} отзывов`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium'
  }).format(new Date(value));
}
