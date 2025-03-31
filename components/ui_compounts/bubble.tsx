import React from 'react';
import { Message } from 'ai';

const Bubble = ({ message }: { message: Message }) => {
  const { content, role } = message;
  return (
    
    <div  className={`m-2 p-2 text-sm w-4/5 text-left border ${
            role === 'user' ? 'rounded-tr-lg rounded-br-lg rounded-tl-lg bg-gray-800 text-gray-200 mr-auto' : 'rounded-tr-lg rounded-br-lg rounded-bl-lg bg-gray-600 text-gray-300 ml-auto'
        }`}>{content}</div>
  );
};

export default Bubble;