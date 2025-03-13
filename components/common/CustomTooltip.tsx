import React from 'react';
import { Tooltip } from 'react-tooltip';

interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, content }) => {
  const id = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <span data-tooltip-id={id} className="cursor-help">
        {children}
      </span>
      <Tooltip id={id} place="top" content={content} />
    </>
  );
}; 