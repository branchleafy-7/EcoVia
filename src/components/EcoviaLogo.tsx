import React from 'react';

interface EcoviaLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const EcoviaLogo: React.FC<EcoviaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true
}) => {
  // Dimensional sizing
  const iconSizeClass =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const svgSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const wordmarkSizeClass =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  // Distinctive geometric mark representing ECOVIA (Eco + Via):
  // Clean geometric circular-leaf contour crossed by an upward trajectory pathway arrow
  const iconElement = (
    <div
      className={`${iconSizeClass} rounded-xl bg-[#132E20] dark:bg-[#1B2921] border border-[#1E432F] dark:border-[#2F4A3B] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 shrink-0`}
      aria-hidden="true"
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#86EFAC] dark:text-[#4ADE80]"
      >
        {/* Eco: Geometric circular loop and leaf contour */}
        <path
          d="M7 23C7 13.6 14.2 7 24 7C24 16.4 16.8 23 7 23Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="opacity-90"
        />
        {/* Via: Forward diagonal trajectory through the contour */}
        <path
          d="M5 25L15 15L25 7"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Via arrowhead pointing forward */}
        <path
          d="M19 7H25V13"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{iconElement}</div>;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {iconElement}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold tracking-tight text-[#132E20] dark:text-[#E2E8E4] ${wordmarkSizeClass}`}
          >
            ECOVIA
          </span>
          {variant === 'full' && (
            <span className="hidden md:inline-flex items-center text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#E2E8E4] dark:bg-[#233129] text-[#132E20]/80 dark:text-[#86EFAC]">
              Decision Tool
            </span>
          )}
        </div>
        {variant === 'full' && showTagline && (
          <p className="text-[11px] text-[#5A6860] dark:text-[#8E9E95] hidden sm:block leading-none mt-0.5">
            Smarter events. Sustainable choices.
          </p>
        )}
      </div>
    </div>
  );
};
