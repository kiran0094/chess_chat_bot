import React from 'react';

const Suggestion_button = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button className='rounded-xl bg-transparent border border-gray-300 m-2 p-2 text-gray-200 text-left' onClick={onClick}>
      {text}
    </button>
  );
};

export default Suggestion_button;