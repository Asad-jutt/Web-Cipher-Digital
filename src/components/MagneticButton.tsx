import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance pull multiplier (e.g., 0.3 - 0.5)
  onClick?: () => void;
  id?: string;
  as?: 'button' | 'a' | 'div';
  href?: string;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onClick,
  id,
  as = 'div',
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      gsap.to(element, {
        x: distanceX * strength,
        y: distanceY * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  const Component = as;

  return (
    <Component
      id={id}
      ref={buttonRef as any}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      className={`inline-flex items-center justify-center transition-shadow cursor-pointer select-none ${className}`}
    >
      {children}
    </Component>
  );
}
