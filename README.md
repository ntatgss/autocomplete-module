# AI-Powered Autocomplete Next.js App

This is an advanced AI-powered autocomplete module for text suggestions, designed to work with various AI models including OpenAI, Anthropic Claude, and LMStudio.

![AI Autocomplete Demo](/public/ai-autocomplete.png)

## Features

- Multi-model support: OpenAI, Anthropic Claude, and LMStudio models
- Real-time AI-powered text suggestions
- React component for seamless integration
- Customizable suggestion generation with adjustable parameters
- Efficient text processing and suggestion refinement
- Dynamic model selection with API-based model fetching for LMStudio
- Keyboard shortcuts for accepting suggestions (Tab) and hiding suggestions (Esc)
- Configurable maximum input length based on model capabilities
- Error handling and loading states for improved user experience
- Dark mode support with next-themes
- Tailwind CSS for responsive and customizable styling

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ntatgss/autocomplete-module.git
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Components

- `Autocomplete`: The main component for text input and suggestion display.
- `aiService`: Handles communication with AI models and suggestion generation.
- `suggestionProcessor`: Processes and refines the generated suggestions.

## Supported Models

- OpenAI models (e.g., 'gpt-4o-mini')
- Anthropic models (e.g., 'claude-3-haiku-20240307')
- LMStudio models

## Configuration for AI Models

- Set the appropriate API keys for OpenAI and Anthropic in your `.env.local` file.
- For LMStudio models:
  1. Download LMStudio from [https://lmstudio.ai/](https://lmstudio.ai/)
  2. Load a model in the LMStudio app
  3. Start the server in LMStudio before using it with this project

## Project Structure

- `app/`: Next.js app directory containing pages and API routes
- `components/`: React components including the Autocomplete module
- `public/`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
