"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  gridSize?: number;
  strokeWidth?: number;
  strokeOpacity?: number;
  fadeOpacity?: number;
}

export function GridBackground({
  className,
  children,
  gridSize = 50,
  strokeWidth = 1,
  strokeOpacity = 0.3,
  fadeOpacity = 0.5,
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center bg-black",
        className,
      )}
    >
      <div className="absolute inset-0 h-full w-full">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <pattern
              id="grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="rgba(59, 130, 246, 0.3)" // blue-500 with opacity
                strokeWidth={strokeWidth}
              />
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="70%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity={fadeOpacity} />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#fade)" />
        </svg>
      </div>
      {children}
    </div>
  );
}

export function GridSmallBackground({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <GridBackground
      className={className}
      gridSize={25}
      strokeWidth={0.5}
      strokeOpacity={0.2}
      fadeOpacity={0.3}
    >
      {children}
    </GridBackground>
  );
}

export function DotBackground({
  className,
  children,
  dotSize = 1,
  dotSpacing = 25,
  dotOpacity = 0.3,
  fadeOpacity = 0.5,
}: {
  className?: string;
  children?: React.ReactNode;
  dotSize?: number;
  dotSpacing?: number;
  dotOpacity?: number;
  fadeOpacity?: number;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center bg-black",
        className,
      )}
    >
      <div className="absolute inset-0 h-full w-full">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <pattern
              id="dots"
              width={dotSpacing}
              height={dotSpacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={dotSpacing / 2}
                cy={dotSpacing / 2}
                r={dotSize}
                fill={`rgba(59, 130, 246, ${dotOpacity})`} // blue-500 with opacity
              />
            </pattern>
            <radialGradient id="dotFade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="70%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity={fadeOpacity} />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <rect width="100%" height="100%" fill="url(#dotFade)" />
        </svg>
      </div>
      {children}
    </div>
  );
}
