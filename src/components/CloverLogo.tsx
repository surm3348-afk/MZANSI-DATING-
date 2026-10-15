import React from 'react';

interface CloverLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const CloverIcon: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-sm ${className}`}
  >
    <defs>
      <linearGradient id="goldCloverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DFBF75" />
        <stop offset="45%" stopColor="#C5A253" />
        <stop offset="100%" stopColor="#A47B2C" />
      </linearGradient>
      <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#C5A253" stopOpacity="0" />
      </linearGradient>
    </defs>
    
    {/* 4 Clover Petals with Romantic Heart Shapes */}
    <g fill="url(#goldCloverGrad)" stroke="#B78E3E" strokeWidth="1.5">
      {/* Top Petal */}
      <path d="M50 48 C43 32, 28 20, 39 12 C48 5, 50 25, 50 48 Z" />
      <path d="M50 48 C57 32, 72 20, 61 12 C52 5, 50 25, 50 48 Z" />

      {/* Right Petal */}
      <path d="M48 50 C64 43, 76 28, 84 39 C91 48, 71 50, 48 50 Z" />
      <path d="M48 50 C64 57, 76 72, 84 61 C91 52, 71 50, 48 50 Z" />

      {/* Bottom Petal */}
      <path d="M50 48 C57 64, 72 76, 61 84 C52 91, 50 71, 50 48 Z" />
      <path d="M50 48 C43 64, 28 76, 39 84 C48 91, 50 71, 50 48 Z" />

      {/* Left Petal */}
      <path d="M48 50 C32 57, 20 72, 12 61 C5 52, 25 50, 48 50 Z" />
      <path d="M48 50 C32 43, 20 28, 12 39 C5 48, 25 50, 48 50 Z" />
    </g>

    {/* Center subtle gem bead */}
    <circle cx="50" cy="50" r="4.5" fill="#FFF4D0" stroke="#9E7728" strokeWidth="1" />
    <circle cx="49" cy="49" r="1.5" fill="#FFFFFF" />
  </svg>
);

export const FloatingCloversBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Gold Clovers */}
      <div className="absolute top-[8%] left-[6%] animate-float-slow opacity-35">
        <CloverIcon size={24} />
      </div>
      <div className="absolute top-[18%] right-[8%] animate-float-delayed opacity-40">
        <CloverIcon size={32} />
      </div>
      <div className="absolute top-[52%] left-[4%] animate-float-delayed opacity-25">
        <CloverIcon size={20} />
      </div>
      <div className="absolute top-[75%] right-[6%] animate-float-slow opacity-30">
        <CloverIcon size={28} />
      </div>
      <div className="absolute bottom-[8%] left-[12%] animate-float-slow opacity-25">
        <CloverIcon size={22} />
      </div>

      {/* Soft Rose & Gold Sparkles */}
      <div className="absolute top-[12%] left-[45%] text-[#C5A253] text-xs opacity-40 animate-pulse-glow">✨</div>
      <div className="absolute top-[28%] left-[12%] text-[#C5A253] text-sm opacity-50 animate-pulse-glow">✨</div>
      <div className="absolute top-[35%] right-[18%] text-[#E879F9] text-xs opacity-45">✦</div>
      <div className="absolute top-[68%] left-[18%] text-[#C5A253] text-xs opacity-40 animate-pulse-glow">✨</div>
      <div className="absolute bottom-[16%] right-[14%] text-[#F472B6] text-xs opacity-40">✦</div>
      <div className="absolute bottom-[24%] left-[6%] text-[#C5A253] text-xs opacity-35">✨</div>
    </div>
  );
};
