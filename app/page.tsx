'use client';

import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, status } =
    useChat(); 

  return (
    <main>
      <h1 className='text-3xl'>chess bot</h1>

    </main>
    
  );
}
