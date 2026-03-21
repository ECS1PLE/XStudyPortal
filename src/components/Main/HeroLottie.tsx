'use client';

import Lottie from 'lottie-react';
import animationData from '../../../public/animations/education-flow.json';

export function HeroLottie() {
  return (
    <div className="flex h-full min-h-[340px] items-center justify-center rounded-[1.6rem] bg-white/10">
      <Lottie animationData={animationData} loop className="h-full max-h-[420px] w-full max-w-[420px]" />
    </div>
  );
}
