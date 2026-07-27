import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr role="separator" className={cn('border-seg-border', className)} {...props} />;
}
