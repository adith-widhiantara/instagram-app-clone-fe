import { PropsWithChildren } from 'react';
import { Badge } from './badge';
import { P } from './typography';
import { cn } from '@/utils/helpers/cn';

interface DataInfoProps extends PropsWithChildren {
  label?: string;
  value?: string | number;
  className?: string;
}

type Variant = 'success' | 'destructive' | 'warning' | 'default' | 'failed';

// eslint-disable-next-line react-refresh/only-export-components
export const statusVariantMap: Record<string, Variant> = {
  completed: 'success',
  cancelled: 'destructive',
  'in progress': 'warning',
};

export function DataInfo({ label = '', value = '', children, className }: DataInfoProps) {
  return (
    <div className={cn('break-inside-avoid-column', className)}>
      <P className="text-sm font-semibold dark:text-neutral-300">{label}:</P>
      {value && <P className="min-h-6 break-words text-neutral-700 dark:text-neutral-400">{value}</P>}
      {children}
    </div>
  );
}

export function DataInfoWithBadge({ label = '', value = '', className }: DataInfoProps) {
  const variant = statusVariantMap[value] || 'default';

  return (
    <div className={cn('break-inside-avoid-column', className)}>
      <P className="text-sm font-semibold dark:text-neutral-300">{label}:</P>
      <Badge className="pointer-events-none" variant={variant}>
        {value}
      </Badge>
    </div>
  );
}
