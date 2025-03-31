import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Message } from 'ai';

// Predefine style maps for better performance
const BUBBLE_STYLES = {
  user: 'bg-gray-800 text-gray-200 border-gray-700 mr-auto rounded-tr-lg rounded-br-lg rounded-tl-lg',
  assistant: 'bg-gray-600 text-gray-300 border-gray-500 ml-auto rounded-tr-lg rounded-br-lg rounded-bl-lg',
  system: 'bg-blue-900 text-blue-100 border-blue-700 mx-auto rounded-lg my-4 max-w-full',
};

// Pure component implementation for bubble
const Bubble = React.memo(({ message }) => {
  const { content, role } = message;

  // Only process content if it's a string
  const formattedText = useMemo(() => {
    if (typeof content !== 'string') return String(content);
    
    // More efficient text processing
    return content.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  }, [content]);

  // Use class lookup for improved performance
  const className = BUBBLE_STYLES[role] || BUBBLE_STYLES.assistant;

  return (
    <div className={cn('m-2 p-2 text-left border w-4/5', className)}>
      {role === 'system' && (
        <div className="font-semibold text-blue-200 mb-1">System Information</div>
      )}
      <div className="whitespace-pre-wrap">
        {formattedText}
      </div>
    </div>
  );
});

Bubble.displayName = "MessageBubble";

export default Bubble;