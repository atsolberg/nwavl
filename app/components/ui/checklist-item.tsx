import React, { useId } from 'react';

function ChecklistItem({
  children,
  id: propId,
  ...rest
}: React.ComponentProps<'li'>) {
  const fallbackId = useId();
  const id = propId ?? fallbackId;
  return (
    <li id={id} {...rest}>
      <div className="flex">
        <span>
          <input id={`${id}-cb`} type="checkbox" />
        </span>
        <span className="ml-2 flex-grow">
          <label htmlFor={`${id}-cb`}>{children}</label>
        </span>
      </div>
    </li>
  );
}

export default ChecklistItem;
