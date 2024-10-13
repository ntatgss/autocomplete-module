import { processSuggestion } from './suggestionProcessor';
import { Configuration, OpenAIApi } from 'openai-edge';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const modelMaxLengths: { [key: string]: number } = {
    'anthropic/claude-3-haiku-20240307': 8192,
    'openai/gpt-4o-mini': 8192,
    'lmstudio': 8192, // Default value for LMStudio models
};

const LMSTUDIO_BASE_URL = 'http://localhost:1234/v1';

// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateSuggestion(input: string, model: string): Promise<string> {
    let modelType: string, modelName: string;

    if (model.startsWith('openai/')) {
        modelType = 'openai';
        modelName = model.split('/')[1];
        // Keep the original model name for GPT-4o-mini
        if (modelName === 'gpt-4o-mini') {
            modelName = 'gpt-4o-mini';  // Don't change this to 'gpt-4'
        }
    } else if (model.startsWith('lmstudio:')) {
        modelType = 'lmstudio';
        modelName = model.split(':')[1];
    } else {
        modelType = 'anthropic';
        modelName = model;
    }

    const messages: Message[] = [{ 
        role: 'user', 
        content: `Continue this text with a few words or up to 2 sentences: ${input}` 
    }];

    let suggestion: string;

    try {
        switch (modelType) {
            case 'openai':
                suggestion = await handleOpenAIRequest(modelName, messages);
                break;
            case 'lmstudio':
                suggestion = await handleLMStudioRequest(modelName, messages);
                break;
            case 'anthropic':
                suggestion = await handleAnthropicRequest(modelName, messages);
                break;
            default:
                throw new Error(`Unknown model type: ${modelType}`);
        }

        return processSuggestion(input, suggestion);
    } catch (error) {
        throw error;
    }
}

async function handleOpenAIRequest(modelName: string, messages: Message[]): Promise<string> {
    const openAIMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    try {
        const response = await openai.createChatCompletion({
            model: modelName,
            messages: openAIMessages,
            max_tokens: 50,
            stream: false, // Set to false
        });

        // Since we're not streaming, we can directly access the response data
        const completion = await response.json();
        const content = completion.choices[0].message.content;

        return content.trim();
    } catch (error) {
        throw new Error(`Failed to generate suggestion: ${error}`);
    }
}

async function handleLMStudioRequest(modelName: string, messages: Message[]): Promise<string> {
    const response = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: messages,
            model: modelName,
            max_tokens: 50,
        }),
    });

    if (!response.ok) {
        throw new Error(`LMStudio server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

async function handleAnthropicRequest(modelName: string, messages: Message[]): Promise<string> {
    const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages,
            model: modelName,
            max_tokens: 50,
        }),
    });

    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    return await response.text();
}