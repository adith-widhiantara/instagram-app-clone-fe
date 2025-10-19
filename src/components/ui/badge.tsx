import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/helpers/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-200 text-black hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        destructive:
          'border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80',
        success:
          'border-transparent bg-green-700 text-neutral-50 hover:bg-green-700/80 dark:bg-green-900 dark:text-neutral-50 dark:hover:bg-green-900/80',
        warning:
          'border-transparent bg-yellow-500 text-neutral-50 hover:bg-yellow-500/80 dark:bg-yellow-900 dark:text-neutral-50 dark:hover:bg-yellow-900/80',
        outline: 'text-neutral-950 dark:text-neutral-50',
        rfsDraft:
          'border-transparent bg-[#FFC107] text-[#2B2B2B] hover:bg-[#FFC107]/80 dark:bg-[#FFC107] dark:text-neutral-900 dark:hover:bg-[#FFC107]/80',
        rfsPrepare:
          'border-transparent bg-[#007BFF] text-white hover:bg-[#007BFF]/80 dark:bg-[#007BFF] dark:text-neutral-50 dark:hover:bg-[#007BFF]/80',
        rfsReview:
          'border-transparent bg-[#17A2B8] text-white hover:bg-[#17A2B8]/80 dark:bg-[#17A2B8] dark:text-neutral-50 dark:hover:bg-[#17A2B8]/80',
        rfsRejected:
          'border-transparent bg-[#DC3545] text-white hover:bg-[#DC3545]/80 dark:bg-[#DC3545] dark:text-neutral-50 dark:hover:bg-[#DC3545]/80',
        rfsGenerate:
          'border-transparent bg-[#28A745] text-white hover:bg-[#28A745]/80 dark:bg-[#28A745] dark:text-neutral-50 dark:hover:bg-[#28A745]/80',
        rfsCancelled:
          'border-transparent bg-[#6C757D] text-white hover:bg-[#6C757D]/80 dark:bg-[#6C757D] dark:text-neutral-50 dark:hover:bg-[#6C757D]/80',
        failed:
          'border-transparent bg-[#DC3545] text-white hover:bg-[#DC3545]/80 dark:bg-[#DC3545] dark:text-neutral-50 dark:hover:bg-[#DC3545]/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), 'capitalize', className)} {...props} />;
}

export { Badge, badgeVariants };
