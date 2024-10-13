# AI-Powered Autocomplete Next.js App Example

This is an example of an AI-powered autocomplete module for text suggestions, designed to work with various AI models including OpenAI, Anthropic, and LMStudio.

## Features

- Supports multiple AI models (OpenAI, Anthropic, LMStudio)
- React component for easy integration
- Customizable suggestion generation
- Efficient text processing

## Getting Started

First, pull the repo from Github

```bash
git clone https://github.com/ntatgss/autocomplete-module.git
```

Install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

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


## Configuration

Make sure to set the appropriate API keys for the AI models you're using. For OpenAI, set the `OPENAI_API_KEY` environment variable. For Anthropic, set the `ANTHROPIC_API_KEY` environment variable.

For LMStudio models, download LMStudio from https://lmstudio.ai/ and load model in-app. Make sure you start the server in LMStudio.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the file LICENSE for details.