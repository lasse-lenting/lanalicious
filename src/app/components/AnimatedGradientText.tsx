import { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedGradientText({
  children,
  className = "",
}: AnimatedGradientTextProps) {
  return (
    <span
      className={`relative inline-block bg-gradient-to-r from-secondary via-white via-50% to-secondary bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent pb-2 ${className}`}
      style={{ WebkitBoxDecorationBreak: 'clone' }}
    >
      {children}
    </span>
  );
}

