import React, { useState, useEffect, useRef } from 'react';

export type RobotState =
  | 'entering'
  | 'greeting'
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'farewell';

export type RobotMood = 'normal' | 'happy' | 'wink' | 'curious' | 'excited';

export interface ProactiveReaction {
  text: string;
  actionLabel?: string;
  actionPrompt?: string;
}

interface AiRobotAvatarProps {
  state?: RobotState;
  farewellStep?: 'turn_and_wave' | 'glide_out' | null;
  compact?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'soft' | 'white';
  isUserTyping?: boolean;
  onInteractPrompt?: (prompt: string) => void;
  showBubble?: boolean;
}

const PATIENT_REACTIONS: ProactiveReaction[] = [
  {
    text: 'سلام! حواسم بهت هست، هر سؤالی داری بپرس',
    actionLabel: 'مشاهده نمونه‌کارها',
    actionPrompt: 'دیدن نمونه‌کارها',
  },
  {
    text: 'می‌خوای هزینه درمانت رو سریع حساب کنیم؟',
    actionLabel: 'محاسبه هزینه و تعرفه‌ها',
    actionPrompt: 'هزینه خدمات و روش‌های درمان',
  },
  {
    text: 'می‌تونم برات نوبت معاینه دکتر شمس‌پور رو رزرو کنم!',
    actionLabel: 'معرفی دکتر شمس‌پور',
    actionPrompt: 'معرفی دکتر شمس‌پور',
  },
  {
    text: 'درباره ایمپلنت، کامپوزیت یا لمینت سؤال داری؟',
    actionLabel: 'تفاوت کامپوزیت و لمینت',
    actionPrompt: 'تفاوت کامپوزیت و لمینت چیست؟',
  },
];


/**
 * Intelligent, Interactive Minimalist Square Robot with Two Blinking & Gaze-Tracking Eyes
 * Inherits the Parmis Dental Clinic design system (#004ac6, #2563eb, #dbe1ff, #ffffff)
 */
export const AiRobotAvatar: React.FC<AiRobotAvatarProps> = ({
  state = 'idle',
  farewellStep = null,
  compact = false,
  size,
  variant = 'primary',
  isUserTyping = false,
  onInteractPrompt,
  showBubble = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gaze, setGaze] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mood, setMood] = useState<RobotMood>('normal');
  const [isJumping, setIsJumping] = useState(false);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [activeBubble, setActiveBubble] = useState<ProactiveReaction | null>(null);
  const lastMouseMoveRef = useRef<number>(Date.now());
  const bubbleTimeoutRef = useRef<number | null>(null);

  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  const isFarewell = state === 'farewell';
  const isGreeting = state === 'greeting' || state === 'entering';

  const resolvedSize = size || (compact ? 'md' : 'lg');

  const sizeClasses =
    resolvedSize === 'xs'
      ? 'w-6 h-6 rounded-lg'
      : resolvedSize === 'sm'
      ? 'w-9 h-9 rounded-xl'
      : resolvedSize === 'md'
      ? 'w-12 h-12 rounded-2xl'
      : 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl';

  const surfaceClasses =
    variant === 'white'
      ? 'bg-white text-[#004ac6] border border-[#c3c6d7]/50 shadow-xs'
      : variant === 'soft'
      ? 'bg-[#dbe1ff]/80 text-[#004ac6] border border-[#004ac6]/20'
      : 'bg-[#004ac6] text-white shadow-[0_10px_25px_-5px_rgba(0,74,198,0.35)]';

  const eyeColor = variant === 'primary' ? '#ffffff' : '#004ac6';
  const reactionsList = PATIENT_REACTIONS;

  // Track mouse/touch across viewport so the robot's eyes follow the user
  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      lastMouseMoveRef.current = Date.now();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy) || 1;
      const maxOffset = 3.2;
      const factor = Math.min(dist / 220, 1);

      setGaze({
        x: Number(((dx / dist) * maxOffset * factor).toFixed(2)),
        y: Number(((dy / dist) * maxOffset * factor).toFixed(2)),
      });
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // When user is typing, look down attentively at the input box
  useEffect(() => {
    if (isUserTyping) {
      setGaze({ x: 0, y: 2.8 });
      setMood('curious');
    } else if (mood === 'curious') {
      setMood('normal');
      setGaze({ x: 0, y: 0 });
    }
  }, [isUserTyping, mood]);

  // Autonomous idle curiosity & proactive user engagement
  useEffect(() => {
    if (isThinking || isSpeaking || isFarewell) return;

    const interval = window.setInterval(() => {
      const idleMs = Date.now() - lastMouseMoveRef.current;

      // If user hasn't moved mouse recently, look around autonomously
      if (idleMs > 3000 && !isUserTyping) {
        const randomAngles = [
          { x: -2.4, y: -1.2 },
          { x: 2.4, y: -1.0 },
          { x: 0, y: 0 },
          { x: -1.8, y: 1.5 },
          { x: 1.8, y: 1.2 },
        ];
        const pick = randomAngles[Math.floor(Math.random() * randomAngles.length)];
        setGaze(pick);

        // Occasional friendly wink or happy expression
        if (Math.random() > 0.65) {
          setMood(Math.random() > 0.5 ? 'wink' : 'happy');
          window.setTimeout(() => setMood('normal'), 900);
        }
      }

      // Proactive interaction bubble if user is idle for > 8s and no bubble is shown
      if (showBubble && idleMs > 8000 && !activeBubble && !isUserTyping && Math.random() > 0.45) {
        const nextIdx = (reactionIndex + 1) % reactionsList.length;
        setReactionIndex(nextIdx);
        setActiveBubble(reactionsList[nextIdx]);
        setMood('happy');
        window.setTimeout(() => setMood('normal'), 1200);

        if (bubbleTimeoutRef.current) window.clearTimeout(bubbleTimeoutRef.current);
        bubbleTimeoutRef.current = window.setTimeout(() => {
          setActiveBubble(null);
        }, 6500);
      }
    }, 3500);

    return () => window.clearInterval(interval);
  }, [
    isThinking,
    isSpeaking,
    isFarewell,
    isUserTyping,
    showBubble,
    activeBubble,
    reactionIndex,
    reactionsList,
  ]);

  // Clean up bubble timer on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) window.clearTimeout(bubbleTimeoutRef.current);
    };
  }, []);

  // Direct click interaction on the robot
  const handleRobotClick = () => {
    setIsJumping(true);
    const moods: RobotMood[] = ['wink', 'happy', 'excited'];
    const chosenMood = moods[Math.floor(Math.random() * moods.length)];
    setMood(chosenMood);

    const nextIdx = (reactionIndex + 1) % reactionsList.length;
    setReactionIndex(nextIdx);
    if (showBubble) {
      setActiveBubble(reactionsList[nextIdx]);
      if (bubbleTimeoutRef.current) window.clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = window.setTimeout(() => {
        setActiveBubble(null);
      }, 7000);
    }

    window.setTimeout(() => setIsJumping(false), 450);
    window.setTimeout(() => setMood('normal'), 1400);
  };

  // Compute eye offset based on state + mouse gaze
  const eyeOffsetX = isThinking ? 1.8 : isUserTyping ? 0 : gaze.x;
  const eyeOffsetY = isThinking ? -2.2 : isUserTyping ? 2.6 : gaze.y;

  return (
    <div ref={containerRef} className="relative inline-flex flex-col items-center select-none">
      {/* Interactive Square Robot Body */}
      <button
        type="button"
        onClick={handleRobotClick}
        onMouseEnter={() => {
          if (mood === 'normal') setMood('happy');
        }}
        onMouseLeave={() => {
          if (mood === 'happy') setMood('normal');
        }}
        title="برای تعامل با من کلیک کنید"
        aria-label="کاراکتر هوشمند"
        className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer focus:outline-none transition-all duration-300 ${sizeClasses} ${surfaceClasses} ${
          isFarewell && farewellStep === 'glide_out'
            ? 'scale-75 opacity-0 duration-300'
            : isJumping
            ? '-translate-y-2 scale-105 rotate-2'
            : isGreeting
            ? 'scale-105'
            : isThinking
            ? 'scale-[1.04]'
            : 'hover:scale-105 active:scale-95'
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle inner square frame */}
          <rect
            x="3"
            y="3"
            width="34"
            height="34"
            rx="9"
            stroke={variant === 'primary' ? 'rgba(255,255,255,0.2)' : 'rgba(0,74,198,0.16)'}
            strokeWidth="1.2"
          />

          {/* Two Blinking & Gaze-Tracking Eyes */}
          <g
            className="ai-robot-eyes-blink transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px) ${
                isSpeaking ? 'scaleY(1.12)' : ''
              }`,
              transformOrigin: '20px 20px',
            }}
          >
            {mood === 'happy' || (isFarewell && farewellStep === 'turn_and_wave') ? (
              /* Cheerful Curved Happy Eyes (^ ^) */
              <>
                <path
                  d="M10.5 21C11.5 17 15.5 17 16.5 21"
                  stroke={eyeColor}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M23.5 21C24.5 17 28.5 17 29.5 21"
                  stroke={eyeColor}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </>
            ) : mood === 'wink' ? (
              /* Playful Winking Eyes (-  0) */
              <>
                <rect x="10.5" y="18.5" width="6" height="3" rx="1.5" fill={eyeColor} />
                <rect x="23.5" y="13.5" width="5" height="12.5" rx="2.5" fill={eyeColor} />
              </>
            ) : (
              /* Standard Expressive Vertical Pill Eyes */
              <>
                {/* Left Eye */}
                <rect
                  x="11.5"
                  y={mood === 'excited' ? '12.5' : '14'}
                  width="5"
                  height={mood === 'excited' ? '14.5' : isUserTyping ? '10.5' : '12'}
                  rx="2.5"
                  fill={eyeColor}
                  className={isThinking ? 'animate-pulse' : ''}
                />

                {/* Right Eye */}
                <rect
                  x="23.5"
                  y={mood === 'excited' ? '12.5' : '14'}
                  width="5"
                  height={mood === 'excited' ? '14.5' : isUserTyping ? '10.5' : '12'}
                  rx="2.5"
                  fill={eyeColor}
                  className={isThinking ? 'animate-pulse' : ''}
                />
              </>
            )}
          </g>
        </svg>

        {/* Active Status Pulse Dot when Thinking or Speaking */}
        {(isThinking || isSpeaking) && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
        )}
      </button>

      {/* Interactive Proactive Bubble when Robot Interacts with User */}
      {showBubble && activeBubble && (
        <div className="mt-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#c3c6d7]/60 shadow-sm text-center max-w-xs animate-fadeIn flex flex-col items-center gap-1.5">
          <p className="text-[11px] font-bold text-[#191c1e] leading-relaxed">
            {activeBubble.text}
          </p>
          {activeBubble.actionLabel && activeBubble.actionPrompt && onInteractPrompt && (
            <button
              type="button"
              onClick={() => {
                const promptToRun = activeBubble.actionPrompt!;
                setActiveBubble(null);
                onInteractPrompt(promptToRun);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#dbe1ff]/60 hover:bg-[#004ac6] text-[#004ac6] hover:text-white text-[10px] font-extrabold transition-colors cursor-pointer"
            >
              {activeBubble.actionLabel} ←
            </button>
          )}
        </div>
      )}
    </div>
  );
};
