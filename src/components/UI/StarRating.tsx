export function StarRating({ rating, size = 'base' }: { rating: number; size?: 'sm' | 'base' | 'lg' }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = rating >= index + 1;
    return (
      <span key={index} className={filled ? 'text-amber-400' : 'text-slate-300'}>
        ★
      </span>
    );
  });

  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return <div className={`flex items-center gap-1 ${sizeClass}`}>{stars}</div>;
}
