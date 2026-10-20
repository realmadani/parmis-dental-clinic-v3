import React from 'react';

interface AiChatFloatingButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  label?: string;
  className?: string;
}

/**
 * Reusable Minimalist Sticky Floating AI Robot Button
 * Can be positioned at bottom-left or customized via className
 */
export const AiChatFloatingButton: React.FC<AiChatFloatingButtonProps> = ({
  onClick,
  isOpen = false,
  label = 'دستیار هوشمند',
  className = 'fixed bottom-5 left-5 z-40 group',
}) => {
  if (isOpen) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        aria-label="دستیار هوشمند کلینیک - از من بپرس"
        aria-expanded={isOpen}
        className="relative flex items-center gap-2 h-10 px-3 rounded-2xl bg-[#004ac6] hover:bg-[#2563eb] text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer border border-white/15"
      >
        {/* Minimal Square with Two Blinking Eyes */}
        <span className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <g className="ai-robot-eyes-blink" style={{ transformOrigin: '12px 12px' }}>
              <rect x="6.5" y="7.5" width="3.2" height="9" rx="1.6" fill="#ffffff" />
              <rect x="14.3" y="7.5" width="3.2" height="9" rx="1.6" fill="#ffffff" />
            </g>
          </svg>
        </span>
        <span className="text-xs font-extrabold tracking-wide leading-none">AI</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-[85px] transition-all duration-300 ease-out text-[11px] font-bold whitespace-nowrap">
          {label}
        </span>
      </button>
    </div>
  );
};
