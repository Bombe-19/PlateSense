import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  containerClassName?: string;
  textClassName?: string;
  enableBlur?: boolean;
  duration?: number;
  stagger?: number;
  wordDelay?: number;
}

const ScrollReveal = ({
  children,
  containerClassName = '',
  textClassName = '',
  enableBlur = true,
  duration = 0.6,
  stagger = 0.08,
  wordDelay = 2
}: ScrollRevealProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll('.word');

    const ctx = gsap.context(() => {
      const animConfig: any = {
        opacity: 0,
        y: 40
      };

      if (enableBlur) {
        animConfig.filter = 'blur(6px)';
      }

      gsap.fromTo(
        words,
        animConfig,
        {
          opacity: 1,
          y: 0,
          filter: enableBlur ? 'blur(0px)' : undefined,
          stagger,
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, ref);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [duration, stagger, enableBlur]);

  const text =
    typeof children === 'string'
      ? children.split(' ').map((word, i) => (
          <span key={i} className="word inline-block mr-2">
            {word}
          </span>
        ))
      : children;

  return (
    <div ref={ref} className={`scroll-reveal ${containerClassName}`.trim()}>
      <div className={`scroll-reveal-text ${textClassName}`.trim()}>
        {text}
      </div>
    </div>
  );
};

export default ScrollReveal;