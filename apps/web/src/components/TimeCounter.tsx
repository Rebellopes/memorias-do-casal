'use client';

import { useEffect, useState } from 'react';

interface TimeCounterProps {
  startDate: Date;
  className?: string;
  compact?: boolean;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateElapsed(start: Date): TimeElapsed {
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return { years, months, days, hours, minutes, seconds };
}

export function TimeCounter({ startDate, className = '', compact = false }: TimeCounterProps) {
  const [elapsed, setElapsed] = useState<TimeElapsed>(calculateElapsed(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(calculateElapsed(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  if (compact) {
    return (
      <span className={`text-xs tabular-nums text-stone-400 ${className}`}>
        {elapsed.years}y {elapsed.months}m {elapsed.days}d
      </span>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-baseline justify-center gap-3 font-serif">
        <span className="text-5xl font-light text-stone-700">{elapsed.years}</span>
        <span className="text-sm uppercase tracking-widest text-stone-400">Anos</span>
        <span className="text-5xl font-light text-stone-700">{elapsed.months}</span>
        <span className="text-sm uppercase tracking-widest text-stone-400">Meses</span>
        <span className="text-5xl font-light text-stone-700">{elapsed.days}</span>
        <span className="text-sm uppercase tracking-widest text-stone-400">Dias</span>
      </div>
      <p className="mt-2 font-serif text-lg text-stone-400">
        {elapsed.hours}h {elapsed.minutes}m {elapsed.seconds}s
      </p>
    </div>
  );
}
