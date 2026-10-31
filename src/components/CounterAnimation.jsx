import React, { useEffect, useRef, useState } from 'react';

/**
 * CounterAnimation
 * Animates a number from 0 → `to` when the element scrolls into view.
 *
 * Props:
 *   to      {number} - target number (e.g. 25, 500, 100)
 *   speed   {number} - duration in ms (default 2000)
 *   suffix  {string} - text appended after the number (e.g. '+', '%')
 */
export default function CounterAnimation({ to, speed = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Watch for the element entering the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  // Run the animation once triggered
  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    const target = Number(to);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / speed, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [started, to, speed]);

  return (
    <span ref={ref}>
      <span className="timer">{count}</span>
      <span className="suffix">{suffix}</span>
    </span>
  );
}
