import { cn } from '@/utils/helpers/cn';

interface GapsProps {
  children: React.ReactNode;
  className?: string;
}

export function Gaps({ children, className }: GapsProps) {
  return <div className={cn('flex gap-4', className)}>{children}</div>;
}

export function VerticalGaps({ children, className }: GapsProps) {
  return <div className={cn('flex flex-col gap-y-4', className)}>{children}</div>;
}
