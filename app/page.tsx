'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import Autocomplete, { AutocompleteRef } from '@/components/autocomplete-module/Autocomplete';
import { generateSuggestion, modelMaxLengths, roles, RoleType, defaultRole } from '@/components/autocomplete-module/aiService';
import { ThemeToggle } from '@/components/ThemeToggle';

const defaultModels = [
  { value: 'anthropic/claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
];

export default function AutocompletePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].value);
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole);
  const [models, setModels] = useState(defaultModels);
  const [isCopied, setIsCopied] = useState(false);
  const autocompleteRef = useRef<AutocompleteRef>(null);

  const fetchLMStudioModels = useCallback(async () => {
    try {
      const response = await fetch('/api/openai?action=models');
      if (response.ok) {
        const lmStudioModels = await response.json();
        setModels([...defaultModels, ...lmStudioModels]);
      }
    } catch (error) {
      console.error('Error fetching LMStudio models:', error);
    }
  }, []);

  useEffect(() => {
    fetchLMStudioModels();
    setMounted(true);
  }, [fetchLMStudioModels]);

  const handleSelect = (selected: string) => {
    console.log('Selected:', selected);
    // You can add more logic here, like updating state or making an API call
  };

  const handleCopy = () => {
    if (autocompleteRef.current) {
      const text = autocompleteRef.current.getValue();
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="autocomplete-page p-4 sm:p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">AI Drafting</h1>
        <ThemeToggle />
      </div>
      <div className={`bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md`}>
        <p className="text-sm text-black dark:text-white leading-relaxed">
          Experience the future of writing with our AI-powered drafting tool. As you type, receive real-time suggestions from advanced language models, helping you craft compelling content faster and more efficiently.
        </p>
        <ul className="mt-2 text-sm text-black dark:text-white list-disc list-inside">
          <li>Powered by cutting-edge AI models from OpenAI, Anthropic, and more</li>
          <li>Adapts to various writing styles and topics</li>
          <li>Helps overcome writer's block and sparks creativity</li>
          <li>Customizable to suit your specific needs</li>
        </ul>
        <p className="text-sm text-black dark:text-white mt-2 font-semibold">
          Tip: Press Tab to accept suggestions, Esc to hide them.
        </p>
      </div>
      <div className="mb-4 sm:mb-6">
        <label htmlFor="model-select" className="block mb-2 font-medium text-sm sm:text-base">Select Model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 sm:mb-6">
        <label htmlFor="role-select" className="block mb-2 font-medium text-sm sm:text-base">Select Role:</label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as RoleType)}
          className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          {(Object.keys(roles) as RoleType[]).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs sm:text-sm">Start typing:</p>
        <button
          onClick={handleCopy}
          className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
            isCopied 
              ? 'bg-green-500 text-white' 
              : `${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
          aria-label="Copy to clipboard"
        >
          {isCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <div className="relative mb-4">
        <Autocomplete
          ref={autocompleteRef}
          onSelect={handleSelect}
          generateSuggestions={(input: string) => generateSuggestion(input, selectedModel, selectedRole)}
          model={selectedModel}
          maxInputLength={modelMaxLengths[selectedModel] || 1000}
          className="text-sm w-full"
          suggestionClassName="mt-1"
        />
      </div>
    </div>
  );
}
