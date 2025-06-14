import React from 'react';
import { cn } from '#app/utils/misc.tsx';

interface HeadingOwnProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Heading<T extends React.ElementType = 'h3'>({
  as,
  size = 'md',
  children,
  ...props
}: HeadingOwnProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof HeadingOwnProps>) {
  const Component = as || 'h3';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <Component
      className={cn(
        'mt-5 mb-3',
        sizeClasses[size],
        'leading-6',
        'font-semibold',
        'text-slate-700 dark:text-sky-400'
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Heading;
