'use client';

import React, { useState, useEffect } from 'react';
import { Autocomplete }  from '@/autocomplete-module';
import { generateSuggestion, modelMaxLengths } from '@/autocomplete-module/aiService';

const defaultModels = [
  { value: 'anthropic/claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
];

export default function AutocompletePage() {
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].value);
  const [models, setModels] = useState(defaultModels);

  useEffect(() => {
    // Fetch LMStudio models when the component mounts
    fetchLMStudioModels();
  }, []);

  const fetchLMStudioModels = async () => {
    try {
      const response = await fetch('/api/chat?action=models');
      if (response.ok) {
        const lmStudioModels = await response.json();
        setModels([...defaultModels, ...lmStudioModels]);
      }
    } catch (error) {
      console.error('Error fetching LMStudio models:', error);
    }
  };

  const handleSelect = (selected: string) => {
    console.log('Selected:', selected);
    // You can add more logic here, like updating state or making an API call
  };

  return (
    <div className="autocomplete-page p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Autocomplete</h1>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
        <p className="text-sm text-black leading-relaxed">
          Experience real-time AI-powered suggestions as you type. Write faster and more efficiently with advanced language model predictions. Powered by OpenAI, Anthropic, and MetaAI models.
        </p>
        <p className="text-sm text-black mt-2 font-semibold">
          Tip: Press Tab to accept, Esc to hide suggestions.
        </p>
      </div>
      <div className="mb-6">
        <label htmlFor="model-select" className="block mb-2 font-medium">Select Model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-2">Start typing:</p>
      <Autocomplete
        onSelect={handleSelect}
        generateSuggestions={(input: string) => generateSuggestion(input, selectedModel)}
        model={selectedModel}
        maxInputLength={modelMaxLengths[selectedModel] || 1000}
      />
    </div>
  );
}