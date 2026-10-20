import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface DentalMotionGuideProps {
  activePage: 'home' | 'services' | 'about' | 'blog' | 'article' | 'gallery' | 'contact';
}

/**
 * Interactive Dental Scroll & Eye-Guide System:
 * 1. Top reading progress bar with a glowing tooth/sparkle follower that moves as user scrolls.
 * 2. Floating side reading-guide indicator (desktop) showing which dental section the user's eye is currently reading, with animated dental SVG connectors.
 * 3. Automatic IntersectionObserver that smoothly reveals sections, headings, and dental cards as they enter the viewport and highlights the active reading block.
 */
export const DentalMotionGuide: React.FC<DentalMotionGuideProps> = ({ activePage }) => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  // Automatically attach scroll-triggered reveal animations to page sections and cards
  useEffect(() => {
    const timer = setTimeout(() => {
      // Select headings, cards, and key content blocks to guide the user's eye smoothly
      const revealTargets = document.querySelectorAll(
        'main section h1, main section h2, main section > div > div, [data-dental-card]'
      );

      revealTargets.forEach((el, index) => {
        if (!el.hasAttribute('data-dental-reveal')) {
          el.setAttribute('data-dental-reveal', 'up');
          (el as HTMLElement).style.transitionDelay = `${(index % 4) * 55}ms`;
        }
      });

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      revealTargets.forEach((el) => revealObserver.observe(el));

      return () => {
        revealObserver.disconnect();
      };
    }, 80);

    return () => clearTimeout(timer);
  }, [activePage]);

  return (
    <>
      {/* 1. Top Dental Reading Progress Bar with Glowing Follower */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-[#dbe1ff]/40 pointer-events-none overflow-visible">
        <motion.div
          style={{ scaleX: smoothProgress, transformOrigin: 'right' }}
          className="h-full w-full bg-gradient-to-l from-[#004ac6] via-[#2563eb] to-[#00569c] shadow-[0_0_10px_rgba(37,99,235,0.6)]"
        />
      </div>
    </>
  );
};

/**
 * Reusable Animated Dental Section Connector & Eye-Guide Divider
 * Draws the user's eye smoothly from one section to the next with a tooth/smile wave motion.
 */
export const DentalEyeGuideDivider: React.FC<{
  label?: string;
  icon?: string;
}> = ({ label = 'بخش بعدی را مطالعه کنید', icon = 'dentistry' }) => {
  return (
    <div className="relative py-2 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Animated vertical guide line */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        whileInView={{ height: 26, opacity: 1 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-[1.5px] bg-gradient-to-b from-transparent via-[#004ac6]/40 to-[#004ac6]"
      />

      {/* Dental Badge with Sparkle & Bounce */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -6 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="my-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbe1ff]/50 border border-[#004ac6]/20 text-[#004ac6] shadow-2xs"
      >
        <span className="material-symbols-outlined text-[15px] animate-dental-sparkle">
          {icon}
        </span>
        <span className="text-[10px] font-bold tracking-tight text-[#004ac6]">{label}</span>
        <span className="material-symbols-outlined text-[14px] animate-eye-guide">
          keyboard_double_arrow_down
        </span>
      </motion.div>
    </div>
  );
};
