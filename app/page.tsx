'use client';

import React, { useState, useEffect } from 'react';
import Autocomplete from '@/autocomplete-module/Autocomplete';
import { generateSuggestion, modelMaxLengths, roles, RoleType, defaultRole } from '@/autocomplete-module/aiService';

const defaultModels = [
  { value: 'anthropic/claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
];

export default function AutocompletePage() {
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].value);
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole);
  const [models, setModels] = useState(defaultModels);

  useEffect(() => {
    // Fetch LMStudio models when the component mounts
    fetchLMStudioModels();
  }, []);

  const fetchLMStudioModels = async () => {
    try {
      const response = await fetch('/api/openai?action=models');
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
    <div className="autocomplete-page p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">AI Drafting</h1>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md">
        <p className="text-sm text-black leading-relaxed">
          Experience real-time AI-powered suggestions as you type. Write faster and more efficiently with advanced language model predictions. Powered by OpenAI, Anthropic, and MetaAI models.
        </p>
        <p className="text-sm text-black mt-2 font-semibold">
          Tip: Press Tab to accept, Esc to hide suggestions.
        </p>
      </div>
      <div className="mb-4 sm:mb-6">
        <label htmlFor="model-select" className="block mb-2 font-medium text-sm sm:text-base">Select Model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border rounded text-sm"
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
          className="w-full p-2 border rounded text-sm"
        >
          {(Object.keys(roles) as RoleType[]).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-2 text-xs sm:text-sm">Start typing:</p>
      <Autocomplete
        onSelect={handleSelect}
        generateSuggestions={(input: string) => generateSuggestion(input, selectedModel, selectedRole)}
        model={selectedModel}
        maxInputLength={modelMaxLengths[selectedModel] || 1000}
        className="text-sm w-full"
      />
    </div>
  );
}
