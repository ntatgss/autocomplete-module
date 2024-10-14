import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, KeyboardEvent } from 'react';

interface AutocompleteProps {
  onSelect: (selected: string) => void;
  generateSuggestions: (input: string, model: string) => Promise<string>;
  model: string;
  maxInputLength: number;
  className?: string;
  suggestionClassName?: string;
}

// Define a new interface for the ref
export interface AutocompleteRef {
  getValue: () => string;
}

const Autocomplete = forwardRef<AutocompleteRef, AutocompleteProps>(
  ({ 
    onSelect, 
    generateSuggestions, 
    model, 
    maxInputLength,
    className = '',
    suggestionClassName = ''
  }, ref) => {
    const [input, setInput] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [showSuggestion, setShowSuggestion] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getSuggestion = async () => {
      if (input.trim()) {
        setIsLoading(true);
        setIsThinking(false);
        try {
          const newSuggestion = await generateSuggestions(input, model);
          if (newSuggestion.length > 0) {
            setSuggestion(newSuggestion);
            setShowSuggestion(true);
          } else {
            setSuggestion('');
            setShowSuggestion(false);
          }
          setError(null);
        } catch (error) {
          console.error('Error generating suggestion:', error);
          setSuggestion('');
          setShowSuggestion(false);
          setError('Failed to generate suggestion. Please try again.');
        } finally {
          setIsLoading(false);
          setIsThinking(false);
        }
      } else {
        setSuggestion('');
        setShowSuggestion(false);
      }
    };

    useEffect(() => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }

      setIsThinking(false);
      setIsLoading(false);

      if (cursorPosition === input.length && input.trim().length > 0) {
        thinkingTimeoutRef.current = setTimeout(() => {
          if (input.trim().length > 0) {
            setIsThinking(true);
          }
        }, 500);
        suggestionTimeoutRef.current = setTimeout(getSuggestion, 2000);
      } else {
        setSuggestion('');
        setShowSuggestion(false);
      }

      return () => {
        if (suggestionTimeoutRef.current) {
          clearTimeout(suggestionTimeoutRef.current);
        }
        if (thinkingTimeoutRef.current) {
          clearTimeout(thinkingTimeoutRef.current);
        }
      };
    }, [input, model, cursorPosition]);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [input]);

    useImperativeHandle(ref, () => ({
      getValue: () => input
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newInput = e.target.value.slice(0, maxInputLength);
      setInput(newInput);
      setCursorPosition(e.target.selectionStart);
      setShowSuggestion(e.target.selectionStart === newInput.length);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab' && suggestion && cursorPosition === input.length) {
        e.preventDefault();
        const newInput = input + suggestion;
        setInput(newInput.slice(0, maxInputLength));
        setCursorPosition(newInput.length);
        onSelect(newInput);
        setSuggestion('');
        setShowSuggestion(false);
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newInput.length, newInput.length);
        }
        // Trigger new suggestion generation immediately
        getSuggestion();
      } else if (e.key === 'Escape') {
        setShowSuggestion(false);
      }
    };

    return (
      <div className={`relative w-full ${className}`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
          className="w-full p-2 border rounded resize-none overflow-hidden text-sm"
          style={{ minHeight: '100px' }}
          placeholder="Start typing..."
          aria-label="Autocomplete input"
          aria-describedby="autocomplete-suggestion"
        />
        <div className="mt-2 text-sm">
          {isLoading && <div className="text-gray-500">Loading suggestion...</div>}
          {!isLoading && isThinking && <div className="text-gray-500">Thinking...</div>}
        </div>
        {showSuggestion && suggestion && (
          <div 
            className="absolute left-0 right-0 p-2 bg-gray-100 border-l border-r border-b rounded-b max-h-40 overflow-y-auto"
            id="autocomplete-suggestion"
            role="status"
            aria-live="polite"
          >
            <div className="whitespace-pre-wrap break-words text-sm">
              <span style={{ color: 'black !important' }}>{input}</span>
              <span style={{ 
                color: '#9CA3AF', 
                padding: '0 2px', 
                borderRadius: '2px',
              }}>
                {suggestion}
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 mt-2" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default Autocomplete;
