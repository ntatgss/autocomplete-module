# AI-Powered Autocomplete Next.js App Example

This is an example of an AI-powered autocomplete module for text suggestions, designed to work with various AI models including OpenAI, Anthropic, and LMStudio.

## Features

- Multi-model support: OpenAI, Anthropic Claude, and LMStudio models
- Real-time AI-powered text suggestions
- React component for seamless integration
- Customizable suggestion generation with adjustable parameters
- Efficient text processing and suggestion refinement
- Dynamic model selection with API-based model fetching for LMStudio
- Streaming responses for improved performance
- Keyboard shortcuts for accepting suggestions (Tab) and hiding suggestions (Esc)
- Configurable maximum input length based on model capabilities
- Error handling and loading states for improved user experience
- Tailwind CSS for responsive and customizable styling

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/ntatgss/autocomplete-module.git
```

Install the dependencies:

```bash
npm install
```

Create a `.env.local` file in the root directory and add your API keys:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Helper Functions

- `generateSuggestion(input: string, model: string): Promise<string>`: Generate a suggestion based on input and model.
- `processSuggestion(input: string, suggestion: string): string`: Process and refine the generated suggestion.

## Supported Models

- OpenAI models (e.g., 'openai/gpt-4o-mini')
- Anthropic models (e.g., 'anthropic/claude-3-haiku-20240307')
- LMStudio models

## Configuration for AI Models

Make sure to set the appropriate API keys for the AI models you're using in your `.env.local` file.

For LMStudio models, download LMStudio from [https://lmstudio.ai/](https://lmstudio.ai/) and load a model in the app. Ensure you start the server in LMStudio before using it with this project.

## Project Structure

- `app/`: Next.js app directory containing pages and API routes
- `autocomplete-module/`: Core autocomplete functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
