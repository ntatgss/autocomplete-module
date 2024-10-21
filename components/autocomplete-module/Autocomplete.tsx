import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, KeyboardEvent, TouchEvent } from 'react';
import { Button } from "@/components/ui/button"

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
    const [exceededMaxLength, setExceededMaxLength] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);
    const [isTouchScrolling, setIsTouchScrolling] = useState(false);

    const getSuggestion = async () => {
      if (input.trim() && input.length <= maxInputLength) {
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

      if (cursorPosition === input.length && input.trim().length > 0 && input.length <= maxInputLength) {
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
    }, [input, model, cursorPosition, maxInputLength]);

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
      const newInput = e.target.value;
      setInput(newInput);
      setCursorPosition(e.target.selectionStart);
      setShowSuggestion(e.target.selectionStart === newInput.length);
      setExceededMaxLength(newInput.length > maxInputLength);

      // Allow typing beyond maxLength, but don't update state
      if (e.target.value.length > maxInputLength) {
        e.target.value = newInput;
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }
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

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      setIsTouchScrolling(true);
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
      setIsTouchScrolling(false);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
      if (isTouchScrolling && suggestionRef.current) {
        e.stopPropagation();
      }
    };

    const handleAcceptSuggestion = () => {
      if (suggestion) {
        const newInput = input + suggestion;
        setInput(newInput.slice(0, maxInputLength));
        onSelect(newInput);
        setSuggestion('');
        setShowSuggestion(false);
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newInput.length, newInput.length);
        }
        // Trigger new suggestion generation immediately
        getSuggestion();
      }
    };

    const handleDismissSuggestion = () => {
      setShowSuggestion(false);
    };

    return (
      <div className={`relative w-full h-full flex flex-col ${className}`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
          className="flex w-full p-2 border rounded resize-none text-sm bg-background text-foreground flex-grow"
          placeholder="Start typing..."
          aria-label="Autocomplete input"
          aria-describedby="autocomplete-suggestion"
          style={{ 
            minHeight: '100px',
            maxHeight: 'calc(100% - 150px)', // Adjust this value as needed
            overflowY: 'auto',
          }}
        />
        <div className="flex-shrink-0 bg-background mt-2">
          <div className="max-h-[150px] overflow-y-auto"> {/* Adjust max-height as needed */}
            {exceededMaxLength && (
              <div className="text-yellow-500 text-sm mb-2" role="alert">
                Input exceeds {maxInputLength} characters. AI suggestions will only use the first {maxInputLength} characters.
              </div>
            )}
            <div className="text-sm mb-2">
              {isLoading && <div className="text-gray-500">Loading suggestion...</div>}
              {!isLoading && isThinking && <div className="text-gray-500">Thinking...</div>}
            </div>
            {showSuggestion && suggestion && (
              <div className="flex flex-col border rounded">
                <div 
                  ref={suggestionRef}
                  className={`p-2 bg-background overflow-auto ${suggestionClassName}`}
                  style={{ maxHeight: '80px' }} // Adjust this value as needed
                  id="autocomplete-suggestion"
                  role="status"
                  aria-live="polite"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  <div className="whitespace-pre-wrap break-words text-sm">
                    <span className="text-foreground">{input}</span>
                    <span className="text-muted-foreground bg-accent">
                      {suggestion}
                    </span>
                  </div>
                </div>
                <div className="bg-background border-t p-2 flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={handleDismissSuggestion}>
                    Dismiss
                  </Button>
                  <Button size="sm" onClick={handleAcceptSuggestion}>
                    Accept
                  </Button>
                </div>
              </div>
            )}
            {error && (
              <div className="text-red-500 mt-2" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default Autocomplete;
