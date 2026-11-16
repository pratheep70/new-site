import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 pointer-events-none bg-gradient-to-r from-[#008CD2] via-[#00A3E0] to-[#84C325]"
      style={{ scaleX }}
    />
  );
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
  y = 14,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.25, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some', margin: '160px 0px' }}
      transition={{ duration: 0.36, delay: Math.min(delay, 0.12), ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PopUpCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.25, y: 16, scale: 0.975 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 'some', margin: '160px 0px' }}
      whileHover={{ y: -4, transition: { duration: 0.18, ease: EASE_EDITORIAL } }}
      transition={{ duration: 0.36, delay: Math.min(delay, 0.14), ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
