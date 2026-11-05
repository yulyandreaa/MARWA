'use client';

import {useEffect, useRef, useState} from 'react';

/** Adds `.in` to every [data-reveal] element when it enters the viewport. */
export function RevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          o.unobserve(e.target);
        }
      });
    }, {threshold: 0.15, rootMargin: '0px 0px -40px 0px'});
    els.forEach(el => o.observe(el));
    return () => o.disconnect();
  }, []);
  return null;
}

export function CountUp({value, prefix = '', suffix = ''}: {value: number; prefix?: string; suffix?: string}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, {threshold: 0.4});
    o.observe(el);
    return () => o.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}
