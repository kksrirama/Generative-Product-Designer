
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder="e.g., 'Make this shoe look more futuristic' or 'Add a retro filter to this product image'"
      rows={4}
      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
    />
  );
};
