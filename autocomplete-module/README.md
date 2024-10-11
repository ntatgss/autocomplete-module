# AI Autocomplete Module

This module provides AI-powered autocomplete functionality for text input.

## Installation
```bash
npm install @ntatgss/autocomplete-module
```

## Usage

```javascript
import { Autocomplete } from '@ntatgss/autocomplete-module';
// Use the Autocomplete component in your React application
<Autocomplete
onSelect={(selected) => console.log('Selected:', selected)}
generateSuggestions={(input, model) => / Your suggestion generation logic /}
model="your-chosen-model"
maxInputLength={1000}
/>
```

## API

### Autocomplete Component Props

- `onSelect: (selected: string) => void`: Callback function when a suggestion is selected.
- `generateSuggestions: (input: string, model: string) => Promise<string>`: Function to generate suggestions.
- `model: string`: The AI model to use for generating suggestions.
- `maxInputLength: number`: Maximum length of the input text.

### Helper Functions

- `generateSuggestion(input: string, model: string): Promise<string>`: Generate a suggestion based on input and model.
- `processSuggestion(input: string, suggestion: string): string`: Process and refine the generated suggestion.

## Supported Models

- OpenAI models (e.g., 'openai/gpt-4o-mini')
- Anthropic models (e.g., 'anthropic/claude-3-haiku-20240307')
- LMStudio models

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.