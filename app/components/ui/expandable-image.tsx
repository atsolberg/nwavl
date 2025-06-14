import React from 'react';
import { twMerge } from 'tailwind-merge';

function ExpandableImage({
  src,
  alt,
  className,
  ...rest
}: React.ComponentProps<'img'>) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <img
      src={src}
      onClick={() => setExpanded(!expanded)}
      {...rest}
      className={twMerge(
        'cursor-pointer rounded border-2 border-sky-600',
        'hover:border-2 hover:border-sky-300',
        className,
        !expanded && 'h-auto w-[200px]'
      )}
      alt={alt}
    />
  );
}

export default ExpandableImage;
